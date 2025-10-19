# 🎯 QR Code Generator

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**Công cụ tạo mã QR miễn phí, mã nguồn mở với nhiều tùy chọn tùy chỉnh**

</div>

---

## ✨ Tính năng

### 📱 Hỗ trợ nhiều loại dữ liệu

Tạo QR code cho nhiều mục đích khác nhau:

- **URL** - Liên kết website
- **Plain Text** - Văn bản thuần
- **Email** - Địa chỉ email
- **Phone** - Số điện thoại
- **SMS** - Tin nhắn SMS
- **WiFi Login** - Thông tin đăng nhập WiFi
- **WhatsApp** - Số WhatsApp
- **YouTube** - Kênh/Video YouTube
- **Instagram** - Tài khoản Instagram
- **LinkedIn** - Profile LinkedIn
- **Facebook** - Trang Facebook
- **X (Twitter)** - Tài khoản X
- **Discord** - Server/User Discord
- **Telegram** - Tài khoản Telegram
- **TikTok** - Tài khoản TikTok
- **Spotify** - Playlist/Artist Spotify

### 🎨 Tùy chỉnh nâng cao

- **📷 Logo tùy chỉnh** - Upload ảnh logo để đặt ở giữa QR code (khuyến nghị: ảnh vuông 1:1, tối thiểu 200x200px)
- **✏️ Text tùy chỉnh** - Thêm text với màu sắc tùy chọn
- **🌈 Màu sắc** - Tùy chỉnh màu QR và màu nền với kiểm tra độ tương phản
- **📊 Google Campaign Tracking** - Tự động thêm tham số UTM cho marketing
- **⚡ True Live Preview** - QR code tự động update khi thay đổi input (không cần bấm Generate)
- **🌙 Dark Mode** - Tự động nhận diện theo hệ thống hoặc chọn thủ công
- **🌐 Đa ngôn ngữ** - Tiếng Việt & English
- **💾 Export đa dạng** - PNG, SVG, PDF
- **🐛 Error Reporting** - Hệ thống báo lỗi tích hợp, tracking user activities

### 🚀 Ưu điểm

- ✅ **Miễn phí 100%** - Không giới hạn số lượng QR code
- ✅ **Bảo mật** - Xử lý hoàn toàn trên trình duyệt, không lưu trữ dữ liệu
- ✅ **Không cần cài đặt** - Chạy trực tiếp trên trình duyệt
- ✅ **Responsive** - Hoạt động tốt trên desktop & mobile
- ✅ **Mobile Optimized** - Download & preview QR tối ưu cho điện thoại
- ✅ **Icon Fallback** - Emoji fallback nếu CDN bị chặn
- ✅ **Open Source** - Mã nguồn mở, có thể tùy chỉnh

---

## 🚀 Bắt đầu

### 🌐 Sử dụng trực tiếp

**Live Demo:** [https://j2teamnnl.github.io/qr-code-generator](https://j2teamnnl.github.io/qr-code-generator)

---

## 📖 Hướng dẫn sử dụng

### Tạo QR Code nhanh chóng - Single Page!

Không còn step wizard phức tạp, tất cả trên 1 trang:

1. **Chọn loại dữ liệu**
   - Click vào 1 trong các card: URL, Text, Email, WhatsApp, Instagram, v.v.
   
2. **Nhập thông tin**
   - Điền thông tin tương ứng vào form
   - VD: URL, email, số điện thoại, username, v.v.
   
3. **Tùy chỉnh (tuỳ chọn)**
   - Chọn màu sắc QR code và background
   - Thêm logo (auto-crop vuông 1:1) hoặc text ở giữa
   - Bật UTM tracking cho URL marketing
   
4. **Live Preview**
   - QR code tự động hiển thị khi bạn nhập/thay đổi thông tin
   - Không cần bấm nút Generate - tự động update!
   
5. **Download**
   - Chọn format: PNG, SVG, hoặc PDF
   - Tải về máy tuỳ ý

### 🐛 Báo lỗi

- Nút "🐛 Báo Lỗi" floating ở góc phải màn hình
- Tự động tracking tất cả hành động của bạn
- Copy report và gửi qua GitHub Issues hoặc Messenger

## 🛠️ Công nghệ

| Công nghệ                | Mục đích             |
| ------------------------ | -------------------- |
| **HTML5**                | Cấu trúc trang web   |
| **JavaScript (Vanilla)** | Logic xử lý          |
| **Tailwind CSS**         | Styling & UI         |
| **QRCode.js**            | Thư viện tạo QR code |
| **jsPDF**                | Export PDF           |

---

## 📁 Cấu trúc dự án

```
qr-code-generator/
├── index.html              # File HTML chính
├── js/
│   ├── app.js             # Logic chính, event handlers
│   ├── qr-generator.js    # QR generation & styling
│   ├── translations.js    # Multi-language data
│   ├── utils.js           # Theme, Language, Wizard controllers
│   └── logger.js          # Activity logger & error reporting
├── css/
│   └── style.css          # Custom styles, responsive
├── package.json           # Dependencies & scripts
├── .eslintrc.json         # ESLint config
├── .prettierrc.json       # Prettier config
├── README.md              # Tài liệu
├── CHANGELOG.md           # Lịch sử thay đổi
├── TODO.md                # Pending tasks
└── LICENSE                # MIT License
```

---

## 🛠️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/j2teamnnl/qr-code-generator.git
cd qr-code-generator

# Install dependencies
npm install
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint errors
npm run lint:fix

# Format code with Prettier
npm run format

# Run all checks
npm run check
```

### ESLint & Prettier

- **ESLint**: Kiểm tra lỗi code, coding standards
- **Prettier**: Auto-format code theo chuẩn
- Config files: `.eslintrc.json`, `.prettierrc.json`
- Chạy `npm run lint:fix` trước khi commit

---

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp!

---

## 📄 License

Dự án này được phân phối dưới **MIT License** - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 💖 Cảm ơn

- Windsurf - Claude Sonnet
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - Thư viện tạo QR code
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- Tất cả contributors đã đóng góp cho dự án

---

<div align="center">

**⭐ Nếu thấy hữu ích, hãy star repo này! ⭐**

Vibe code with ❤️ by [J2TeamNNL](https://github.com/j2teamnnl)

</div>
