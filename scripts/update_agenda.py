#!/usr/bin/env python3
"""
Scans resume/ics for .ics files, parses VEVENT DTSTART dates, and updates resume/agenda.json
to remove dates that are now booked in any ICS files. Run before deploying the updated app.
"""
import os
import json
import re
from datetime import datetime

# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'resume'))
ICS_DIR = os.path.join(BASE_DIR, 'agenda')
AGENDA_FILE = os.path.join(BASE_DIR, 'agenda.json')

# Load existing agenda.json
with open(AGENDA_FILE, 'r', encoding='utf-8') as f:
    agenda = json.load(f)

month_name = agenda.get('month')
year = agenda.get('year')
original_dates = agenda.get('availableDates', [])

# Determine month index from English month name
try:
    month_index = datetime.strptime(month_name, '%B').month
except ValueError:
    month_index = None

scheduled = set()
if os.path.isdir(ICS_DIR):
    for fname in os.listdir(ICS_DIR):
        if not fname.lower().endswith('.ics'):
            continue
        path = os.path.join(ICS_DIR, fname)
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                m = re.match(r'^DTSTART(?:;[^:]*)?:(\d{8})', line)
                if m:
                    date_str = m.group(1)
                    try:
                        dt = datetime.strptime(date_str, '%Y%m%d')
                        if dt.year == year and dt.month == month_index:
                            scheduled.add(dt.day)
                    except ValueError:
                        pass

# Compute new available dates by removing scheduled ones
new_available = [d for d in original_dates if d not in scheduled]

# Update agenda.json
updated_agenda = {
    'month': month_name,
    'year': year,
    'availableDates': new_available
}
with open(AGENDA_FILE, 'w', encoding='utf-8') as f:
    json.dump(updated_agenda, f, indent=2)

print(f"agenda.json updated: removed {len(original_dates)-len(new_available)} booked date(s)") 