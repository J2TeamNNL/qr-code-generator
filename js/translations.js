// Translations data
const translations = {
    vi: {
        title: 'QR Code Generator',
        subtitle: 'Tạo mã QR miễn phí với nhiều tùy chọn tùy chỉnh',
        
        // Headers
        select_data_type: 'Chọn loại dữ liệu',
        customize_qr: 'Tùy chỉnh giao diện QR',
        
        // QR Colors
        qr_colors: 'Màu sắc QR Code:',
        qr_color: 'Màu QR:',
        bg_color: 'Màu nền:',
        color_warning: '⚠️ Lưu ý: Dùng màu có độ tương phản cao (đen/trắng) để đảm bảo quét được tốt nhất. Màu sáng hoặc màu tương tự nhau có thể làm giảm khả năng scan.',
        
        // Center customization
        customize_center: 'Tùy chỉnh giữa QR:',
        add_logo: '📷 Thêm Ảnh',
        add_logo_hint: 'Gợi ý: Ảnh vuông (1:1), tối thiểu 200x200px, nền trong suốt tốt nhất',
        add_text: '✏️ Thêm Văn bản',
        no_add: '🚫 Không thêm gì',
        none: 'Không thêm gì',
        enter_text: 'Nhập text...',
        text_color: 'Màu text:',
        
        // Campaign
        advanced_settings: 'Cài đặt nâng cao',
        campaign_desc: 'Thêm UTM parameters',
        
        // Export
        export_format: 'Chọn định dạng file:',
        qr_preview: 'Xem trước QR code:',
        qr_preview_here: 'QR code sẽ hiển thị ở đây',
        
        // Field Labels
        field_url: 'URL',
        field_text: 'Văn bản',
        field_email: 'Email',
        field_phone: 'Số điện thoại',
        field_message: 'Tin nhắn',
        field_ssid: 'Tên WiFi (SSID)',
        field_password: 'Mật khẩu',
        field_security: 'Bảo mật',
        field_username: 'Tên người dùng',
        field_file: 'Chọn file',
        field_address: 'Địa chỉ',
        field_invite: 'Mã mời Discord',
        
        // Placeholders
        placeholder_url: 'https://example.com',
        placeholder_text: 'Nhập văn bản...',
        placeholder_email: 'example@email.com',
        placeholder_phone: '+84123456789',
        placeholder_message: 'Nội dung tin nhắn',
        placeholder_ssid: 'My WiFi',
        placeholder_password: 'password123',
        placeholder_username: 'username',
        placeholder_address: '123 Đường ABC, TP.HCM',
        placeholder_invite: 'abc123xyz',
        
        // Validation Errors
        error_url_invalid: 'URL không hợp lệ. Vui lòng nhập đúng định dạng: https://example.com',
        error_email_invalid: 'Email không hợp lệ',
        error_phone_invalid: 'Số điện thoại không hợp lệ',
        error_whatsapp_invalid: 'Số WhatsApp không hợp lệ. Vui lòng bao gồm mã quốc gia (+84...)',
        error_username_invalid: 'Vui lòng nhập username hoặc link profile hợp lệ',
        error_tiktok_invalid: 'Vui lòng nhập username TikTok hoặc link profile',
        error_instagram_invalid: 'Vui lòng nhập username Instagram hoặc link profile',
        error_telegram_invalid: 'Vui lòng nhập username Telegram',
        error_spotify_invalid: 'Vui lòng nhập link Spotify hợp lệ',
    },
    en: {
        title: 'QR Code Generator',
        subtitle: 'Create free QR codes with multiple customization options',
        
        // Headers
        select_data_type: 'Select data type',
        customize_qr: 'Customize QR appearance',
        
        // QR Colors
        qr_colors: 'QR Code Colors:',
        qr_color: 'QR Color:',
        bg_color: 'Background Color:',
        color_warning: '⚠️ Note: Use high contrast colors (black/white) for best scanability. Light or similar colors may reduce scanning ability.',
        
        // Center customization
        customize_center: 'Customize center:',
        add_logo: '📷 Add Logo',
        add_logo_hint: 'Tip: Square image (1:1), minimum 200x200px, transparent background recommended',
        add_text: '✏️ Add Text',
        no_add: '🚫 None',
        none: 'None',
        enter_text: 'Enter text...',
        text_color: 'Text color:',
        
        // Campaign
        advanced_settings: 'Advanced Settings',
        campaign_desc: 'Add UTM parameters',
        
        // Export
        export_format: 'Choose file format:',
        qr_preview: 'QR code Preview:',
        qr_preview_here: 'QR code will be displayed here',
        
        // Field Labels
        field_url: 'URL',
        field_text: 'Text',
        field_email: 'Email',
        field_phone: 'Phone Number',
        field_message: 'Message',
        field_ssid: 'WiFi Name (SSID)',
        field_password: 'Password',
        field_security: 'Security',
        field_username: 'Username',
        field_file: 'Choose file',
        field_address: 'Address',
        field_invite: 'Discord Invite Code',
        
        // Placeholders
        placeholder_url: 'https://example.com',
        placeholder_text: 'Enter text...',
        placeholder_email: 'example@email.com',
        placeholder_phone: '+1234567890',
        placeholder_message: 'Message content',
        placeholder_ssid: 'My WiFi',
        placeholder_password: 'password123',
        placeholder_username: 'username',
        placeholder_address: '123 Main St, City',
        placeholder_invite: 'abc123xyz',
        
        // Validation Errors
        error_url_invalid: 'Invalid URL. Please enter correct format: https://example.com',
        error_email_invalid: 'Invalid email address',
        error_phone_invalid: 'Invalid phone number',
        error_whatsapp_invalid: 'Invalid WhatsApp number. Please include country code (+1...)',
        error_username_invalid: 'Please enter valid username or profile link',
        error_tiktok_invalid: 'Please enter TikTok username or profile link',
        error_instagram_invalid: 'Please enter Instagram username or profile link',
        error_telegram_invalid: 'Please enter Telegram username',
        error_spotify_invalid: 'Please enter valid Spotify link',
    },
};

export { translations };
