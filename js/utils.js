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

// Step wizard controller
const WizardController = {
    currentStep: 1,
    totalSteps: 3,
    
    init() {
        this.showStep(1);
        this.updateButtons();
    },
    
    showStep(step) {
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepEl = document.getElementById(`step${i}`);
            const tabEl = document.getElementById(`tab${i}`);
            
            if (stepEl) {
                stepEl.classList.toggle('hidden', i !== step);
            }
            if (tabEl) {
                tabEl.classList.toggle('active', i === step);
            }
        }
        
        this.currentStep = step;
        this.updateButtons();
    },
    
    next() {
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        }
    },
    
    prev() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    },
    
    updateButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const generateBtn = document.getElementById('generateBtn');
        
        if (prevBtn) {
            prevBtn.classList.toggle('hidden', this.currentStep === 1);
        }
        
        if (nextBtn) {
            nextBtn.classList.toggle('hidden', this.currentStep === this.totalSteps);
        }
        
        if (generateBtn) {
            generateBtn.classList.toggle('hidden', this.currentStep !== 3);
        }
    },
};

export { ThemeManager, LanguageManager, WizardController };
