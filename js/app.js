// Main application logic
import { translations } from './translations.js';
import { ThemeManager, LanguageManager } from './utils.js';
import { QRGenerator } from './qr-generator.js';
import { ActivityLogger, createErrorReportButton } from './logger.js';
import { logoGallery, svgToDataUrl } from './logo-gallery.js';

// Make translations available globally
window.translations = translations;

// Data types configuration (controls which types are shown in UI)
const dataTypes = {
    url: { icon: 'fas fa-link text-indigo-600', iconFallback: '🔗', label: 'URL', enabled: true },
    text: { icon: 'fas fa-font text-gray-700', iconFallback: '📝', label: 'Text', enabled: true },
    email: { icon: 'fas fa-envelope text-red-500', iconFallback: '📧', label: 'Email', enabled: true },
    phone: { icon: 'fas fa-phone text-green-600', iconFallback: '📞', label: 'Phone', enabled: true },
    sms: { icon: 'fas fa-sms text-blue-500', iconFallback: '💬', label: 'SMS', enabled: true },
    wifi: { icon: 'fas fa-wifi text-cyan-600', iconFallback: '📶', label: 'WiFi', enabled: true },
    whatsapp: { icon: 'fab fa-whatsapp text-green-500', iconFallback: '💚', label: 'WhatsApp', enabled: true },
    youtube: { icon: 'fab fa-youtube text-red-600', iconFallback: '▶️', label: 'YouTube', enabled: true },
    instagram: { icon: 'fab fa-instagram text-pink-600', iconFallback: '📷', label: 'Instagram', enabled: true },
    linkedin: { icon: 'fab fa-linkedin text-blue-700', iconFallback: '💼', label: 'LinkedIn', enabled: true },
    facebook: { icon: 'fab fa-facebook text-blue-600', iconFallback: '👥', label: 'Facebook', enabled: true },
    x: { icon: 'fab fa-x-twitter text-gray-800', iconFallback: '✖️', label: 'X (Twitter)', enabled: true },
    discord: { icon: 'fab fa-discord text-indigo-600', iconFallback: '🎮', label: 'Discord', enabled: true },
    telegram: { icon: 'fab fa-telegram text-blue-500', iconFallback: '✈️', label: 'Telegram', enabled: true },
    tiktok: { icon: 'fab fa-tiktok text-gray-800', iconFallback: '🎵', label: 'TikTok', enabled: true },
    spotify: { icon: 'fab fa-spotify text-green-600', iconFallback: '🎧', label: 'Spotify', enabled: true },
    // Disabled types (set enabled: false to hide)
    snapchat: { icon: 'fab fa-snapchat text-yellow-400', iconFallback: '👻', label: 'Snapchat', enabled: false },
    file: { icon: 'fas fa-file text-purple-600', iconFallback: '📄', label: 'File', enabled: false },
    address: { icon: 'fas fa-map-marker-alt text-red-600', iconFallback: '📍', label: 'Address', enabled: false },
};

