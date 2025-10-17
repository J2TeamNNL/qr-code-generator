# 🔍 Validation System - Đa ngôn ngữ

## ✨ Tính năng

### Realtime Validation
- ✅ Validate khi user nhập (debounce 300ms)
- ✅ Validate khi blur (rời khỏi input)
- ✅ Visual feedback: border xanh (valid) / đỏ (invalid)
- ✅ Error messages hiển thị dưới input
- ✅ Disable Next button khi invalid

### Đa ngôn ngữ (i18n)
- ✅ Error messages hỗ trợ Tiếng Việt & English
- ✅ Tự động switch theo ngôn ngữ hiện tại
- ✅ Dùng translation keys thay vì hardcode

## 📝 Validators

### URL
```javascript
validators.url(value)
// ✓ https://example.com
// ✓ example.com → auto-add https://
// ✗ invalid-url
```
**Error key**: `error_url_invalid`

### Email
```javascript
validators.email(value)
// ✓ user@example.com → lowercase
// ✗ invalid@email
```
**Error key**: `error_email_invalid`

### Phone
```javascript
validators.phone(value)
// ✓ +84 123 456 789 → clean spaces
// ✗ abc123
```
**Error key**: `error_phone_invalid`

### WhatsApp
```javascript
validators.whatsapp(value)
// ✓ +84123456789
// ✗ 123456 (cần country code)
```
**Error key**: `error_whatsapp_invalid`

### Social Media
- **TikTok**: `@username` hoặc full URL → `error_tiktok_invalid`
- **Instagram**: `@username` hoặc full URL → `error_instagram_invalid`
- **Telegram**: `@username` hoặc `t.me/username` → `error_telegram_invalid`
- **Spotify**: Full URL → `error_spotify_invalid`

## 🔧 Cách thêm validator mới

### 1. Thêm validator function
```javascript
// js/app.js
const validators = {
    myValidator: (value) => {
        if (!isValid(value)) {
            return { valid: false, messageKey: 'error_my_validator' };
        }
        return { valid: true, processed: cleanValue };
    }
}
```

### 2. Thêm translation keys
```javascript
// js/translations.js
vi: {
    error_my_validator: 'Lỗi tiếng Việt'
},
en: {
    error_my_validator: 'Error in English'
}
```

### 3. Map validator trong validateStep1()
```javascript
if (fieldName === 'myfield') {
    validator = validators.myValidator;
}
```

## 📊 Flow hoạt động

```
User nhập input
    ↓
Debounce 300ms
    ↓
validateStep1()
    ↓
Gọi validator(value)
    ↓
{ valid, messageKey, processed }
    ↓
Translate messageKey → error message
    ↓
Show error + visual feedback
    ↓
Enable/Disable Next button
```

## 🎯 Test Cases

### Test đa ngôn ngữ
1. Nhập URL sai → Error tiếng Việt
2. Switch sang English → Error chuyển sang English
3. Switch lại Việt → Error chuyển lại tiếng Việt

### Test validation
1. URL: `example` → ✗ Error
2. URL: `example.com` → ✓ Auto-add https://
3. Email: `test@test.com` → ✓ Lowercase
4. Phone: `+84 123 456` → ✓ Clean spaces
5. Social: `@username` → ✓ Convert to full URL

## 📁 Files liên quan

- `js/app.js` (dòng 34-139): Validators
- `js/app.js` (dòng 495-575): validateStep1()
- `js/translations.js` (dòng 73-82, 154-163): Error messages
- `js/utils.js` (dòng 64-68): LanguageManager.translate()
