# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025-10-19 ✅ COMPLETED

### ✨ UX Improvements

#### 🎯 Single-Page Flow - No More Steps!
- **Bỏ hẳn Step Wizard** - Không còn tabs, không còn navigation
- **One-page layout** - Tất cả hiển thị trên cung 1 trang:
  1. Chọn loại dữ liệu (URL, Text, Email, WhatsApp, v.v.)
  2. Nhập thông tin cần thiết
  3. Tùy chỉnh màu sắc, logo/text, UTM tracking
  4. **Live Preview** tự động update ở dưới cùng
  5. Download (PNG/SVG/PDF)
- **Scroll-based UX** - Không cần click Next/Prev, chỉ cần scroll xuống
- **True Live Preview** - QR code tự động update khi thay đổi bất kỳ input nào (debounce 500ms)
- **No validation blocking** - Không còn disable controls hay lock sections

#### 🐛 Debug & Error Reporting System
- **Nút "Báo Lỗi"** ở góc phải màn hình (floating button)
- **Activity Logger** - Tự động lưu tất cả actions của người dùng:
  - Data type selection
  - Input changes
  - Customization options
  - QR generation events
  - Download actions
- **Error Report Dialog** - Popup textarea hiển thị:
  - User actions log
  - Console errors
  - System info (browser, screen size)
  - QR configuration
- **Quick Share** - Copy để gửi qua:
  - GitHub Issues
  - Messenger (direct link)

#### 📱 Mobile Responsiveness
- **QR Code Responsive Fixed** - Đảm bảo QR luôn fit màn hình
- CSS `max-width: 100%` cho canvas và image
- Mobile: giới hạn max 280px x 280px
- Desktop: max 300px x 300px
- Auto scale với `width: auto`, `height: auto`

#### ✅ Quality Checks
- **Logo/Text Insertion** - Verified working correctly
  - Logo: 20% QR size với white background
  - Text: 18% QR size với truncate (max 10 chars)
  - Border và padding phù hợp
  - Error Correction Level H khi có logo/text

### 🔧 Technical Changes

#### Files Created:
- `js/logger.js` - Activity Logger & Error Reporting System

#### Files Modified:
- `index.html` - Removed step tabs/wizard/Generate button, single-page layout, live preview at bottom
- `js/app.js` - Removed WizardController, added auto-generate with debounce (500ms)
- `js/utils.js` - Removed WizardController completely
- `js/translations.js` - Removed unused keys (step titles, navigation buttons)
- `css/style.css` - Enhanced QR responsive with breakpoints (300px/280px/240px)
- `README.md` - Updated documentation with live preview flow
- `CHANGELOG.md` - This file

#### Key Changes:
- Activity tracking system với console intercept
- Error boundary handling với global error listeners  
- User action logger với timestamp (max 100 logs)
- **Single-page layout**: Input → Customization → Live Preview (bottom)
- **No step wizard**: Bỏ hẳn tabs, navigation buttons, validation blocking
- **True Live Preview**: Auto-generate khi thay đổi input/color/logo/text (debounce 500ms)
- CSS: Responsive breakpoints cho desktop/mobile/extra-small

---

## [2.0.0] - 2025-10-17 ✅ COMPLETED

### 🎉 Final Release Notes

**Kim chỉ nam**: Scanability > Everything else  
Tất cả features đã hoàn thành và tested.

### ✨ Latest Updates (Final Polish)

#### 🎨 UI Improvements
- **Tách CSS ra file riêng** - `css/style.css`
- **Font Awesome Icons** - Thay tất cả emoji bằng brand icons chuyên nghiệp
- **Light Mode Fixed** - Input fields, labels, buttons đều readable
- **Dark Mode Perfect** - Contrast tốt, all elements visible
- **Nút Quay lại Fixed** - Proper styling cho cả light/dark mode
- Proper color inheritance cho cả 2 themes

#### 🌐 Internationalization (Best Practice)
- **Refactored field labels** - Không còn hard-code tiếng Việt
- **Translation Keys** - Dùng `labelKey` và `placeholderKey`
- **Dynamic Labels** - All field labels & placeholders support VI/EN
- **28 translation keys** - field_*, placeholder_*
- **Clean Architecture** - Separation of concerns

### ⚠️ IMPORTANT FIXES

#### 🔍 QR Code Scanability - FIXED!
- **REMOVED custom QR styles** (dots, rounded) - Gây lỗi QR structure, không scan được
- **ENABLED color customization** - Với contrast validation (WCAG standard)
- **ENABLED logo/text** - Với size limit an toàn:
  - Logo: 20% of QR (giảm từ 25%)
  - Text: 18% of QR với truncate (max 10 chars)
  - Border & padding tăng lên để dễ đọc