// Validation & Pre-processing functions
const validators = {
    url: (value) => {
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.\w+)+)([\w.,@?^=%&:/~+#-]*)?$/;
        if (!urlPattern.test(value)) {
            return { valid: false, messageKey: 'error_url_invalid' };
        }
        // Auto-add https:// if missing
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
            return { valid: true, processed: 'https://' + value };
        }
        return { valid: true, processed: value };
    },
    
    email: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            return { valid: false, messageKey: 'error_email_invalid' };
        }
        return { valid: true, processed: value.toLowerCase() };
    },
    
    phone: (value) => {
        const phonePattern = /^[\d\s+()-]+$/;
        if (!phonePattern.test(value)) {
            return { valid: false, messageKey: 'error_phone_invalid' };
        }
        // Remove spaces for consistency
        return { valid: true, processed: value.replace(/\s/g, '') };
    },
    
    tiktok: (value) => {
        // Extract username from TikTok URL or profile link
        const patterns = [
            /tiktok\.com\/@([a-zA-Z0-9_.]+)/,  // @username
            /^@?([a-zA-Z0-9_.]+)$/,             // Direct username
        ];
        
        for (const pattern of patterns) {
            const match = value.match(pattern);
            if (match) {
                const username = match[1].replace(/^@/, '');
                return { valid: true, processed: `https://www.tiktok.com/@${username}` };
            }
        }
        
        return { valid: false, messageKey: 'error_tiktok_invalid' };
    },
    
    instagram: (value) => {
        const patterns = [
            /instagram\.com\/([a-zA-Z0-9_.]+)/,
            /^@?([a-zA-Z0-9_.]+)$/,
        ];
        
        for (const pattern of patterns) {
            const match = value.match(pattern);
            if (match) {
                const username = match[1].replace(/^@/, '');
                return { valid: true, processed: `https://www.instagram.com/${username}` };
            }
        }
        
        return { valid: false, messageKey: 'error_instagram_invalid' };
    },
    
    youtube: (value) => {
        // Extract channel/video ID from YouTube URL
        if (value.includes('youtube.com') || value.includes('youtu.be')) {
            return { valid: true, processed: value };
        }
        // Assume it's a channel name
        return { valid: true, processed: `https://www.youtube.com/@${value}` };
    },
    
    whatsapp: (value) => {
        const cleaned = value.replace(/[\s()-]/g, '');
        const phonePattern = /^\+?\d{10,15}$/;
        if (!phonePattern.test(cleaned)) {
            return { valid: false, messageKey: 'error_whatsapp_invalid' };
        }
        return { valid: true, processed: cleaned };
    },
    
    telegram: (value) => {
        const patterns = [
            /t\.me\/([a-zA-Z0-9_]+)/,
            /^@?([a-zA-Z0-9_]+)$/,
        ];
        
        for (const pattern of patterns) {
            const match = value.match(pattern);
            if (match) {
                const username = match[1].replace(/^@/, '');
                return { valid: true, processed: `https://t.me/${username}` };
            }
        }
        
        return { valid: false, messageKey: 'error_telegram_invalid' };
    },
    
    spotify: (value) => {
        if (value.includes('spotify.com')) {
            return { valid: true, processed: value };
        }
        return { valid: false, messageKey: 'error_spotify_invalid' };
    },
};

