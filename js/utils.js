// Utility functions

// Dark mode detection and management
const ThemeManager = {
    init() {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('darkMode');
        
        // Priority: saved preference > system preference
        const isDark = savedTheme !== null ? savedTheme === 'true' : prefersDark;
        
        this.setTheme(isDark);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                this.setTheme(e.matches);
            }
        });
    },
    
    setTheme(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        const icon = document.getElementById('darkModeIcon');
        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }
    },
    
    toggle() {
        const isDark = !document.documentElement.classList.contains('dark');
        this.setTheme(isDark);
        localStorage.setItem('darkMode', isDark);
    },
};

// Language management
const LanguageManager = {
    current: 'vi',
    
    init() {
        const saved = localStorage.getItem('language') || 'vi';
        this.switch(saved);
    },
    
    switch(lang) {
        this.current = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        
        const langText = document.getElementById('langText');
        if (langText) {
            langText.textContent = lang.toUpperCase();
        }
        
        this.updateUI();
    },
    
    toggle() {
        this.switch(this.current === 'vi' ? 'en' : 'vi');
    },
    
    translate(key) {
        const { translations } = window;
        if (!translations) return key;
        return translations[this.current][key] || key;
    },
    
    updateUI() {
        const { translations } = window;
        if (!translations) return;
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[this.current][key]) {
                if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
                    el.placeholder = translations[this.current][key];
                } else {
                    el.textContent = translations[this.current][key];
                }
            }
        });
        
        // Re-render dynamic fields if needed
        if (typeof updateFields === 'function') {
            updateFields();
        }
    },
};

export { ThemeManager, LanguageManager };
