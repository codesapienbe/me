// Portfolio Application JavaScript

// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        const themeText = this.themeToggle.querySelector('.theme-text');
        if (themeText) {
            if (theme === 'dark') {
                themeText.textContent = 'Light Mode';
                themeText.setAttribute('data-i18n-key', 'nav.themeMode.light');
            } else {
                themeText.textContent = 'Dark Mode';
                themeText.setAttribute('data-i18n-key', 'nav.themeMode.dark');
            }
            // Re-apply i18n translation to the themeText
            if (window.localizationManager && typeof window.localizationManager.init === 'function') {
                window.localizationManager.init();
            }
        }
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.nav = document.getElementById('nav');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupActiveNavigation();
    }
    
    setupMobileNavigation() {
        // Initialize ARIA attributes
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navToggle.setAttribute('aria-controls', this.navMenu.id);
        this.navMenu.setAttribute('role', 'menu');
        this.navLinks.forEach(link => link.setAttribute('role', 'menuitem'));
        this.navToggle.addEventListener('click', () => {
            const expanded = this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
            this.navToggle.setAttribute('aria-expanded', expanded);
        });
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class for navigation styling
            if (currentScrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    setupActiveNavigation() {
        const observerOptions = {
            rootMargin: '-100px 0px -66%',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    this.updateActiveNavLink(activeId);
                }
            });
        }, observerOptions);
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    updateActiveNavLink(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }
}

// Typing Animation
class TypingAnimation {
    constructor() {
        this.textElement = document.getElementById('typingText');
        this.roles = ['Java Developer', 'AI/ML Expert', 'Full-Stack Engineer', 'Software Architect'];
        this.currentRoleIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }
    
    init() {
        this.type();
    }
    