// Data fields configuration
const fields = {
    url: [
        {
            name: 'url',
            labelKey: 'field_url',
            type: 'url',
            placeholderKey: 'placeholder_url',
            hasCampaign: true,
        },
    ],
    text: [
        {
            name: 'text',
            labelKey: 'field_text',
            type: 'text',
            placeholderKey: 'placeholder_text',
        },
    ],
    email: [
        {
            name: 'email',
            labelKey: 'field_email',
            type: 'email',
            placeholderKey: 'placeholder_email',
        },
    ],
    phone: [
        {
            name: 'phone',
            labelKey: 'field_phone',
            type: 'tel',
            placeholderKey: 'placeholder_phone',
        },
    ],
    sms: [
        {
            name: 'phone',
            labelKey: 'field_phone',
            type: 'tel',
            placeholderKey: 'placeholder_phone',
        },
        {
            name: 'message',
            labelKey: 'field_message',
            type: 'text',
            placeholderKey: 'placeholder_message',
        },
    ],
    wifi: [
        {
            name: 'ssid',
            labelKey: 'field_ssid',
            type: 'text',
            placeholderKey: 'placeholder_ssid',
        },
        {
            name: 'password',
            labelKey: 'field_password',
            type: 'text',
            placeholderKey: 'placeholder_password',
        },
        {
            name: 'security',
            labelKey: 'field_security',
            type: 'select',
            options: ['WPA', 'WEP', 'nopass'],
        },
    ],
    whatsapp: [
        {
            name: 'phone',
            labelKey: 'field_phone',
            type: 'tel',
            placeholderKey: 'placeholder_phone',
        },
        {
            name: 'message',
            labelKey: 'field_message',
            type: 'text',
            placeholderKey: 'placeholder_message',
        },
    ],
    youtube: [
        {
            name: 'url',
            labelKey: 'field_url',
            type: 'url',
            placeholderKey: 'placeholder_url',
            hasCampaign: true,
        },
    ],
    instagram: [
        {
            name: 'username',
            labelKey: 'field_username',
            type: 'text',
            placeholderKey: 'placeholder_username',
        },
    ],
    linkedin: [
        {
            name: 'url',
            labelKey: 'field_url',
            type: 'url',
            placeholderKey: 'placeholder_url',
            hasCampaign: true,
        },
    ],
    facebook: [
        {
            name: 'url',
            labelKey: 'field_url',
            type: 'url',
            placeholderKey: 'placeholder_url',
            hasCampaign: true,
        },
    ],
    // snapchat: [
    //     {
    //         name: 'username',
    //         labelKey: 'field_username',
    //         type: 'text',
    //         placeholderKey: 'placeholder_username',
    //     },
    // ],
    telegram: [
        {
            name: 'username',
            labelKey: 'field_username',
            type: 'text',
            placeholderKey: 'placeholder_username',
        },
    ],
    tiktok: [
        {
            name: 'username',
            labelKey: 'field_username',
            type: 'text',
            placeholderKey: 'placeholder_username',
        },
    ],
    discord: [
        {
            name: 'invite',
            labelKey: 'field_invite',
            type: 'text',
            placeholderKey: 'placeholder_invite',
        },
    ],
    spotify: [
        {
            name: 'url',
            labelKey: 'field_url',
            type: 'url',
            placeholderKey: 'placeholder_url',
            hasCampaign: true,
        },
    ],
    x: [
        {
            name: 'username',
            labelKey: 'field_username',
            type: 'text',
            placeholderKey: 'placeholder_username',
        },
    ],
    // file: [
    //     {
    //         name: 'file',
    //         labelKey: 'field_file',
    //         type: 'file',
    //     },
    // ],
    // address: [
    //     {
    //         name: 'address',
    //         labelKey: 'field_address',
    //         type: 'text',
    //         placeholderKey: 'placeholder_address',
    //     },
    // ],
};

let selectedDataType = 'url';

// Auto-generate QR with debounce
let generateTimeout;
const autoGenerateQR = () => {
    clearTimeout(generateTimeout);
    generateTimeout = setTimeout(() => {
        window.generateQR();
    }, 500); // Debounce 500ms
};

// Initialize app
function init() {
    // Initialize logger first
    ActivityLogger.init();
    ActivityLogger.log('App initialized');
    
    ThemeManager.init();
    LanguageManager.init();
    
    // Render data types from config
    renderDataTypes();
    renderLogoGallery();
    
    setupEventListeners();
    updateFields();
    syncCustomizePanels();
    
    // Create error report button
    createErrorReportButton();
    
    ActivityLogger.log('UI rendered', { dataTypesCount: Object.keys(dataTypes).length });
}

// Expose functions to global scope for onclick handlers
window.toggleDarkMode = () => {
    ActivityLogger.log('Theme toggled');
    ThemeManager.toggle();
};
window.toggleLanguage = () => {
    ActivityLogger.log('Language toggled', { to: LanguageManager.current === 'vi' ? 'en' : 'vi' });
    LanguageManager.toggle();
    refreshGalleryLabels();
};

// Test function for debugging
window.testQR = async () => {
    console.log('=== TESTING QR with simple URL ===');
    await QRGenerator.generate('https://google.com');
};

