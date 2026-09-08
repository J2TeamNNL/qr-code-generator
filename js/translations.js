// Translations data
const translations = {
    vi: {
        title: 'QR Code Generator',
        subtitle: 'Tạo mã QR miễn phí với nhiều tùy chọn tùy chỉnh',
        
        // Headers
        select_data_type: 'Chọn loại dữ liệu',
        customize_qr: 'Tùy chỉnh giao diện QR',
        tab_data_input: 'Nhập dữ liệu',
        tab_customize: 'Tùy chỉnh',
        
        // QR Colors
        qr_colors: 'Màu sắc QR Code:',
        qr_color: 'Màu QR:',
        bg_color: 'Màu nền:',
        color_hex_placeholder: '#000000',
        color_hex_invalid: 'Mã màu không hợp lệ. Dùng hex (#000000 hoặc 000000) hoặc rgb(0, 0, 0).',
        color_warning: '⚠️ Lưu ý: Dùng màu có độ tương phản cao (đen/trắng) để đảm bảo quét được tốt nhất. Màu sáng hoặc màu tương tự nhau có thể làm giảm khả năng scan.',
        color_mode_solid: 'Một màu',
        color_mode_gradient: 'Gradient',
        gradient_color: 'Màu thứ hai:',
        gradient_type: 'Kiểu gradient:',
        gradient_linear: 'Tuyến tính',
        gradient_radial: 'Tròn',
        gradient_direction: 'Hướng:',
        dir_0: 'Trái → Phải',
        dir_45: 'Chéo xuống',
        dir_90: 'Trên → Dưới',
        dir_135: 'Chéo lên',
        dir_180: 'Phải → Trái',
        dir_270: 'Dưới → Trên',
        custom_eye_color: 'Màu mắt QR riêng',
        eye_frame_color: 'Khung mắt (ngoài):',
        eye_ball_color: 'Tâm mắt (trong):',
        logo_gallery: 'Chọn logo mẫu:',
        logo_upload_own: 'Hoặc tải logo của bạn:',
        logo_size: 'Kích thước logo:',
        logo_remove_bg: 'Xóa nền trắng của logo',
        logo_remove_bg_hint: 'Hữu ích với logo JPG/PNG nền trắng. Logo đã trong suốt thì không đổi nhiều.',
        logo_icon_star: 'Ngôi sao',
        logo_icon_heart: 'Trái tim',
        logo_icon_link: 'Liên kết',
        logo_icon_wifi: 'WiFi',
        logo_icon_camera: 'Máy ảnh',
        logo_icon_cart: 'Giỏ hàng',
        logo_icon_pin: 'Vị trí',
        logo_icon_music: 'Nhạc',
        
        // QR Size
        qr_size: 'Kích thước QR Code:',
        qr_size_input: 'Nhập kích thước (px):',
        qr_size_hint: 'Khuyến nghị: 200-500px cho web, 300-800px cho in ấn',
        
        // Center customization
        customize_center: 'Tùy chỉnh giữa QR:',
        add_logo: '📷 Thêm Ảnh',
        add_logo_hint: 'Gợi ý: PNG, JPG, SVG, WEBP — ảnh chữ nhật cũng được, nền trong suốt tốt nhất',
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
        
        // Alert messages
        alert_please_fill: 'Vui lòng nhập đầy đủ thông tin!',
        alert_data_too_long: 'Dữ liệu quá dài! Vui lòng rút ngắn nội dung.',
        alert_qr_failed: 'Không tạo được QR code. Vui lòng thử lại.',
        alert_logo_load_failed: 'Không thể tải logo. Vui lòng thử file khác.',
        alert_image_process_failed: 'Không thể xử lý ảnh. Vui lòng thử file khác.',
        
        // Logo processing messages
        logo_processing: '⏳ Đang xử lý ảnh...',
        logo_ready: '✓ Ảnh đã sẵn sàng (giữ tỉ lệ gốc):',
        logo_error: '❌ Lỗi xử lý ảnh',
        
        // Error report
        error_report_title: 'Báo Lỗi',
        error_report_desc: 'Dưới đây là thông tin chi tiết về hoạt động của bạn. Hãy copy và gửi cho chúng tôi!',
        error_report_copy: 'Copy Báo Cáo',
        error_report_close: 'Đóng',
        error_report_copied: 'Đã Copy!',
        error_report_button: 'Báo Lỗi',
        error_report_button_title: 'Báo lỗi hoặc gửi feedback',
    },
    en: {
        title: 'QR Code Generator',
        subtitle: 'Create free QR codes with multiple customization options',
        
        // Headers
        select_data_type: 'Select data type',
        customize_qr: 'Customize QR appearance',
        tab_data_input: 'Data Input',
        tab_customize: 'Customize',
        
        // QR Colors
        qr_colors: 'QR Code Colors:',
        qr_color: 'QR Color:',
        bg_color: 'Background Color:',
        color_hex_placeholder: '#000000',
        color_hex_invalid: 'Invalid color. Use hex (#000000 or 000000) or rgb(0, 0, 0).',
        color_warning: '⚠️ Note: Use high contrast colors (black/white) for best scanability. Light or similar colors may reduce scanning ability.',
        color_mode_solid: 'Single color',
        color_mode_gradient: 'Gradient',
        gradient_color: 'Second color:',
        gradient_type: 'Gradient type:',
        gradient_linear: 'Linear',
        gradient_radial: 'Radial',
        gradient_direction: 'Direction:',
        dir_0: 'Left → Right',
        dir_45: 'Diagonal down',
        dir_90: 'Top → Bottom',
        dir_135: 'Diagonal up',
        dir_180: 'Right → Left',
        dir_270: 'Bottom → Top',
        custom_eye_color: 'Custom eye colors',
        eye_frame_color: 'Eye frame (outer):',
        eye_ball_color: 'Eye ball (inner):',
        logo_gallery: 'Pick a sample logo:',
        logo_upload_own: 'Or upload your own:',
        logo_size: 'Logo size:',
        logo_remove_bg: 'Remove white logo background',
        logo_remove_bg_hint: 'Useful for JPG/PNG logos on white. Transparent logos stay mostly unchanged.',
        logo_icon_star: 'Star',
        logo_icon_heart: 'Heart',
        logo_icon_link: 'Link',
        logo_icon_wifi: 'WiFi',
        logo_icon_camera: 'Camera',
        logo_icon_cart: 'Cart',
        logo_icon_pin: 'Pin',
        logo_icon_music: 'Music',
        
        // QR Size
        qr_size: 'QR Code Size:',
        qr_size_input: 'Enter size (px):',
        qr_size_hint: 'Recommended: 200-500px for web, 300-800px for print',
        
        // Center customization
        customize_center: 'Customize center:',
        add_logo: '📷 Add Logo',
        add_logo_hint: 'Tip: PNG, JPG, SVG, WEBP — rectangular images are fine, transparent background recommended',
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
        
        // Alert messages
        alert_please_fill: 'Please fill in all required information!',
        alert_data_too_long: 'Data is too long! Please shorten the content.',
        alert_qr_failed: 'Could not create the QR code. Please try again.',
        alert_logo_load_failed: 'Failed to load logo. Please try another file.',
        alert_image_process_failed: 'Failed to process image. Please try another file.',
        
        // Logo processing messages
        logo_processing: '⏳ Processing image...',
        logo_ready: '✓ Image ready (original aspect ratio):',
        logo_error: '❌ Image processing error',
        
        // Error report
        error_report_title: 'Error Report',
        error_report_desc: 'Below is detailed information about your activity. Please copy and send it to us!',
        error_report_copy: 'Copy Report',
        error_report_close: 'Close',
        error_report_copied: 'Copied!',
        error_report_button: 'Report Error',
        error_report_button_title: 'Report error or send feedback',
    },
};

export { translations };