    type() {
        const currentRole = this.roles[this.currentRoleIndex];
        
        if (this.isDeleting) {
            this.textElement.textContent = currentRole.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.textElement.textContent = currentRole.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentRole.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Contact Form Management
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.nameField = document.getElementById('name');
        this.emailField = document.getElementById('email');
        this.subjectField = document.getElementById('subject');
        this.messageField = document.getElementById('message');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.nameField.addEventListener('blur', () => this.validateName());
        this.emailField.addEventListener('blur', () => this.validateEmail());
        this.messageField.addEventListener('blur', () => this.validateMessage());
        
        // Clear errors on input
        this.nameField.addEventListener('input', () => this.clearError('name'));
        this.emailField.addEventListener('input', () => this.clearError('email'));
        this.messageField.addEventListener('input', () => this.clearError('message'));
        
        // Setup meeting request controls
        this.requestMeetingCheckbox = document.getElementById('requestMeeting');
        this.meetingDetails = document.querySelector('.meeting-details');
        if (this.requestMeetingCheckbox) {
            this.requestMeetingCheckbox.addEventListener('change', () => {
                this.meetingDetails.style.display = this.requestMeetingCheckbox.checked ? 'block' : 'none';
            });
            flatpickr('#meetingDateTime', { enableTime: true, dateFormat: 'Y-m-d H:i' });
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const isValid = this.validateForm();
        
        if (isValid) {
            this.submitForm();
        }
    }
    
    validateForm() {
        const nameValid = this.validateName();
        const emailValid = this.validateEmail();
        const messageValid = this.validateMessage();
        
        return nameValid && emailValid && messageValid;
    }
    
    validateName() {
        const name = this.nameField.value.trim();
        if (name.length < 2) {
            this.showError('name', 'Name must be at least 2 characters long');
            return false;
        }
        this.clearError('name');
        return true;
    }
    
    validateEmail() {
        const email = this.emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }
        this.clearError('email');
        return true;
    }
    
    validateMessage() {
        const message = this.messageField.value.trim();
        if (message.length < 10) {
            this.showError('message', 'Message must be at least 10 characters long');
            return false;
        }
        this.clearError('message');
        return true;
    }
    
    showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        field.classList.remove('error');
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
    
    async submitForm() {
        const name = this.nameField.value.trim();
        const email = this.emailField.value.trim();
        const subject = this.subjectField.value.trim();
        const message = this.messageField.value.trim();
        let body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        let meetingDateTime;
        if (this.requestMeetingCheckbox && this.requestMeetingCheckbox.checked) {
            meetingDateTime = document.getElementById('meetingDateTime').value;
            body += `\nMeeting Requested: ${meetingDateTime}`;
        }
        const mailtoLink = `mailto:yilmaz@codesapien.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        // Open mailto link to launch default mail client
        if (!window.open(mailtoLink, '_self')) {
            // Fallback: create and click a temporary link
            const tempLink = document.createElement('a');
            tempLink.href = mailtoLink;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        }
        // If meeting requested, generate an ICS invitation
        if (meetingDateTime) {
            this.generateMeetingICS(meetingDateTime, name, email);
        }
    }
    
    showSuccessMessage() {
        // Create and show success notification
        this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    }
    
    showErrorMessage() {
        this.showNotification('Failed to send message. Please try again later.', 'error');
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add styles for notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? 'var(--color-success)' : 'var(--color-error)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    generateMeetingICS(dateTime, name, email) {
        const date = new Date(dateTime);
        const pad = num => num.toString().padStart(2, '0');
        const uid = Date.now();
        const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const dtStart = `${date.getUTCFullYear()}${pad(date.getUTCMonth()+1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
        const endDate = new Date(date.getTime() + 60 * 60 * 1000);
        const dtEnd = `${endDate.getUTCFullYear()}${pad(endDate.getUTCMonth()+1)}${pad(endDate.getUTCDate())}T${pad(endDate.getUTCHours())}${pad(endDate.getUTCMinutes())}00Z`;
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Yilmaz On Web//Meeting Request//EN',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${dtStamp}`,
            `DTSTART:${dtStart}`,
            `DTEND:${dtEnd}`,
            `SUMMARY:Meeting with ${name}`,
            `DESCRIPTION:Requested by ${name} <${email}>`,
            'END:VEVENT',
            'END:VCALENDAR'
        ];
        const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meeting-${uid}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.card, .timeline__item, .skill-category, .project-card, .stat');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.setupScrollObserver();
        this.addAnimationClasses();
    }
    
    addAnimationClasses() {
        this.animatedElements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.1}s`;
        });
    }
    
    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Skills Animation
class SkillsAnimation {
    constructor() {
        this.skillTags = document.querySelectorAll('.skill-tag');
        this.init();
    }
    
    init() {
        this.skillTags.forEach((tag, index) => {
            // Add staggered animation delay
            tag.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effect enhancement
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Statistics Counter Animation
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat__number');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.hero__stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    animateCounters() {
        this.stats.forEach(stat => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/\D/g, ''));
            const suffix = finalValue.replace(/[\d\s]/g, '');
            
            if (numericValue) {
                this.animateCounter(stat, 0, numericValue, suffix, 2000);
            }
        });
    }
    
    animateCounter(element, start, end, suffix, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }
}

// Project Cards Enhancement
class ProjectCardsManager {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.projectCards.forEach(card => {
            this.enhanceCard(card);
        });
    }
    
    enhanceCard(card) {
        // Add subtle parallax effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
        
        // Add click effect
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            }
        });
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.addIntersectionObserverPolyfill();
        this.optimizeScrollEvents();
    }
    
    optimizeImages() {
        // Add loading="lazy" to images when they're added
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    addIntersectionObserverPolyfill() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported. Consider adding a polyfill.');
        }
    }
    
    optimizeScrollEvents() {
        // Throttle scroll events for better performance
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll event handling is already optimized in NavigationManager
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// Localization Manager for UI translations
document.documentElement.setAttribute('lang', navigator.language || 'en');
class LocalizationManager {
    constructor() {
        this.init();
    }

    async init() {
        // Determine language
        let lang = localStorage.getItem('lang') || (navigator.language || 'en');
        lang = this.normalizeLang(lang);
        this.lang = lang;

        // Set HTML lang attribute for accessibility
        document.documentElement.setAttribute('lang', this.lang);

        // Load translations
        try {
            this.translations = await fetch(`translations/${lang}.json`).then(res => res.json());
        } catch {
            this.translations = {};
        }

        // Apply translations to elements with data-i18n-key
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            const text = this.translations[key] || el.textContent.trim();
            const attr = el.getAttribute('data-i18n-attr');
            if (attr) {
                el.setAttribute(attr, text);
            } else if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });

        // Also translate any element without data-i18n-key by using its textContent as the key
        document.querySelectorAll('body *').forEach(el => {
            // skip if already handled or has children
            if (el.hasAttribute('data-i18n-key') || el.children.length > 0) return;
            const keyText = el.textContent.trim();
            if (!keyText) return;
            const translated = this.translations[keyText];
            if (translated) {
                el.textContent = translated;
            }
        });

        // Setup language selector
        const select = document.getElementById('languageSelect');
        if (select) {
            select.value = lang;
            select.addEventListener('change', e => {
                localStorage.setItem('lang', e.target.value);
                window.location.reload();
            });
        }

        // Chat popup toggle controls
        this.launcher = document.getElementById('chatLauncher');
        this.popup = document.getElementById('chatPopup');
        this.closeBtn = document.getElementById('chatClose');
        if (this.launcher && this.popup) {
            // Initialize ARIA
            this.launcher.setAttribute('aria-expanded', 'false');
            this.popup.setAttribute('aria-hidden', 'true');
            this.launcher.addEventListener('click', () => {
                const isVisible = this.popup.classList.toggle('visible');
                this.popup.setAttribute('aria-modal', isVisible);
                this.popup.setAttribute('aria-hidden', !isVisible);
                this.launcher.setAttribute('aria-expanded', isVisible);
            });
        }
        if (this.closeBtn && this.popup) {
            this.closeBtn.addEventListener('click', () => {
                this.popup.classList.remove('visible');
                this.popup.setAttribute('aria-modal', 'false');
                this.popup.setAttribute('aria-hidden', 'true');
                this.launcher.setAttribute('aria-expanded', 'false');
            });
        }
    }

    normalizeLang(lang) {
        lang = lang.toLowerCase();
        if (lang.startsWith('nl')) return 'nl-BE';
        if (lang.startsWith('fr')) return 'fr-BE';
        if (lang.startsWith('de')) return 'de';
        if (lang.startsWith('tr')) return 'tr';
        return 'en';
    }
}

// Loader classes to fetch and render JSON-driven content
class ExperienceLoader {
    constructor() {
        this.init();
    }
    async init() {
        try {
            const data = await fetch(`experiences/experience-${window.localizationManager?.lang || 'en'}.json`).then(res => res.json());
            const container = document.querySelector('.experience .timeline');
            if (!container) return;
            container.innerHTML = '';
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'timeline__item';
                const markerDiv = document.createElement('div');
                markerDiv.className = 'timeline__marker';
                const contentDiv = document.createElement('div');
                contentDiv.className = 'timeline__content';
                contentDiv.innerHTML = `
                    <div class="timeline__period" data-i18n-key="timeline.${item.year}.period">${item.period}</div>
                    <h3 class="timeline__title" data-i18n-key="timeline.${item.year}.title">${item.title}</h3>
                    <div class="timeline__company" data-i18n-key="timeline.${item.year}.company">${item.company}</div>
                    <ul class="timeline__achievements">
                        ${item.achievements.map((a, i) => `<li data-i18n-key="timeline.${item.year}.achievement${i+1}">${a}</li>`).join('')}
                    </ul>
                `;
                itemDiv.appendChild(markerDiv);
                itemDiv.appendChild(contentDiv);
                container.appendChild(itemDiv);
            });
            // Re-apply i18n translation to new elements
            if (window.localizationManager && typeof window.localizationManager.init === 'function') {
                window.localizationManager.init();
            }
        } catch (error) {
            console.error('Error loading experience data:', error);
        }
    }
}

class SkillsLoader {
    constructor() {
        this.init();
    }
    async init() {
        try {
            const data = await fetch(`skills/skills-${window.localizationManager?.lang || 'en'}.json`).then(res => res.json());
            const grid = document.querySelector('.skills__grid');
            if (!grid) return;
            grid.innerHTML = '';
            data.forEach(cat => {
                const catDiv = document.createElement('div');
                catDiv.className = 'skill-category';
                catDiv.innerHTML = `
                    <h3 class="skill-category__title">${cat.category}</h3>
                    <div class="skill-tags">
                        ${cat.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                    </div>
                `;
                grid.appendChild(catDiv);
            });
            // Re-initialize tag animations for dynamic content
            new SkillsAnimation();
        } catch (error) {
            console.error('Error loading skills data:', error);
        }
    }
}

// Replace ApplicationsLoader with dynamic TasksAndAssignmentsLoader using Linear API
class TasksAndAssignmentsLoader {
    constructor() {
        this.init();
    }
    async init() {
        const apiKey = window.LINEAR_API_KEY;
        const endpoint = 'https://api.linear.app/graphql';

        // Fetch viewer ID
        let viewerId;
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey
                },
                body: JSON.stringify({ query: `query { viewer { id } }` })
            });
            const json = await res.json();
            viewerId = json.data.viewer.id;
        } catch (error) {
            console.error('Error fetching Linear viewer ID:', error);
            return;
        }

        // Fetch tasks assigned to the user
        const issuesQuery = `
            query Issues($assigneeId: String!) {
                issues(filter: { assignee: { id: { eq: $assigneeId } } }, orderBy: { createdAt: DESC }) {
                    nodes {
                        id
                        title
                        createdAt
                        state { name }
                        url
                    }
                }
            }
        `;
        let tasks = [];
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey
                },
                body: JSON.stringify({ query: issuesQuery, variables: { assigneeId: viewerId } })
            });
            const json = await res.json();
            tasks = json.data.issues.nodes;
        } catch (error) {
            console.error('Error fetching Linear tasks:', error);
            return;
        }

        // Populate table
        const tbody = document.querySelector('.agenda__list table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a href="${task.url}" target="_blank" rel="noopener">${task.title}</a></td>
                <td>${new Date(task.createdAt).toLocaleDateString()}</td>
                <td>${task.state.name}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

class AgendaLoader {
    constructor() {
        this.init();
    }
    async init() {
        try {
            const data = await fetch('agenda/agenda.json').then(res => res.json());
            const availableDates = data.availableDates;
            const year = data.year;
            const monthTitleElem = document.querySelector('.calendar__title');
            const datesContainer = document.querySelector('.calendar__dates');
            if (!monthTitleElem || !datesContainer) return;
            // Compute localized month name using HTML lang
            const lang = document.documentElement.getAttribute('lang') || 'en';
            const monthIndex = new Date(Date.parse(`${data.month} 1, 2000`)).getMonth();
            const localizedMonthName = new Date(year, monthIndex, 1).toLocaleString(lang, { month: 'long' });
            monthTitleElem.textContent = `${localizedMonthName} ${year}`;
            // Store English month for CalendarManager parsing
            monthTitleElem.setAttribute('data-month', data.month);
            datesContainer.innerHTML = '';
            const firstDay = new Date(year, monthIndex, 1).getDay();
            for (let i = 0; i < firstDay; i++) {
                const emptyDiv = document.createElement('div');
                datesContainer.appendChild(emptyDiv);
            }
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const dateDiv = document.createElement('div');
                dateDiv.className = 'calendar__date ' + (availableDates.includes(d) ? 'available' : 'unavailable');
                dateDiv.textContent = d;
                datesContainer.appendChild(dateDiv);
            }
            // Bind calendar date click handlers for ICS download
            new CalendarManager();
        } catch (error) {
            console.error('Error loading agenda data:', error);
        }
    }
}

class LocalQAManager {
    constructor() {
        this.init();
    }

    async init() {
        // Load JSON data for QA
        this.experience = await fetch(`experiences/experience-${document.documentElement.getAttribute('lang') || 'en'}.json`).then(res => res.json()).catch(() => []);
        this.skills = await fetch(`skills/skills-${document.documentElement.getAttribute('lang') || 'en'}.json`).then(res => res.json()).catch(() => []);
        this.applications = await fetch('applications/applications.json').then(res => res.json()).catch(() => []);
        this.agenda = await fetch('agenda/agenda.json').then(res => res.json()).catch(() => ({ availableDates: [], month: '', year: 0 }));

        // Initialize context and conversation memory
        this.context = {
            lastTopic: null,
            lastQuestion: null,
            conversationFlow: []
        };

        // Initialize synonyms for better question understanding
        this.synonyms = {
            greeting: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
            identity: ['who', 'what', 'identity', 'name', 'yourself'],
            contact: ['contact', 'reach', 'email', 'phone', 'call', 'message', 'communication'],
            work: ['work', 'job', 'employment', 'career', 'professional', 'occupation'],
            experience: ['experience', 'background', 'history', 'past', 'previous', 'worked'],
            skills: ['skills', 'technologies', 'tech', 'expertise', 'abilities', 'knowledge', 'proficient'],
            education: ['education', 'degree', 'university', 'college', 'school', 'studied', 'learning'],
            projects: ['projects', 'portfolio', 'built', 'developed', 'created', 'made'],
            availability: ['available', 'free', 'schedule', 'time', 'when', 'dates'],
            location: ['location', 'where', 'based', 'live', 'situated', 'place'],
            languages: ['languages', 'speak', 'fluent', 'multilingual'],
            interests: ['interests', 'hobbies', 'passion', 'enjoy', 'like'],
            achievements: ['achievements', 'awards', 'recognition', 'accomplishments', 'success'],
            applications: ['applications', 'applied', 'jobs', 'positions', 'interviews'],
            salary: ['salary', 'compensation', 'pay', 'wage', 'money', 'cost'],
            future: ['future', 'goals', 'plans', 'next', 'career path', 'ambitions']
        };

        // Initialize comprehensive question patterns
        this.questionPatterns = {
            greetings: {
                patterns: [
                    /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))\s*[!.]?$/i,
                    /^(what's\s+up|how\s+are\s+you|how\s+do\s+you\s+do)\s*\??$/i
                ],
                responses: [
                    "Hello! I'm Yilmaz Mustafa. How can I help you today?",
                    "Hi there! Feel free to ask me anything about my experience, skills, or availability.",
                    "Greetings! I'm here to answer questions about my professional background."
                ]
            },
            identity: {
                patterns: [
                    /^(who\s+are\s+you|what('s|\s+is)\s+your\s+name|tell\s+me\s+about\s+yourself)\s*\??$/i,
                    /^(introduce\s+yourself|your\s+identity|about\s+you)\s*\??$/i,
                    /^(what\s+do\s+you\s+do|your\s+profession|your\s+job)\s*\??$/i
                ],
                responses: [
                    "I'm Yilmaz Mustafa, a Software Engineer specializing in Java, AI/ML, and Full-Stack development. I have experience in building scalable applications and implementing machine learning solutions.",
                    "Hello! I'm Yilmaz Mustafa, a passionate software engineer with expertise in Java development, artificial intelligence, and full-stack web development.",
                    "I'm Yilmaz Mustafa, a dedicated Software Engineer focused on creating innovative solutions using Java, AI/ML technologies, and modern web development frameworks."
                ]
            },
            contact: {
                patterns: [
                    /^(what('s|\s+is)\s+your\s+email|how\s+to\s+contact|email\s+address)\s*\??$/i,
                    /^(phone\s+number|telephone|mobile|cell\s+phone|how\s+to\s+call)\s*\??$/i,
                    /^(contact\s+information|contact\s+details|reach\s+you)\s*\??$/i,
                    /^(social\s+media|linkedin|github|portfolio)\s*\??$/i
                ]
            },
            experience: {
                patterns: [
                    /^(work\s+experience|professional\s+background|career\s+history)\s*\??$/i,
                    /^(where\s+have\s+you\s+worked|previous\s+jobs|past\s+employment)\s*\??$/i,
                    /^(companies\s+worked\s+for|employers|work\s+history)\s*\??$/i,
                    /^(what\s+companies|which\s+companies|list\s+companies)\s*\??$/i,
                    /^(job\s+titles|roles|positions\s+held)\s*\??$/i,
                    /^(how\s+long\s+have\s+you\s+worked|years\s+of\s+experience)\s*\??$/i
                ]
            },
            skills: {
                patterns: [
                    /^(what\s+skills|technical\s+skills|programming\s+languages)\s*\??$/i,
                    /^(technologies\s+you\s+know|tech\s+stack|expertise)\s*\??$/i,
                    /^(programming\s+experience|coding\s+skills|development\s+skills)\s*\??$/i,
                    /^(java|python|javascript|react|spring|database|ai|ml|machine\s+learning)\s*\??$/i,
                    /^(frontend|backend|full.?stack|devops)\s*\??$/i
                ]
            },
            applications: {
                patterns: [
                    /^(job\s+applications|applied\s+positions|interview\s+status)\s*\??$/i,
                    /^(current\s+applications|job\s+search|position\s+status)\s*\??$/i,
                    /^(companies\s+applied|where\s+applied|application\s+status)\s*\??$/i,
                    /^(interviews\s+scheduled|upcoming\s+interviews)\s*\??$/i,
                    /^(offers\s+received|job\s+offers)\s*\??$/i
                ]
            },
            availability: {
                patterns: [
                    /^(when\s+are\s+you\s+available|availability|free\s+time)\s*\??$/i,
                    /^(schedule\s+interview|meeting\s+times|available\s+dates)\s*\??$/i,
                    /^(calendar|agenda|schedule)\s*\??$/i,
                    /^(next\s+week|this\s+week|available\s+soon)\s*\??$/i
                ]
            },
            achievements: {
                patterns: [
                    /^(achievements|accomplishments|awards|recognition)\s*\??$/i,
                    /^(projects\s+completed|successful\s+projects|portfolio)\s*\??$/i,
                    /^(hackathons|competitions|certifications)\s*\??$/i,
                    /^(notable\s+work|impressive\s+projects|highlights)\s*\??$/i
                ]
            },
            education: {
                patterns: [
                    /^(education|degree|university|college|studied)\s*\??$/i,
                    /^(academic\s+background|qualifications|credentials)\s*\??$/i,
                    /^(learning|courses|training|certification)\s*\??$/i
                ],
                responses: [
                    "I'm continuously learning and staying updated with the latest technologies in software development, AI/ML, and web development.",
                    "My technical expertise comes from both formal education and hands-on professional experience in software engineering.",
                    "I believe in continuous learning and regularly update my skills through courses, projects, and professional development."
                ]
            },
            location: {
                patterns: [
                    /^(where\s+are\s+you\s+located|location|based|live)\s*\??$/i,
                    /^(remote\s+work|work\s+remotely|onsite|hybrid)\s*\??$/i,
                    /^(relocation|willing\s+to\s+relocate|move)\s*\??$/i
                ],
                responses: [
                    "I'm based in Belgium and open to both remote and on-site opportunities.",
                    "I'm located in Belgium and flexible with work arrangements including remote, hybrid, or on-site positions.",
                    "Currently based in Belgium with flexibility for various work arrangements depending on the role."
                ]
            },
            salary: {
                patterns: [
                    /^(salary\s+expectations|compensation|pay\s+range)\s*\??$/i,
                    /^(how\s+much|cost|rate|hourly|annual)\s*\??$/i,
                    /^(budget|price|money|payment)\s*\??$/i
                ],
                responses: [
                    "Compensation expectations depend on the role, responsibilities, and company. I'm open to discussing this during the interview process.",
                    "I'm flexible with compensation and prefer to discuss this based on the specific role and its requirements.",
                    "Let's discuss compensation details during our conversation about the specific position and its scope."
                ]
            },
            future: {
                patterns: [
                    /^(career\s+goals|future\s+plans|where\s+do\s+you\s+see|ambitions)\s*\??$/i,
                    /^(next\s+steps|career\s+path|professional\s+growth)\s*\??$/i,
                    /^(five\s+years|long.?term|vision)\s*\??$/i
                ],
                responses: [
                    "I'm focused on growing as a software engineer, particularly in AI/ML applications and building scalable systems that solve real-world problems.",
                    "My goal is to continue developing expertise in cutting-edge technologies while contributing to innovative projects that make a meaningful impact.",
                    "I aim to advance my career in software engineering, with particular interest in AI/ML, system architecture, and leading technical teams."
                ]
            },
            help: {
                patterns: [
                    /^(help|what\s+can\s+you\s+tell|what\s+do\s+you\s+know)\s*\??$/i,
                    /^(commands|options|ask\s+you)\s*\??$/i
                ],
                responses: [
                    "I can answer questions about:\n• My work experience and background\n• Technical skills and expertise\n• Job applications and availability\n• Contact information\n• Career goals and achievements\n\nFeel free to ask anything!"
                ]
            }
        };

        // Bind UI elements
        this.input = document.getElementById('qaInput');
        this.button = document.getElementById('qaButton');
        this.output = document.getElementById('qaAnswer');
        
        if (this.button && this.input && this.output) {
            this.button.addEventListener('click', () => this.handleQuestion());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleQuestion();
            });
        }
    }

    async handleQuestion() {
        const question = this.input.value.trim();
        if (!question) return;

        // Enhanced keyword-based category detection (English only)
        const lang = document.documentElement.getAttribute('lang') || 'en';
        const normalized = question.toLowerCase().replace(/[^\w\s]/g, ' ');
        const stopwords = ['what','are','your','do','the','a','an','is','you','me','my','of','to','for'];
        const words = Array.from(new Set(
            normalized.split(/\s+/).filter(w => w && !stopwords.includes(w))
        ));
        if (lang === 'en' && words.some(w => this.synonyms.skills.includes(w))) {
            // Skill-related query detected via keywords
            const specific = this.skills.find(cat =>
                words.includes(cat.category.toLowerCase()) ||
                cat.skills.some(skill => words.includes(skill.toLowerCase()))
            );
            const resp = specific
                ? `${specific.category} Skills: ${specific.skills.join(', ')}`
                : this.skills.map(cat => `${cat.category}: ${cat.skills.join(', ')}`).join('\n\n');
            this.output.textContent = resp;
            this.input.value = '';
            return;
        }

        const q = question.toLowerCase().replace(/[^\w\s?]/g, ' ').replace(/\s+/g, ' ').trim();
        let resp = '';
        let matchFound = false;

        // Pattern-based matching for comprehensive responses
        for (const [category, data] of Object.entries(this.questionPatterns)) {
            if (data.patterns) {
                for (const pattern of data.patterns) {
                    if (pattern.test(q)) {
                        matchFound = true;
                        
                        // Handle specific categories with custom logic
                        if (category === 'contact') {
                            if (/email/i.test(q)) {
                                resp = "You can reach me at yilmaz@codesapien.net";
                            } else if (/phone|mobile|cell|telephone|call/i.test(q)) {
                                resp = "My phone number is +32 467 71 17 09";
                            } else if (/contact/i.test(q)) {
                                resp = "Contact Information:\n• Email: yilmaz@codesapien.net\n• Phone: +32 467 71 17 09";
                            } else {
                                resp = "For professional inquiries, please contact me at yilmaz@codesapien.net or +32 467 71 17 09";
                            }
                        } else if (category === 'experience') {
                            if (/companies|employers/i.test(q)) {
                                const companies = [...new Set(this.experience.map(i => i.company))];
                                resp = `I have worked with these companies: ${companies.join(', ')}`;
                            } else if (/titles|roles|positions/i.test(q)) {
                                const titles = [...new Set(this.experience.map(i => i.title))];
                                resp = `My professional roles include: ${titles.join(', ')}`;
                            } else if (/how\s+long|years/i.test(q)) {
                                resp = `I have ${this.experience.length} professional experiences spanning multiple years in software development.`;
                            } else {
                                resp = this.experience.map(i => `• ${i.period}: ${i.title} at ${i.company}`).join('\n');
                            }
                        } else if (category === 'skills') {
                            const techMentions = q;
                            const specificSkill = this.skills.find(cat => 
                                cat.category.toLowerCase().includes(techMentions) ||
                                cat.skills.some(skill => techMentions.includes(skill.toLowerCase()))
                            );

                            if (specificSkill) {
                                resp = `${specificSkill.category} Skills: ${specificSkill.skills.join(', ')}`;
                            } else {
                                resp = this.skills.map(cat => `${cat.category}:\n${cat.skills.map(skill => `• ${skill}`).join('\n')}`).join('\n\n');
                            }
                        } else if (category === 'applications') {
                            if (/interview/i.test(q)) {
                                const interviews = this.applications.filter(a => 
                                    a.status.toLowerCase().includes('interview')
                                );
                                resp = interviews.length > 0 ? 
                                    `Interviews Scheduled:\n${interviews.map(a => `• ${a.company} - ${a.position}`).join('\n')}` :
                                    "No interviews currently scheduled.";
                            } else if (/offer/i.test(q)) {
                                const offers = this.applications.filter(a => 
                                    a.status.toLowerCase().includes('offer')
                                );
                                resp = offers.length > 0 ? 
                                    `Offers Received:\n${offers.map(a => `• ${a.company} - ${a.position}`).join('\n')}` :
                                    "No offers currently received.";
                            } else {
                                resp = this.applications.map(a => `• ${a.company} (${a.position}) - ${a.status}`).join('\n');
                            }
                        } else if (category === 'availability') {
                            const dates = Array.isArray(this.agenda.availableDates) ? this.agenda.availableDates : [];
                            if (dates.length === 0) {
                                resp = "Please contact me to discuss availability for meetings or interviews.";
                            } else {
                                resp = `I'm available on: ${dates.join(', ')} ${this.agenda.month} ${this.agenda.year}`;
                            }
                        } else if (category === 'achievements') {
                            const achievements = this.experience.flatMap(i => i.achievements || []);
                            resp = achievements.length > 0 ? 
                                `Key Achievements:\n${achievements.map(a => `• ${a}`).join('\n')}` :
                                "Please contact me to discuss my project portfolio and achievements.";
                        } else if (data.responses) {
                            // Handle static responses
                            if (Array.isArray(data.responses)) {
                                const randomIndex = Math.floor(Math.random() * data.responses.length);
                                resp = data.responses[randomIndex];
                            } else {
                                resp = data.responses;
                            }
                        }
                        
                        // Update context
                        this.context.lastTopic = category;
                        this.context.lastQuestion = question;
                        this.context.conversationFlow.push({ question, category });
                        
                        if (this.context.conversationFlow.length > 10) {
                            this.context.conversationFlow = this.context.conversationFlow.slice(-5);
                        }
                        
                        break;
                    }
                }
                if (matchFound) break;
            }
        }

        // Fallback with legacy patterns if no match found
        if (!matchFound) {
            // Legacy question handling with enhancements
            if (/who are you\??/.test(q)) {
                resp = "I'm Yilmaz Mustafa, a Software Engineer specializing in Java, AI/ML, and Full-Stack development.";
            } else if (/what(?:'s| is) your email\??/.test(q)) {
                resp = 'You can reach me at yilmaz@codesapien.net';
            } else if (/what(?:'s| is) your phone number\??/.test(q)) {
                resp = 'My phone number is +32 467 71 17 09';
            } else if (/\bcompany\b|\bcompanies\b/.test(q)) {
                const companies = [...new Set(this.experience.map(i => i.company))];
                resp = 'Companies: ' + companies.join(', ');
            } else if (/\btitle\b|\brole\b|\bposition\b/.test(q)) {
                const titles = [...new Set(this.experience.map(i => i.title))];
                resp = 'Roles: ' + titles.join(', ');
            } else if (/\bachievement\b|\baward\b|\bhackathon\b|\btrained\b/.test(q)) {
                const achievements = this.experience.flatMap(i => i.achievements || []);
                resp = achievements.length > 0 ? 'Achievements: ' + achievements.join('; ') : 'Please contact me to discuss my achievements.';
            } else if (/\bexperience\b|\bwork\b/.test(q)) {
                resp = this.experience.map(i => `- ${i.period}: ${i.title} @ ${i.company}`).join('\n');
            } else if (/\bskill\b|\btechnology\b|\bexpertise\b/.test(q)) {
                const cat = this.skills.find(c => q.includes(c.category.toLowerCase()));
                if (cat) {
                    resp = `${cat.category} Skills: ${cat.skills.join(', ')}`;
                } else {
                    resp = this.skills.map(c => `${c.category}: ${c.skills.join(', ')}`).join('\n\n');
                }
            } else if (/\bapplication\b|\bapplied\b|\bstatus\b/.test(q)) {
                const statuses = ['Interview Scheduled', 'Application Submitted', 'Offer Received'];
                const statusMatch = statuses.find(s => q.includes(s.toLowerCase()));
                const apps = statusMatch ? this.applications.filter(a => a.status.toLowerCase() === statusMatch.toLowerCase()) : this.applications;
                resp = apps.map(a => `${a.company} (${a.position}) - ${a.status}`).join('\n');
            } else if (/\bavailable\b|\bavailability\b|\bagenda\b|\bdate\b|\bdates\b/.test(q)) {
                const dates = Array.isArray(this.agenda.availableDates) ? this.agenda.availableDates : [];
                resp = dates.length > 0 ? `Available on: ${dates.join(', ')} ${this.agenda.month} ${this.agenda.year}` : 'Please contact me to discuss availability.';
            } else {
                // Smart fallback based on keyword analysis
                const suggestions = [];
                const words = q.split(' ');
                const topics = Object.keys(this.synonyms);
                
                for (const topic of topics) {
                    if (this.synonyms[topic].some(syn => words.some(word => word.includes(syn) || syn.includes(word)))) {
                        suggestions.push(topic);
                    }
                }

                if (suggestions.length > 0) {
                    resp = `I'm not sure about that specific question, but I can help with information about: ${suggestions.join(', ')}. Could you please rephrase your question?`;
                } else if (this.context.lastTopic) {
                    resp = `I didn't quite understand that. Are you still asking about ${this.context.lastTopic}? Or would you like to know about something else like my experience, skills, or availability?`;
                } else {
                    resp = "I'm sorry, I don't understand that question. You can ask me about my work experience, skills, contact information, job applications, or availability. Type 'help' to see what I can answer.";
                }
            }
        }

        if (!matchFound) {
            this.output.textContent = 'Thinking…';
            try {
                // Build context from site content and JSON data
                const siteText = document.body.innerText;
                const experienceData = JSON.stringify(this.experience);
                const skillsData = JSON.stringify(this.skills);
                const applicationsData = JSON.stringify(this.applications);
                const agendaData = JSON.stringify(this.agenda);
                const contextText = [
                    `Site text:\n${siteText}`,
                    `Experience JSON:\n${experienceData}`,
                    `Skills JSON:\n${skillsData}`,
                    `Applications JSON:\n${applicationsData}`,
                    `Agenda JSON:\n${agendaData}`
                ].join('\n\n');
                const promptWithContext = `You are an assistant for the Yilmaz Mustafa personal website. Use only the context and site content below to answer the question, do not include any information not present in this data.\n\n${contextText}\n\nUser question: ${question}\nAnswer:`;
                const answer = await askLLM(promptWithContext);
                this.output.textContent = answer;
            } catch (e) {
                console.error(e);
                // Fallback to original response if LLM call fails
                this.output.textContent = resp;
            }
        } else {
            this.output.textContent = resp;
        }
        this.input.value = '';
    }
}