// Render data type cards from config
function renderDataTypes() {
    const container = document.getElementById('dataTypeGrid');
    if (!container) return;
    
    // Clear existing cards
    container.innerHTML = '';
    
    // Render only enabled types
    let isFirst = true;
    Object.entries(dataTypes).forEach(([type, config]) => {
        if (!config.enabled) return;
        
        const card = document.createElement('div');
        card.className = 'data-card card-bg p-4 rounded-xl border-2 border-gray-200 text-center';
        card.dataset.type = type;
        
        // First enabled card is active by default
        if (isFirst) {
            card.classList.add('active-card');
            selectedDataType = type;
            isFirst = false;
        }
        
        card.innerHTML = `
            <div class="text-4xl mb-2">
                <i class="${config.icon}"></i>
                <span class="icon-fallback">${config.iconFallback}</span>
            </div>
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">${config.label}</div>
        `;
        
        container.appendChild(card);
    });
}

function renderLogoGallery() {
    const container = document.getElementById('logoGallery');
    if (!container) return;
    container.innerHTML = '';

    logoGallery.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'logo-gallery-btn';
        button.dataset.galleryId = item.id;
        button.dataset.labelKey = item.labelKey;
        button.innerHTML = `<img src="${svgToDataUrl(item.svg)}" alt="">`;
        button.addEventListener('click', async () => {
            const logoRadio = document.querySelector('input[name="centerOption"][value="logo"]');
            if (logoRadio && !logoRadio.checked) {
                logoRadio.checked = true;
                logoRadio.dispatchEvent(new Event('change'));
            }
            await applyLogoSource({
                url: svgToDataUrl(item.svg),
                name: item.id,
                source: 'gallery',
                galleryId: item.id,
            });
            const fileInput = document.getElementById('logoFile');
            if (fileInput) fileInput.value = '';
            setGallerySelection(item.id);
        });
        container.appendChild(button);
    });
    refreshGalleryLabels();
}

function refreshGalleryLabels() {
    document.querySelectorAll('.logo-gallery-btn').forEach((btn) => {
        const label = LanguageManager.translate(btn.dataset.labelKey);
        btn.setAttribute('aria-label', label);
        btn.title = label;
    });
}

function setGallerySelection(id) {
    document.querySelectorAll('.logo-gallery-btn').forEach((btn) => {
        btn.classList.toggle('is-selected', btn.dataset.galleryId === id);
    });
}

function updateLogoSizeLabel() {
    const slider = document.getElementById('logoSize');
    const label = document.getElementById('logoSizeValue');
    if (slider && label) {
        label.textContent = `${slider.value}%`;
    }
}

function setLogoControlsEnabled(enabled) {
    const logoFile = document.getElementById('logoFile');
    const logoSize = document.getElementById('logoSize');
    const logoRemoveBg = document.getElementById('logoRemoveBg');
    if (logoFile) logoFile.disabled = !enabled;
    if (logoSize) logoSize.disabled = !enabled;
    if (logoRemoveBg) logoRemoveBg.disabled = !enabled;
}

function syncCustomizePanels() {
    const gradientOn = document.querySelector('input[name="colorMode"]:checked')?.value === 'gradient';
    const gradientType = document.querySelector('input[name="gradientType"]:checked')?.value || 'linear';
    const customEyes = !!document.getElementById('customEyeColor')?.checked;
    document.getElementById('gradientControls')?.classList.toggle('hidden', !gradientOn);
    document.getElementById('gradientAngleWrap')?.classList.toggle('hidden', !gradientOn || gradientType !== 'linear');
    document.getElementById('eyeColorControls')?.classList.toggle('hidden', !customEyes);

    document.querySelectorAll('input[name="colorMode"]').forEach((input) => {
        input.closest('.mode-chip')?.classList.toggle('is-active', input.checked);
    });
    document.querySelectorAll('input[name="gradientType"]').forEach((input) => {
        input.closest('.mode-chip')?.classList.toggle('is-active', input.checked);
    });

    const logoOn = document.querySelector('input[name="centerOption"]:checked')?.value === 'logo';
    setLogoControlsEnabled(!!logoOn);
    updateLogoSizeLabel();
}

