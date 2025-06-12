#!/usr/bin/env bash
set -e

# Paths
SRC="resume/index.html"
TMP="resume/index.html.tmp"
JSON_DIR="resume/translations"
JSON_FILE="$JSON_DIR/en.json"

# Ensure translations directory exists
mkdir -p "$JSON_DIR"

# Extract all unique non-empty text nodes
grep -Po '(?<=\>)[^<\n]+' "$SRC" \
  | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' \
  | grep -P '\w' \
  | sort \
  | uniq > texts.txt

# Generate JSON skeleton
echo '{' > "$JSON_FILE"
awk '{
  # Escape quotes in text
  text=$0; gsub(/"/, "\\\"
", text);
  # Generate a slug key
  key=tolower(text);
  gsub(/[^a-z0-9]+/, "-", key);
  gsub(/^-|-$//g, "", key);
  printf "  \"%s\": \"%s\",\n", key, text;
}' texts.txt >> "$JSON_FILE"
# Remove trailing comma and close JSON
sed -i '$ s/,$//' "$JSON_FILE"
echo '}' >> "$JSON_FILE"

# Annotate HTML with data-i18n-key attributes inline
perl -0777 -pe 's{(<[^>]+?)(>)([^<]+)(<)}{
    my ($open, $gt, $text, $lt) = ($1, $2, $3, $4);
    # Trim whitespace
    my $t = $text; $t =~ s/^\s+|\s+$//g;
    if ($t) {
        # Skip if already has an i18n key
        if ($open =~ /\sdata-i18n-key\s*=/) {
            "$open$gt$text$lt";
        } else {
            my $key = lc($t);
            $key =~ s/[^a-z0-9]+/-/g;
            $key =~ s/^-|-$//g;
            "$open data-i18n-key=\"$key\"$gt$text$lt";
        }
    } else {
        "$open$gt$text$lt";
    }
}gse' "$SRC" > "$TMP" && mv "$TMP" "$SRC"

# Cleanup
rm texts.txt

echo "i18n annotations and translation file generated." 