// Add CalendarManager class to handle calendar date clicks and ICS file generation
class CalendarManager {
    constructor() {
        this.dateElements = document.querySelectorAll('.calendar__date.available');
        this.timeSelect = document.getElementById('timeSelect');
        this.monthTitleElement = document.querySelector('.calendar__title');
        this.init();
    }

    init() {
        this.dateElements.forEach(el => {
            // Make date cells accessible
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.style.cursor = 'pointer';
            // Handle click
            el.addEventListener('click', (e) => this.handleDateClick(e));
            // Handle keyboard activation
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleDateClick({ currentTarget: el });
                }
            });
        });
    }

    handleDateClick(e) {
        const el = e.currentTarget;
        const day = el.textContent.trim();
        // Parse English month from data-month attribute and year from title
        const year = parseInt(this.monthTitleElement.textContent.trim().split(' ')[1], 10);
        const monthEnglish = this.monthTitleElement.getAttribute('data-month');
        const month = new Date(Date.parse(`${monthEnglish} 1, 2025`)).getMonth() + 1;
        const timeValue = this.timeSelect.value;
        if (!timeValue) {
            alert('Please select a time before scheduling an interview.');
            return;
        }
        const [hourStr, minuteStr] = timeValue.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const startDate = new Date(year, month - 1, parseInt(day, 10), hour, minute);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        const pad = (num) => num.toString().padStart(2, '0');
        const formatDate = (date) => {
            return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
        };
        const dtStamp = formatDate(new Date());
        const dtStart = formatDate(startDate);
        const dtEnd = formatDate(endDate);
        const uid = `${Date.now()}@yilmaz-on-web`;
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Yilmaz On Web//Interview Scheduler//EN',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${dtStamp}`,
            `DTSTART:${dtStart}`,
            `DTEND:${dtEnd}`,
            'SUMMARY:Interview Session',
            'DESCRIPTION:Interview scheduled via Yilmaz On Web',
            'END:VEVENT',
            'END:VCALENDAR'
        ];
        const icsContent = lines.join('\r\n');
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-${year}${pad(month)}${pad(day)}-${pad(hour)}${pad(minute)}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Text-to-Speech Manager for 'Listen' feature
class TTSManager {
    constructor() {
        this.launcher = document.getElementById('listenLauncher');
        this.speaking = false;
        this.init();
    }
    init() {
        if (this.launcher) {
            this.launcher.setAttribute('aria-pressed', 'false');
            this.launcher.addEventListener('click', () => this.toggleSpeech());
        }
    }
    toggleSpeech() {
        if (this.speaking) {
            window.speechSynthesis.cancel();
            this.speaking = false;
            this.launcher.setAttribute('aria-pressed', 'false');
        } else {
            this.speaking = true;
            this.launcher.setAttribute('aria-pressed', 'true');
            const content = this.buildSpeechContent();
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.rate = 1;
            utterance.pitch = 1;
            // Select language and male voice
            const lang = document.documentElement.getAttribute('lang') || 'en';
            const voices = window.speechSynthesis.getVoices();
            // Try to find a male voice for the current language
            let selectedVoice = voices.find(v => v.lang.startsWith(lang) && v.gender === 'male');
            // If no gender info, try by name heuristics
            if (!selectedVoice) {
                selectedVoice = voices.find(v => v.lang.startsWith(lang) && /male|man|boy|guy|fred|paul|alex|eric|daniel|james|tom|bruce|carlos|enrique|frank|jorge|luciano|maged|paolo|sergio|xander/i.test(v.name));
            }
            // Fallback: any voice in the language
            if (!selectedVoice) {
                selectedVoice = voices.find(v => v.lang.startsWith(lang));
            }
            // Fallback: default
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.lang = lang;
            utterance.onend = () => {
                this.speaking = false;
                this.launcher.setAttribute('aria-pressed', 'false');
            };
            window.speechSynthesis.speak(utterance);
        }
    }
    buildSpeechContent() {
        const parts = [];
        // Greeting and description
        const greet = document.querySelector('[data-i18n-key="hero.greeting"]')?.textContent.trim();
        const desc = document.querySelector('[data-i18n-key="hero.description"]')?.textContent.trim();
        if (greet) parts.push(greet);
        if (desc) parts.push(desc);
        // About section
        const about = Array.from(document.querySelectorAll('.about__text p')).map(p => p.textContent.trim()).join(' ');
        if (about) parts.push(about);
        // Experience
        const experiences = Array.from(document.querySelectorAll('.timeline__item')).map(item => {
            const title = item.querySelector('.timeline__title')?.textContent.trim();
            const company = item.querySelector('.timeline__company')?.textContent.trim();
            return title && company ? `${title} at ${company}` : title;
        }).filter(Boolean);
        if (experiences.length) parts.push(`Experience: ${experiences.join(', ')}.`);
        // Skills
        const skills = Array.from(document.querySelectorAll('.skill-tag')).map(el => el.textContent.trim());
        if (skills.length) parts.push(`Skills include ${skills.join(', ')}.`);
        // Projects (title and short description)
        const projectSummaries = Array.from(document.querySelectorAll('.project-card__content')).map(card => {
            const title = card.querySelector('.project-card__title')?.textContent.trim();
            const desc = card.querySelector('.project-card__description')?.textContent.trim();
            return title && desc ? `${title}: ${desc}` : title;
        }).filter(Boolean);
        if (projectSummaries.length) parts.push(`Projects: ${projectSummaries.join('; ')}.`);
        // Availability (calendar)
        const availableDays = Array.from(document.querySelectorAll('.calendar__date.available')).map(el => el.textContent.trim());
        if (availableDays.length) parts.push(`Available on: ${availableDays.join(', ')}.`);
        // Applications progress
        const appStatuses = Array.from(document.querySelectorAll('.agenda__list table tbody tr')).map(row => {
            const cells = row.querySelectorAll('td');
            const company = cells[0]?.textContent.trim();
            const position = cells[1]?.textContent.trim();
            const status = cells[3]?.textContent.trim();
            return company && position && status ? `${company} (${position}) is ${status}` : company;
        }).filter(Boolean);
        if (appStatuses.length) parts.push(`Applications: ${appStatuses.join('; ')}.`);
        // Contact information
        const email = document.querySelector('#contact a[href^="mailto:"]')?.textContent.trim();
        const phone = document.querySelector('#contact a[href^="tel:"]')?.textContent.trim();
        if (email || phone) {
            const contactParts = [];
            if (email) contactParts.push(`email at ${email}`);
            if (phone) contactParts.push(`phone at ${phone}`);
            parts.push(`Contact me via ${contactParts.join(' or ')}.`);
        }
        return parts.join(' ');
    }
}