async function applyLogoSource(source) {
    const preview = document.getElementById('logoPreview');
    if (preview) {
        preview.classList.remove('hidden');
        preview.innerHTML = `<p class="text-sm text-gray-500">${LanguageManager.translate('logo_processing')}</p>`;
    }

    try {
        QRGenerator.currentLogo = await QRGenerator.prepareLogo(source);
        refreshLogoPreview();
        ActivityLogger.log('Logo ready', {
            name: QRGenerator.currentLogo.name,
            width: QRGenerator.currentLogo.width,
            height: QRGenerator.currentLogo.height,
            source: QRGenerator.currentLogo.source,
        });
        autoGenerateQR();
    } catch (error) {
        console.error('Failed to process logo:', error);
        ActivityLogger.log('Logo processing error', { error: error.message });
        QRGenerator.currentLogo = null;
        if (preview) {
            preview.classList.remove('hidden');
            preview.innerHTML = `<p class="text-sm text-red-500">${LanguageManager.translate('logo_error')}</p>`;
        }
    }
}

function refreshLogoPreview() {
    const preview = document.getElementById('logoPreview');
    const logo = QRGenerator.currentLogo;
    if (!preview || !logo) return;

    const img = document.createElement('img');
    img.src = document.getElementById('logoRemoveBg')?.checked ? logo.processedUrl : logo.url;
    img.alt = logo.name;
    img.className = 'logo-preview-img rounded-lg border-2 border-gray-300';

    preview.classList.remove('hidden');
    preview.innerHTML = `<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">${LanguageManager.translate('logo_ready')} ${logo.width}×${logo.height}</p>`;
    preview.appendChild(img);
}

// Tab switching function
window.switchTab = (tabName) => {
    ActivityLogger.log('Tab switched', { tab: tabName });
    
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`tab-${tabName}`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }
    
    // Add active to selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
};