- **Error Correction Level H** khi có logo/text
- **Standard square QR only** - Đảm bảo scanability 100%
- **Contrast ratio validation** - Warn nếu < 4.5
- Test button để debug dễ dàng
- Console logs chi tiết

### 🎯 Major Refactor

#### 🪜 Step Wizard Interface
- **3-step wizard tabs** - Guided experience
- Step 1: Data type selection với validation (phải điền đủ mới next)
- Step 2: Customization (colors, logo/text)
- Step 3: Preview & Export (QR preview + export buttons ngay)
- Smooth transitions between steps
- Validation: Next button disabled cho đến khi điền đầy đủ input

#### 📦 Modular Architecture
- **Tách code thành modules** - Clean separation of concerns
- `js/app.js` - Main logic, data fields, event handlers
- `js/qr-generator.js` - QR generation & styling
- `js/utils.js` - ThemeManager, LanguageManager, WizardController
- `js/translations.js` - Multi-language data
- ES6 modules với import/export

#### 🌙 Dark Mode Improvements
- **Auto-detect system theme** - `prefers-color-scheme` detection
- Optimized dark colors - Better contrast & readability
- Fixed all dark mode styling issues
- Smooth color transitions
- Persistent preference in localStorage

#### 🎨 UI/UX Enhancements
- Cleaner, more organized layout
- Better color contrast in dark mode
- Hover effects on interactive elements
- Loading states & transitions
- Responsive grid for data type selection
- Improved card styling

### 🔧 Technical Improvements
- ES6 modules architecture
- Better error handling
- Cleaner event management
- Separated concerns (UI, logic, data)
- Performance optimizations
- Code reusability

### 📁 File Structure
```
js/
├── app.js              # Main app logic
├── qr-generator.js     # QR generation
├── utils.js            # Helper functions
└── translations.js     # i18n data
```

---

## [1.1.0] - 2025-10-17

### ✨ Added

#### 🌐 Multi-language Support
- Tiếng Việt (VI) và English (EN)
- Language toggle button ở header
- Tự động dịch UI elements

#### 🌙 Dark Mode
- Dark theme với gradient tối
- Toggle button ở header
- Lưu preference vào localStorage
- Smooth transitions

#### 🎨 QR Code Styles
- **Square** - Kiểu vuông truyền thống
- **Dots** - Chấm tròn hiện đại
- **Rounded** - Bo góc mềm mại
- Custom rendering engine

#### 🌈 Color Customization
- Tùy chỉnh màu nền trước (QR code)
- Tùy chỉnh màu nền sau (background)
- Color picker với preview realtime

#### 💾 Multiple Export Formats
- **PNG** - Raster image format
- **SVG** - Vector format (scalable)
- **PDF** - Document format với jsPDF
- Canvas to SVG conversion

### 🔧 Technical Improvements
- Thêm jsPDF library cho PDF export
- Refactor generateQR() function
- Thêm applyQRStyle() function
- Thêm canvasToSVG() helper
- Improved error handling
- Better code organization

### 🎨 UI/UX Enhancements
- Responsive controls ở header
- Icon-based buttons
- Gradient colors cho export buttons
- Improved dark mode styling
- Better visual hierarchy

---

## [1.0.0] - 2025-10-17

### ✨ Initial Release

#### Core Features
- 19 loại dữ liệu hỗ trợ
- Logo customization
- Center text với color picker
- Google Campaign Tracking (UTM)
- Modern UI với Tailwind CSS
- Responsive design
- Client-side processing (bảo mật)

#### Supported Data Types
- URL, Plain Text, Email, Phone, SMS
- WiFi Login, Snapchat, File, E-Address
- WhatsApp, YouTube, Instagram, LinkedIn
- Facebook, X (Twitter), Discord, Telegram
- TikTok, Spotify

#### Advanced Options
- Upload logo image
- Custom center text
- Text color customization
- UTM campaign tracking
- Radio button selection

---

## Future Plans

### 🚀 Upcoming Features (v1.2.0)
- [ ] Batch QR code generation
- [ ] QR code scanner
- [ ] History & Templates
- [ ] More export formats (EPS, WebP)
- [ ] QR code analytics
- [ ] Custom branding options

### 💡 Ideas
- QR code with gradients
- Animated QR codes
- QR code with images/patterns
- Bulk upload from CSV
- API integration
- Chrome extension

---

## Notes

- Sử dụng semantic versioning
- Breaking changes sẽ increment major version
- New features increment minor version
- Bug fixes increment patch version
