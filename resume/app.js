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
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
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
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
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
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        const mailtoLink = `mailto:ymus@tuta.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

// Loader classes to fetch and render JSON-driven content
class ExperienceLoader {
    constructor() {
        this.init();
    }
    async init() {
        try {
            const data = await fetch('experience.json').then(res => res.json());
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
                    <div class="timeline__period">${item.period}</div>
                    <h3 class="timeline__title">${item.title}</h3>
                    <div class="timeline__company">${item.company}</div>
                    <ul class="timeline__achievements">
                        ${item.achievements.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                `;
                itemDiv.appendChild(markerDiv);
                itemDiv.appendChild(contentDiv);
                container.appendChild(itemDiv);
            });
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
            const data = await fetch('skills.json').then(res => res.json());
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

class ApplicationsLoader {
    constructor() {
        this.init();
    }
    async init() {
        try {
            const data = await fetch('applications.json').then(res => res.json());
            const tbody = document.querySelector('.agenda__list table tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.forEach(app => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${app.company}</td>
                    <td>${app.position}</td>
                    <td>${app.dateApplied}</td>
                    <td>${app.status}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading applications data:', error);
        }
    }
}

class AgendaLoader {
    constructor() {
        this.init();
    }
    async init() {
        try {
            const data = await fetch('agenda.json').then(res => res.json());
            const monthName = data.month;
            const year = data.year;
            const availableDates = data.availableDates;
            const monthTitleElem = document.querySelector('.calendar__title');
            const datesContainer = document.querySelector('.calendar__dates');
            if (!monthTitleElem || !datesContainer) return;
            monthTitleElem.textContent = `${monthName} ${year}`;
            datesContainer.innerHTML = '';
            const monthIndex = new Date(Date.parse(`${monthName} 1, 2000`)).getMonth();
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
            el.style.cursor = 'pointer';
            el.addEventListener('click', (e) => this.handleDateClick(e));
        });
    }

    handleDateClick(e) {
        const el = e.currentTarget;
        const day = el.textContent.trim();
        const [monthName, yearStr] = this.monthTitleElement.textContent.trim().split(' ');
        const year = parseInt(yearStr, 10);
        const month = new Date(Date.parse(`${monthName} 1, 2020`)).getMonth() + 1;
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

// Application Initialization
class PortfolioApp {
    constructor() {
        this.components = [];
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialize all components
            this.components = [
                new ThemeManager(),
                new NavigationManager(),
                new TypingAnimation(),
                new ContactFormManager(),
                new ScrollAnimations(),
                new ExperienceLoader(),
                new SkillsLoader(),
                new SkillsAnimation(),
                new ApplicationsLoader(),
                new AgendaLoader(),
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
    
    // Method to reinitialize components if needed
    reinitialize() {
        this.components.forEach(component => {
            if (component.destroy && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        this.initializeComponents();
    }
}

// Initialize the application
const portfolioApp = new PortfolioApp();

// Export for potential external use
if (typeof window !== 'undefined') {
    window.PortfolioApp = PortfolioApp;
}

// Add some utility functions for external use
window.portfolioUtils = {
    scrollToSection: (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    
    toggleTheme: () => {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.click();
        }
    },
    
    openContactForm: () => {
        portfolioUtils.scrollToSection('contact');
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
        }, 1000);
    }
};

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Add focus management for accessibility
document.addEventListener('focusin', (e) => {
    if (e.target.matches('.nav__link')) {
        e.target.style.outline = '2px solid var(--color-primary)';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', (e) => {
    if (e.target.matches('.nav__link')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});