// Setup all event listeners
function setupEventListeners() {
    // QR Generation
    window.generateQR = async () => {
        const data = await getData();
        if (!data) {
            return; // Silently fail if no data
        }
        
        const centerOption = document.querySelector('input[name="centerOption"]:checked')?.value;
        const hasLogo = centerOption === 'logo' && !!QRGenerator.currentLogo;
        const hasText = centerOption === 'text' && document.getElementById('centerText')?.value;
        const colorDark = QRGenerator.parseColor(document.getElementById('qrColorDark')?.value) || '#000000';
        const colorLight = QRGenerator.parseColor(document.getElementById('qrColorLight')?.value) || '#ffffff';
        const colorGradient = QRGenerator.parseColor(document.getElementById('qrColorGradient')?.value) || '#4f46e5';
        const gradientEnabled = document.querySelector('input[name="colorMode"]:checked')?.value === 'gradient';
        const gradientType = document.querySelector('input[name="gradientType"]:checked')?.value || 'linear';
        const gradientAngle = parseInt(document.getElementById('gradientAngle')?.value || '0', 10);
        const customEyes = !!document.getElementById('customEyeColor')?.checked;
        const eyeFrame = QRGenerator.parseColor(document.getElementById('eyeFrameColor')?.value) || colorDark;
        const eyeBall = QRGenerator.parseColor(document.getElementById('eyeBallColor')?.value) || colorDark;
        const logoSizeRatio = parseInt(document.getElementById('logoSize')?.value || '20', 10) / 100;
        const logoRemoveBg = !!document.getElementById('logoRemoveBg')?.checked;
        const size = parseInt(document.getElementById('qrSize')?.value || 300);
        
        ActivityLogger.log('QR generation started', {
            dataType: selectedDataType,
            dataLength: data.length,
            centerOption,
            hasLogo,
            hasText,
            colorDark,
            colorLight,
            gradientEnabled,
            customEyes,
            size,
        });
        
        try {
            await QRGenerator.generate(data, {
                colorDark,
                colorLight,
                colorGradient,
                gradientEnabled,
                gradientType,
                gradientAngle,
                customEyes,
                eyeFrame,
                eyeBall,
                hasLogo,
                hasText,
                logoSizeRatio,
                logoRemoveBg,
                size,
                correctLevel: (hasLogo || hasText) ? 'H' : 'M',
            });
            
            ActivityLogger.log('QR generation successful');
        } catch (error) {
            ActivityLogger.log('QR generation error', { error: error.message });
            console.error('QR Generation Error:', error);
        }
    };
    
    // Download
    window.downloadQR = (format) => {
        ActivityLogger.log('Download QR', { format });
        QRGenerator.download(format);
    };
    
    // Data type selection
    document.querySelectorAll('.data-card').forEach(card => {
        card.addEventListener('click', () => {
            // Remove active from all cards
            document.querySelectorAll('.data-card').forEach(c => c.classList.remove('active-card'));
            
            // Add active to clicked card
            card.classList.add('active-card');
            
            // Update selected type and show inputs
            selectedDataType = card.dataset.type;
            ActivityLogger.log('Data type selected', { type: selectedDataType });
            updateFields();
        });
    });
    
    // Center option radios
    document.querySelectorAll('input[name="centerOption"]').forEach(radio => {
        radio.addEventListener('change', function() {
            ActivityLogger.log('Center option changed', { option: this.value });
            
            const centerText = document.getElementById('centerText');
            const centerTextColor = document.getElementById('centerTextColor');
            const textDisabled = this.value !== 'text';
            
            if (centerText) centerText.disabled = textDisabled;
            setColorFieldDisabled(centerTextColor, textDisabled);
            setLogoControlsEnabled(this.value === 'logo');
            
            // Auto-generate when option changes
            autoGenerateQR();
        });
    });
    
    // Logo file upload with preview
    const logoFileInput = document.getElementById('logoFile');
    if (logoFileInput) {
        logoFileInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            await applyLogoSource({
                url: await QRGenerator.fileToDataUrl(file),
                name: file.name,
                source: 'file',
            });
            setGallerySelection(null);
        });
    }

    const logoSize = document.getElementById('logoSize');
    if (logoSize) {
        logoSize.addEventListener('input', () => {
            updateLogoSizeLabel();
            autoGenerateQR();
        });
    }

    const logoRemoveBg = document.getElementById('logoRemoveBg');
    if (logoRemoveBg) {
        logoRemoveBg.addEventListener('change', () => {
            refreshLogoPreview();
            autoGenerateQR();
        });
    }

    document.querySelectorAll('input[name="colorMode"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            syncCustomizePanels();
            autoGenerateQR();
        });
    });
    document.querySelectorAll('input[name="gradientType"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            syncCustomizePanels();
            autoGenerateQR();
        });
    });
    const gradientAngle = document.getElementById('gradientAngle');
    if (gradientAngle) gradientAngle.addEventListener('change', autoGenerateQR);

    const customEyeColor = document.getElementById('customEyeColor');
    if (customEyeColor) {
        customEyeColor.addEventListener('change', () => {
            syncCustomizePanels();
            autoGenerateQR();
        });
    }
    
    // Campaign tracking
    const enableCampaign = document.getElementById('enableCampaign');
    if (enableCampaign) {
        enableCampaign.addEventListener('change', function() {
            ActivityLogger.log('Campaign tracking toggled', { enabled: this.checked });
            document.getElementById('campaignFields')?.classList.toggle('hidden', !this.checked);
            autoGenerateQR();
        });
    }
    
    bindColorInputs();
    
    // QR Size input - validate and auto-generate on blur
    const qrSize = document.getElementById('qrSize');
    if (qrSize) {
        qrSize.addEventListener('blur', function() {
            let size = parseInt(this.value);
            // Validate size range
            if (isNaN(size) || size < 100) {
                size = 100;
                this.value = 100;
            } else if (size > 1000) {
                size = 1000;
                this.value = 1000;
            }
            ActivityLogger.log('QR size changed', { size });
            autoGenerateQR();
        });
        // Also trigger on Enter key
        qrSize.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });
    }
    
    // Center text - auto-generate on change
    const centerText = document.getElementById('centerText');
    if (centerText) centerText.addEventListener('input', autoGenerateQR);
    
    // UTM fields - auto-generate on change
    const utmSource = document.getElementById('utmSource');
    const utmMedium = document.getElementById('utmMedium');
    const utmCampaign = document.getElementById('utmCampaign');
    if (utmSource) utmSource.addEventListener('input', autoGenerateQR);
    if (utmMedium) utmMedium.addEventListener('input', autoGenerateQR);
    if (utmCampaign) utmCampaign.addEventListener('input', autoGenerateQR);
}

