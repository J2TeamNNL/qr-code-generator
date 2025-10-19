// Main application logic
import { translations } from './translations.js';
import { ThemeManager, LanguageManager } from './utils.js';
import { QRGenerator } from './qr-generator.js';
import { ActivityLogger, createErrorReportButton } from './logger.js';

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
    
    setupEventListeners();
    updateFields();
    
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
};

// Test function for debugging
window.testQR = async () => {
    console.log('=== TESTING QR with simple URL ===');
    await QRGenerator.generate('https://google.com');
};

// Render data type cards from config
function renderDataTypes() {
    const container = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
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

// Setup all event listeners
function setupEventListeners() {
    // QR Generation
    window.generateQR = async () => {
        const data = await getData();
        if (!data) {
            return; // Silently fail if no data
        }
        
        const centerOption = document.querySelector('input[name="centerOption"]:checked')?.value;
        const hasLogo = centerOption === 'logo' && document.getElementById('logoFile')?.files[0];
        const hasText = centerOption === 'text' && document.getElementById('centerText')?.value;
        const colorDark = document.getElementById('qrColorDark')?.value || '#000000';
        const colorLight = document.getElementById('qrColorLight')?.value || '#ffffff';
        
        ActivityLogger.log('QR generation started', {
            dataType: selectedDataType,
            dataLength: data.length,
            centerOption,
            hasLogo,
            hasText,
            colorDark,
            colorLight,
        });
        
        try {
            await QRGenerator.generate(data, {
                colorDark,
                colorLight,
                hasLogo,
                hasText,
                correctLevel: (hasLogo || hasText) ? QRCode.CorrectLevel.H : QRCode.CorrectLevel.M,
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
            
            const logoFile = document.getElementById('logoFile');
            const centerText = document.getElementById('centerText');
            const centerTextColor = document.getElementById('centerTextColor');
            
            if (logoFile) logoFile.disabled = this.value !== 'logo';
            if (centerText) centerText.disabled = this.value !== 'text';
            if (centerTextColor) centerTextColor.disabled = this.value !== 'text';
            
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
            
            // Show processing message
            const preview = document.getElementById('logoPreview');
            if (preview) {
                preview.classList.remove('hidden');
                preview.innerHTML = '<p class="text-sm text-gray-500">⏳ Đang xử lý ảnh...</p>';
            }
            
            try {
                // Crop and resize
                const croppedBlob = await QRGenerator.cropAndResizeImage(file, 200);
                
                // Show preview
                const img = document.createElement('img');
                img.src = URL.createObjectURL(croppedBlob);
                img.className = 'w-20 h-20 rounded-lg border-2 border-gray-300 object-cover';
                
                if (preview) {
                    preview.classList.remove('hidden');
                    preview.innerHTML = '<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">✓ Ảnh đã được crop vuông:</p>';
                    preview.appendChild(img);
                }
                
                ActivityLogger.log('Logo uploaded and cropped', { fileName: file.name, fileSize: file.size });
                console.log('✓ Logo cropped and ready');
                
                // Auto-generate after logo upload
                autoGenerateQR();
            } catch (error) {
                console.error('Failed to process logo:', error);
                ActivityLogger.log('Logo processing error', { error: error.message });
                if (preview) {
                    preview.classList.remove('hidden');
                    preview.innerHTML = '<p class="text-sm text-red-500">❌ Lỗi xử lý ảnh</p>';
                }
            }
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
    
    // Color pickers - auto-generate on change
    const colorDark = document.getElementById('qrColorDark');
    const colorLight = document.getElementById('qrColorLight');
    if (colorDark) colorDark.addEventListener('input', autoGenerateQR);
    if (colorLight) colorLight.addEventListener('input', autoGenerateQR);
    
    // Center text - auto-generate on change
    const centerText = document.getElementById('centerText');
    const centerTextColor = document.getElementById('centerTextColor');
    if (centerText) centerText.addEventListener('input', autoGenerateQR);
    if (centerTextColor) centerTextColor.addEventListener('input', autoGenerateQR);
    
    // UTM fields - auto-generate on change
    const utmSource = document.getElementById('utmSource');
    const utmMedium = document.getElementById('utmMedium');
    const utmCampaign = document.getElementById('utmCampaign');
    if (utmSource) utmSource.addEventListener('input', autoGenerateQR);
    if (utmMedium) utmMedium.addEventListener('input', autoGenerateQR);
    if (utmCampaign) utmCampaign.addEventListener('input', autoGenerateQR);
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
        input.addEventListener('input', autoGenerateQR);
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
