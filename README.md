# 🎧 Earbuds Multilingual Realtime AI Translator

Ứng dụng biên dịch & nhận diện giọng nói đa ngôn ngữ thời gian thực dành cho tai nghe Bluetooth / Micro trên điện thoại. Hỗ trợ nhận diện tự động Tiếng Việt, Tiếng Anh, Tiếng Trung Quốc (kèm phiên âm Pinyin có thanh điệu chuẩn), tích hợp bộ lọc tạp âm thông minh và chế độ rảnh tay (Hands-free VAD).

---

## 🚀 Tính năng nổi bật

- 🎙️ **Chế độ Rảnh tay (Hands-free VAD):** Tự động bắt đầu ghi khi nói và tự ngắt gửi dịch khi dừng nói.
- 🛡️ **Lọc tạp âm thông minh (Noise Gate):** 3 cấp độ tuỳ chỉnh (`Chống ồn cao`, `Tiêu chuẩn`, `Nhạy`), chống kích hoạt giả bởi tiếng va chạm ngắn (< 160ms).
- 🌐 **Đa ngôn ngữ tức thì:** Tự động phát hiện ngôn ngữ Việt (VI) / Anh (EN) / Trung (ZH) thông qua Groq Whisper Large-v3 với độ trễ siêu thấp (~300ms).
- 🀄 **Phiên âm Pinyin tự động:** Hiển thị Pinyin kèm thanh điệu ngay dưới phụ đề chữ Hán.
- 🎧 **Hỗ trợ Tai nghe Bluetooth:** Tự động định tuyến âm thanh qua micro tai nghe không dây.
- 📋 **Sao chép 1 chạm & xem độ trễ:** Hiển thị thời lượng và tốc độ phản hồi (`⚡ ms`).

---

## 🛠️ Yêu cầu môi trường

- [Node.js](https://nodejs.org/) (khuyên dùng LTS 20+)
- [pnpm](https://pnpm.io/)
- Tài khoản [Expo](https://expo.dev/) & ứng dụng **Expo Go** trên điện thoại (iOS / Android)
- API Key từ [Groq Console](https://console.groq.com/)

---

## ⚙️ Cấu hình biến môi trường

Tạo file `.env.local` hoặc `.env` ở thư mục gốc của dự án:

```env
EXPO_PUBLIC_GROQ_API_KEY=gsk_your_groq_api_key_here
```

---

## 💻 1. Khởi chạy ở chế độ phát triển (Development Mode)

Chế độ này dùng khi đang code, debug và test trực tiếp trên điện thoại qua mạng LAN / Wifi.

### Bước 1: Cài đặt dependencies (nếu mới clone)
```bash
pnpm install
```

### Bước 2: Chạy máy chủ Metro Dev
```bash
pnpm exec expo start -c --host lan --port 8081
```

### Bước 3: Mở trên điện thoại
- **iPhone / iOS:** Mở camera quét mã QR hiển thị trên terminal hoặc trong trình duyệt Metro (`exp://...`).
- **Android:** Mở ứng dụng **Expo Go** -> chọn **Scan QR code**.
- *Lưu ý:* Điện thoại và máy tính cần kết nối chung một mạng Wifi (hoặc cùng dải mạng LAN).

---

## ☁️ 2. Tải lên Expo Cloud (Dùng độc lập 24/7 không cần bật máy tính)

Khi muốn mang app đi ra ngoài sử dụng qua 4G/Wifi mà không cần bật máy tính hay chạy server Metro:

### Bước 1: Đăng nhập tài khoản EAS (chỉ cần làm 1 lần)
```bash
npx eas-cli login
```

### Bước 2: Tải code mới nhất lên Expo Cloud
Chạy lệnh xuất bản bản cập nhật lên branch `preview`:
```bash
npx eas-cli update --environment preview --branch preview --message "Cap nhat tinh nang moi"
```

### Bước 3: Mở trên điện thoại bất kỳ lúc nào
1. Tải và mở ứng dụng **Expo Go** trên điện thoại.
2. Đăng nhập vào cùng tài khoản Expo của bạn.
3. Trong mục **Projects**, chọn **Earbuds Live** (`earbud-trans`).
4. Ứng dụng sẽ tự động nạp bản cập nhật mới nhất từ đám mây về máy và sẵn sàng sử dụng 24/7!

---

## 📂 Cấu trúc thư mục

```text
├── App.tsx                    # Giao diện chính & kết nối logic
├── app.json                   # Cấu hình Expo, quyền Microphone & Bluetooth
├── eas.json                   # Cấu hình EAS Build & Update
├── src/
│   ├── components/
│   │   ├── LiveVisualizerBar.tsx # Visualizer sóng âm, chuyển chế độ & mức chống ồn
│   │   └── SpeechBubbleItem.tsx  # Bong bóng hội thoại, badge ngôn ngữ & Pinyin
│   ├── hooks/
│   │   └── useHandsfreeTranslator.ts # Engine VAD liên tục, xử lý phân đoạn âm thanh
│   ├── services/
│   │   └── groqSTT.ts         # Service gửi audio tới Groq Whisper Large-v3
│   └── theme/
│       └── colors.ts          # Bộ design tokens giao diện Dark Slate
```

---

## ❓ Câu hỏi thường gặp & Khắc phục lỗi

- **Lỗi không kết nối được mạng LAN khi chạy dev:** Kiểm tra xem máy tính có đang bật VPN hoặc Firewall chặn cổng `8081` hay không, thử chạy `npx expo start --tunnel`.
- **Micro không thu âm:** Vào Cài đặt trên điện thoại -> Cho phép **Expo Go** truy cập Micro.
- **Tiếng Trung không hiện Pinyin:** Đảm bảo `pinyin-pro` đã được cài đặt trong `package.json`.