function setColorFieldDisabled(picker, disabled) {
    if (!picker) return;
    picker.disabled = disabled;
    const hex = document.getElementById(picker.dataset.hexInput);
    if (hex) hex.disabled = disabled;
}

function bindColorInputs() {
    document.querySelectorAll('input[type="color"][data-hex-input]').forEach((picker) => {
        const hex = document.getElementById(picker.dataset.hexInput);
        if (!hex) return;
        const errorEl = document.getElementById(`${picker.id}Error`);

        const showError = (show) => {
            hex.classList.toggle('is-invalid', show);
            if (errorEl) errorEl.classList.toggle('hidden', !show);
        };

        picker.addEventListener('input', () => {
            hex.value = picker.value;
            showError(false);
            autoGenerateQR();
        });

        hex.addEventListener('input', () => {
            const parsed = QRGenerator.parseColor(hex.value);
            if (parsed) {
                showError(false);
                picker.value = parsed;
                autoGenerateQR();
                return;
            }
            const incomplete = QRGenerator.isIncompleteColor(hex.value);
            showError(!incomplete && hex.value.trim().length > 0);
        });

        hex.addEventListener('blur', () => {
            const parsed = QRGenerator.parseColor(hex.value);
            if (parsed) {
                hex.value = parsed;
                showError(false);
                return;
            }
            if (hex.value.trim()) {
                showError(true);
            } else {
                hex.value = picker.value;
                showError(false);
            }
        });

        hex.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                hex.blur();
            }
        });
    });
}


// Update input fields based on selected data type
function updateFields() {
    const container = document.getElementById('inputFields');
    if (!container) return;
    
    container.innerHTML = '';
    
    const typeFields = fields[selectedDataType] || fields.url;
    
    typeFields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';
        
        const label = document.createElement('label');
        label.className = 'block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2';
        label.textContent = LanguageManager.translate(field.labelKey);
        
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = LanguageManager.translate(opt);
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.placeholder = LanguageManager.translate(field.placeholderKey);
        }
        
        input.name = field.name;
        input.className = 'w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all input-bg';
        
        // Auto-generate on input change
        // Use blur event for validation to avoid auto-validate while typing
        input.addEventListener('blur', autoGenerateQR);
        input.addEventListener('change', autoGenerateQR);
        
        div.appendChild(label);
        div.appendChild(input);
        
        // Add error message container
        const errorMsg = document.createElement('p');
        errorMsg.className = 'text-xs text-red-500 mt-1 hidden';
        errorMsg.id = `error-${field.name}`;
        div.appendChild(errorMsg);
        
        container.appendChild(div);
    });
    
    // Show/hide campaign section
    const hasCampaign = typeFields.some(field => field.hasCampaign);
    const campaignSection = document.getElementById('campaignSection');
    if (campaignSection) {
        campaignSection.classList.toggle('hidden', !hasCampaign);
    }
}