// Application Initialization
class PortfolioApp {
    constructor() {
        this.components = [];
        this.init();
    }
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    initializeComponents() {
        try {
            this.components = [
                new LocalizationManager(),
                new ThemeManager(),
                new NavigationManager(),
                new TypingAnimation(),
                new ContactFormManager(),
                new ScrollAnimations(),
                new ExperienceLoader(),
                new SkillsLoader(),
                new SkillsAnimation(),
                new TasksAndAssignmentsLoader(),
                new AgendaLoader(),
                new LocalQAManager(),
                new TTSManager(),
                new CalendarManager(),
                new StatsCounter(),
                new ProjectCardsManager(),
                new PerformanceOptimizer()
            ];
            console.log('Portfolio application initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio application:', error);
        }
    }
    reinitialize() {
        this.components.forEach(component => {
            if (component.destroy && typeof component.destroy === 'function') component.destroy();
        });
        this.initializeComponents();
    }
}

const portfolioApp = new PortfolioApp();
if (typeof window !== 'undefined') window.PortfolioApp = PortfolioApp;

window.portfolioUtils = {
    scrollToSection: (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    },
    toggleTheme: () => {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.click();
    },
    openContactForm: () => {
        window.portfolioUtils.scrollToSection('contact');
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) nameField.focus();
        }, 1000);
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active'); navToggle.classList.remove('active');
        }
    }
});
document.addEventListener('focusin', (e) => {
    if (e.target.matches('.nav__link')) {
        e.target.style.outline = '2px solid var(--color-primary)'; e.target.style.outlineOffset = '2px';
    }
});
document.addEventListener('focusout', (e) => {
    if (e.target.matches('.nav__link')) {
        e.target.style.outline = ''; e.target.style.outlineOffset = '';
    }
});
