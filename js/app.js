// Main application logic
import { translations } from './translations.js';
import { ThemeManager, LanguageManager, WizardController } from './utils.js';
import { QRGenerator } from './qr-generator.js';

// Make translations available globally
window.translations = translations;

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
    snapchat: [
        {
            name: 'username',
            labelKey: 'field_username',
            type: 'text',
            placeholderKey: 'placeholder_username',
        },
    ],
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
    file: [
        {
            name: 'file',
            labelKey: 'field_file',
            type: 'file',
        },
    ],
    address: [
        {
            name: 'address',
            labelKey: 'field_address',
            type: 'text',
            placeholderKey: 'placeholder_address',
        },
    ],
};

let selectedDataType = 'url';

// Initialize app
function init() {
    ThemeManager.init();
    LanguageManager.init();
    WizardController.init();
    
    setupEventListeners();
    updateFields();
}

// Expose functions to global scope for onclick handlers
window.toggleDarkMode = () => ThemeManager.toggle();
window.toggleLanguage = () => LanguageManager.toggle();
window.nextStep = () => WizardController.next();
window.prevStep = () => WizardController.prev();
window.goToStep = (step) => WizardController.showStep(step);

// Test function for debugging
window.testQR = async () => {
    console.log('=== TESTING QR with simple URL ===');
    await QRGenerator.generate('https://google.com');
};

// Setup all event listeners
function setupEventListeners() {
    // QR Generation
    window.generateQR = async () => {
        const data = await getData();
        if (!data) return;
        
        const centerOption = document.querySelector('input[name="centerOption"]:checked')?.value;
        const hasLogo = centerOption === 'logo' && document.getElementById('logoFile')?.files[0];
        const hasText = centerOption === 'text' && document.getElementById('centerText')?.value;
        
        await QRGenerator.generate(data, {
            colorDark: document.getElementById('qrColorDark')?.value || '#000000',
            colorLight: document.getElementById('qrColorLight')?.value || '#ffffff',
            hasLogo,
            hasText,
            correctLevel: (hasLogo || hasText) ? QRCode.CorrectLevel.H : QRCode.CorrectLevel.M,
        });
        
        // Stay at step 3 and show export buttons
    };
    
    // Download
    window.downloadQR = (format) => QRGenerator.download(format);
    
    // Data type selection
    document.querySelectorAll('.data-card').forEach(card => {
        card.addEventListener('click', () => {
            // Remove active from all cards
            document.querySelectorAll('.data-card').forEach(c => c.classList.remove('active-card'));
            
            // Add active to clicked card
            card.classList.add('active-card');
            
            // Update selected type and show inputs
            selectedDataType = card.dataset.type;
            updateFields();
            
            // DON'T auto-next - let user fill inputs first
            // User will click Next button manually
        });
    });
    
    // Center option radios
    document.querySelectorAll('input[name="centerOption"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const logoFile = document.getElementById('logoFile');
            const centerText = document.getElementById('centerText');
            const centerTextColor = document.getElementById('centerTextColor');
            
            if (logoFile) logoFile.disabled = this.value !== 'logo';
            if (centerText) centerText.disabled = this.value !== 'text';
            if (centerTextColor) centerTextColor.disabled = this.value !== 'text';
        });
    });
    
    // Campaign tracking
    const enableCampaign = document.getElementById('enableCampaign');
    if (enableCampaign) {
        enableCampaign.addEventListener('change', function() {
            document.getElementById('campaignFields')?.classList.toggle('hidden', !this.checked);
        });
    }
}

// Validate step 1 inputs
function validateStep1() {
    const inputs = document.querySelectorAll('#inputFields input:not([type="file"]), #inputFields select');
    let allFilled = inputs.length > 0;
    
    inputs.forEach(input => {
        if (input.type !== 'file' && !input.value.trim()) {
            allFilled = false;
        }
    });
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = !allFilled;
        nextBtn.classList.toggle('opacity-50', !allFilled);
        nextBtn.classList.toggle('cursor-not-allowed', !allFilled);
    }
    
    // Unlock step 2 & 3 tabs when step 1 is valid
    const tab2 = document.getElementById('tab2');
    const tab3 = document.getElementById('tab3');
    if (tab2) tab2.classList.toggle('opacity-50', !allFilled);
    if (tab3) tab3.classList.toggle('opacity-50', !allFilled);
    
    // Enable/disable tab clicks
    if (tab2) tab2.style.pointerEvents = allFilled ? 'auto' : 'none';
    if (tab3) tab3.style.pointerEvents = allFilled ? 'auto' : 'none';
    
    return allFilled;
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
        
        // Add validation listener
        input.addEventListener('input', validateStep1);
        
        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);
    });
    
    // Show/hide campaign section
    const hasCampaign = typeFields.some(field => field.hasCampaign);
    const campaignSection = document.getElementById('campaignSection');
    if (campaignSection) {
        campaignSection.classList.toggle('hidden', !hasCampaign);
    }
    
    // Initial validation
    setTimeout(validateStep1, 100);
}

// Get data from inputs
async function getData() {
    const type = selectedDataType;
    const inputs = document.querySelectorAll('#inputFields input, #inputFields select');
    const data = {};
    
    inputs.forEach(input => {
        if (input.type === 'file') {
            data[input.name] = input.files[0];
        } else {
            data[input.name] = input.value;
        }
    });

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
            qrData = `https://www.instagram.com/${data.username}`;
            break;
        case 'snapchat':
            qrData = `https://www.snapchat.com/add/${data.username}`;
            break;
        case 'telegram':
            qrData = `https://t.me/${data.username}`;
            break;
        case 'tiktok':
            qrData = `https://www.tiktok.com/${data.username.startsWith('@') ? data.username : '@' + data.username}`;
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