// Get data from inputs with validation
async function getData() {
    const type = selectedDataType;
    const inputs = document.querySelectorAll('#inputFields input, #inputFields select');
    const data = {};
    
    // Collect input values
    inputs.forEach(input => {
        if (input.type === 'file') {
            data[input.name] = input.files[0];
        } else {
            data[input.name] = input.value.trim();
        }
    });
    
    // Validate primary input based on type
    const validator = validators[type];
    if (validator && data.url) {
        const result = validator(data.url);
        if (!result.valid) {
            const errorMsg = result.messageKey ? LanguageManager.translate(result.messageKey) : 'Invalid input';
            alert(errorMsg);
            return null;
        }
        // Use processed value
        data.url = result.processed;
    }
    
    // Validate username fields for social media
    if (validator && data.username) {
        const result = validator(data.username);
        if (!result.valid) {
            const errorMsg = result.messageKey ? LanguageManager.translate(result.messageKey) : 'Invalid input';
            alert(errorMsg);
            return null;
        }
        data.username = result.processed;
    }
    
    // Validate phone fields
    if (validators[type] && data.phone) {
        const result = validators[type](data.phone);
        if (!result.valid) {
            const errorMsg = result.messageKey ? LanguageManager.translate(result.messageKey) : 'Invalid input';
            alert(errorMsg);
            return null;
        }
        data.phone = result.processed;
    }
    
    // Validate email
    if (type === 'email' && data.email) {
        const result = validators.email(data.email);
        if (!result.valid) {
            const errorMsg = result.messageKey ? LanguageManager.translate(result.messageKey) : 'Invalid input';
            alert(errorMsg);
            return null;
        }
        data.email = result.processed;
    }

    let qrData = '';

    switch(type) {
    case 'url':
    case 'youtube':
    case 'linkedin':
    case 'facebook':
    case 'spotify':
        qrData = data.url;
        break;
    case 'text':
        qrData = data.text;
        break;
    case 'email':
        qrData = `mailto:${data.email}`;
        break;
    case 'phone':
        qrData = `tel:${data.phone}`;
        break;
    case 'sms':
        qrData = `sms:${data.phone}?body=${encodeURIComponent(data.message)}`;
        break;
    case 'wifi':
        qrData = `WIFI:T:${data.security};S:${data.ssid};P:${data.password};;`;
        break;
    case 'whatsapp':
        qrData = `https://wa.me/${data.phone.replace(/[^0-9]/g, '')}${data.message ? '?text=' + encodeURIComponent(data.message) : ''}`;
        break;
    case 'instagram':
    case 'tiktok':
    case 'telegram':
        // Use processed username (already contains full URL from validator)
        qrData = data.username;
        break;
    case 'snapchat':
        qrData = `https://www.snapchat.com/add/${data.username}`;
        break;
    case 'discord':
        qrData = `https://discord.gg/${data.invite}`;
        break;
    case 'x':
        qrData = `https://x.com/${data.username}`;
        break;
    case 'file':
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(data.file);
        });
    case 'address':
        qrData = data.address;
        break;
    }

    // Add campaign tracking if enabled
    const typeFields = fields[type] || [];
    const hasCampaign = typeFields.some(field => field.hasCampaign);
    const enableCampaign = document.getElementById('enableCampaign');
    
    if (hasCampaign && enableCampaign?.checked) {
        const utm = [];
        const source = document.getElementById('utmSource')?.value;
        const medium = document.getElementById('utmMedium')?.value;
        const campaign = document.getElementById('utmCampaign')?.value;
        
        if (source) utm.push(`utm_source=${encodeURIComponent(source)}`);
        if (medium) utm.push(`utm_medium=${encodeURIComponent(medium)}`);
        if (campaign) utm.push(`utm_campaign=${encodeURIComponent(campaign)}`);
        
        if (utm.length > 0) {
            qrData += (qrData.includes('?') ? '&' : '?') + utm.join('&');
        }
    }

    return qrData;
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
