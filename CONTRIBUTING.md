# 🤝 Contributing to QR Code Generator

Cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án! Chúng tôi rất hoan nghênh mọi đóng góp từ cộng đồng.

## 📋 Quy trình đóng góp

### 1. Fork và Clone

```bash
# Fork repo trên GitHub, sau đó clone về máy
git clone https://github.com/your-username/qr-code-generator.git
cd qr-code-generator
```

### 2. Tạo Branch mới

```bash
# Tạo branch từ main
git checkout -b feature/ten-tinh-nang

# Hoặc cho bug fix
git checkout -b fix/ten-bug
```

### 3. Thực hiện thay đổi

- Viết code rõ ràng, dễ hiểu
- Tuân thủ coding style hiện tại
- Test kỹ trước khi commit

### 4. Commit

```bash
git add .
git commit -m "feat: Thêm tính năng XYZ"

# Hoặc
git commit -m "fix: Sửa lỗi ABC"
```

**Commit message format:**
- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Cập nhật tài liệu
- `style:` - Format code, không ảnh hưởng logic
- `refactor:` - Refactor code
- `test:` - Thêm test
- `chore:` - Cập nhật build, dependencies

### 5. Push và tạo Pull Request

```bash
git push origin feature/ten-tinh-nang
```

Sau đó mở Pull Request trên GitHub với:
- Tiêu đề rõ ràng
- Mô tả chi tiết thay đổi
- Screenshots nếu có thay đổi UI

## 📝 Coding Guidelines

### JavaScript

```javascript
// ✅ GOOD - Trailing comma, xuống dòng
const config = {
    name: 'QR Generator',
    version: '1.0.0',
    features: ['logo', 'text'],
};

// ❌ BAD - Một dòng
const config = { name: 'QR Generator', version: '1.0.0' };
```

### HTML/CSS

- Sử dụng Tailwind CSS classes
- Responsive design
- Semantic HTML
- Accessibility (ARIA labels khi cần)

### Code Style

- Indent: 4 spaces
- Quotes: Single quotes cho JavaScript
- Semicolons: Required
- Trailing commas: Yes

## 🐛 Báo cáo lỗi

Khi báo cáo lỗi, vui lòng cung cấp:

1. **Mô tả lỗi** - Lỗi gì xảy ra?
2. **Cách tái hiện** - Các bước để tái hiện lỗi
3. **Kết quả mong đợi** - Điều gì nên xảy ra?
4. **Kết quả thực tế** - Điều gì đã xảy ra?
5. **Screenshots** - Nếu có
6. **Môi trường** - Browser, OS, version

## 💡 Đề xuất tính năng

Khi đề xuất tính năng mới:

1. **Mô tả tính năng** - Tính năng làm gì?
2. **Use case** - Ai sẽ sử dụng? Tại sao cần?
3. **Mockup/Design** - Nếu có
4. **Implementation ideas** - Ý tưởng cài đặt

## ✅ Checklist trước khi PR

- [ ] Code chạy được và không có lỗi
- [ ] Test trên nhiều trình duyệt (Chrome, Firefox, Safari)
- [ ] Test trên mobile
- [ ] Code tuân thủ coding guidelines
- [ ] Cập nhật README nếu cần
- [ ] Commit messages rõ ràng

## 🎯 Ý tưởng đóng góp

Nếu không biết bắt đầu từ đâu, hãy xem:

- [Issues](https://github.com/yourusername/qr-code-generator/issues) - Các vấn đề cần giải quyết
- [Roadmap](README.md#roadmap) - Các tính năng đang lên kế hoạch
- Good first issues - Issues dành cho người mới

## 📞 Liên hệ

Có câu hỏi? Hãy:
- Mở [Discussion](https://github.com/yourusername/qr-code-generator/discussions)
- Hoặc comment trực tiếp trong Issue/PR

---

**Cảm ơn bạn đã đóng góp! 🎉**
