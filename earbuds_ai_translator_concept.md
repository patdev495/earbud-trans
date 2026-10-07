# TÀI LIỆU Ý TƯỞNG & KIẾN TRÚC SẢN PHẨM: TAI NGHE DỊCH THUẬT & HỌC NGOẠI NGỮ THỜI GIAN THỰC (HANDS-FREE AI EARBUDS)

> **Mục đích tài liệu:** Lưu trữ toàn bộ ý tưởng sản phẩm, phân tích kiến trúc kỹ thuật, giải pháp phát triển ứng dụng iOS trên môi trường Windows và kế hoạch triển khai Giai đoạn 1 (Milestone 1 MVP) để tiếp tục thảo luận hoặc giao việc cho AI Agent khác thực thi.

---

## 1. TỔNG QUAN Ý TƯỞNG (EXECUTIVE SUMMARY)

* **Bài toán:** Giao tiếp trực tiếp ngoài đời thực (face-to-face) giữa hai người khác ngôn ngữ, hoặc luyện phản xạ ngoại ngữ trong đời thực.
* **Mục tiêu sản phẩm:** Tạo ra một ứng dụng iOS kết nối với tai nghe nhét tai Bluetooth không dây (TWS) mang lại trải nghiệm **Hands-free (Rảnh tay 100%)**:
  * Người dùng đeo tai nghe, điện thoại có thể để trên bàn hoặc cắm ở túi áo (hở mic).
  * Hai người trò chuyện hoàn toàn tự nhiên mà không cần cầm điện thoại hay bấm nút micro trên màn hình.

---

## 2. HAI CHẾ ĐỘ HOẠT ĐỘNG CHÍNH (PRODUCT MODES)

### 🔵 Chế độ 1: Giao tiếp thông thường (Live Interpreter - "Phiên dịch viên tàng hình")
* **Đối tượng:** Đi du lịch, đàm phán đối tác, mua bán, hỏi đường.
* **Cơ chế 2 chiều:**
  * **Chiều 1 (Người nước ngoài nói):** Mic iPhone thu âm $\rightarrow$ AI dịch sang tiếng Việt $\rightarrow$ **Thì thầm bản dịch vào tai nghe** của người đeo (đối phương không nghe thấy, tạo cảm giác người đeo hiểu ngay lập tức).
  * **Chiều 2 (Người đeo nói tiếng Việt):** Mic tai nghe thu âm $\rightarrow$ AI dịch sang ngôn ngữ đối phương $\rightarrow$ **Phát qua loa ngoài iPhone** cho họ nghe (đồng thời hiển thị phụ đề chữ to trên màn hình).
* **Tính năng phụ trợ:**
  * **Chống nói chen (Barge-in):** Khi loa ngoài đang phát câu dịch mà đối phương bất ngờ nói chen vào, loa lập tức ngắt tiếng để ưu tiên lắng nghe họ.

### 🟢 Chế độ 2: Học ngoại ngữ (AI Shadow Coach - "Phao cứu sinh ngầm")
* **Đối tượng:** Người đang học ngoại ngữ, muốn rèn luyện phản xạ nghe - nói với người bản xứ ngoài đời thực.
* **Nguyên lý:** Không dịch full câu ngay lập tức để ép não bộ tự suy nghĩ và luyện nghe.
* **Cơ chế hoạt động:**
  * **Lưới an toàn (Delay Hint):** Khi người nước ngoài nói, tai nghe giữ im lặng để người học tự nghe qua chế độ Xuyên âm (Transparency). Nếu người học im lặng quá 2-3 giây (chưa hiểu), AI mới thì thầm bản dịch tiếng Việt vào tai để "cứu nguy".
  * **Chỉ dịch từ vựng khó / Tiếng lóng:** AI lọc các thành ngữ, từ vựng C1/C2 trong câu của đối phương và thì thầm giải nghĩa ngắn gọn.
  * **Sửa lỗi ngầm (Whisper Correction):** Người học tự nói tiếng nước ngoài với đối phương. Sau khi dứt câu, AI thì thầm vào tai người học: *"Câu vừa rồi bạn chia sai thì quá khứ, nên nói là 'went' thay vì 'go'"*.
  * **Tạo Flashcard tự động (Post-review):** Cuộc trò chuyện kết thúc $\rightarrow$ AI tự xuất danh sách từ vựng mới và lỗi sai thành bộ thẻ Anki/Flashcard để ôn tập.

---

## 3. THÁCH THỨC VẬT LÝ & KỸ THUẬT ÂM THANH

### 3.1. Đặc tính mic của tai nghe nhét tai không dây (TWS)
* Hầu hết tai nghe TWS (AirPods, Galaxy Buds, Sony WF...) có thuật toán lọc ồn đàm thoại (ENC/cVc) định hướng vào miệng người đeo.
* Giọng của người đeo thu rất to và rõ, nhưng tiếng người đối diện (cách 1 - 1.5m) có thể bị chip tai nghe coi là "tạp âm" và bóp nhỏ lại.
* **Giải pháp Audio Routing:**
  * **Phương án Ưu tiên:** Đặt điện thoại trên bàn / túi áo $\rightarrow$ Dùng **Mic của chính iPhone** để thu âm (mic iPhone là mic phòng, cực kỳ nhạy và bắt rõ cả 2 người). Tai nghe Bluetooth chỉ nhận luồng âm thanh phát lại (Audio Output).
  * **Phương án Độc lập:** Nếu mic tai nghe vẫn thu được tiếng đối phương đủ nghe, sử dụng kỹ thuật Auto Gain Normalization để kéo âm lượng người đối diện lên trước khi đẩy vào AI STT.

### 3.2. Voice Activity Detection (VAD) & Tự động ngắt câu
* Tích hợp **Silero VAD** chạy on-device.
* Khi phát hiện khoảng lặng (silence threshold 400ms – 600ms), hệ thống tự động chốt câu (end of turn) và đẩy audio chunk đi xử lý.

### 3.3. Khử tiếng vọng (Acoustic Echo Cancellation - AEC)
* Khi loa ngoài iPhone phát âm thanh dịch, mic iPhone không được phép thu lại tiếng đó.
* Trên iOS, kích hoạt `AVAudioSession` với chế độ `.voiceChat` để tận dụng chip DSP khử vọng phần cứng của Apple.

---

## 4. GIẢI PHÁP PHÁT TRIỂN TRÊN MÔI TRƯỜNG WINDOWS CHO IOS

### Vấn đề:
* Nhà phát triển đang sử dụng **hệ điều hành Windows**, trong khi biên dịch iOS native (Swift/Xcode) bắt buộc phải có **macOS**.

### Giải pháp tối ưu: **React Native + Expo (Expo Go)**
1. **Quy trình phát triển:**
   * Antigravity / Codex khởi tạo dự án React Native bằng Expo trên máy Windows (`npx create-expo-app`).
   * Toàn bộ mã nguồn viết bằng TypeScript.
   * Trên máy Windows, chạy lệnh `npx expo start` $\rightarrow$ sinh ra mã QR trên Terminal.
   * Cài app **Expo Go** trên iPhone từ App Store $\rightarrow$ Quét mã QR qua Wi-Fi.
   * **App chạy thử trực tiếp trên iPhone thật ngay lập tức**, hỗ trợ Hot-Reload mà **không cần máy Mac, không cần Xcode, không cần tài khoản Apple Developer $99**.
2. **Khi đóng gói bản Production/TestFlight:**
   * Dùng dịch vụ **Expo EAS Build** (hạ tầng cloud của Expo tự động compile trên server Mac và trả về link cài/TestFlight).

---

## 5. KẾ HOẠCH TRIỂN KHAI GIAI ĐOẠN 1 (MILESTONE 1: POC)

### Mục tiêu duy nhất:
> **Đeo tai nghe Bluetooth $\rightarrow$ App thu âm và chuyển đổi thành văn bản (Speech-to-Text) chính xác, phân biệt được rõ ràng ai là người đang nói (Speaker Diarization).**
> *(Chưa cần gắn tính năng dịch hay TTS để tránh làm phức tạp hóa vấn đề).*

### Các bước thực hiện:
1. **Khởi tạo dự án:**
   * Tạo app Expo: `npx create-expo-app EarbudsTranslatorPOC --template blank-typescript`.
   * Cài các thư viện xử lý âm thanh: `expo-av` hoặc `react-native-live-audio-stream`.
2. **Cấu hình Audio Session:**
   * Cấu hình ghi âm chấp nhận input từ Bluetooth Headset / Built-in Mic.
   * Format audio: 16kHz, 16-bit PCM Mono (chuẩn tối ưu cho các mô hình Speech AI).
3. **Kết nối API Speech-to-Text Streaming:**
   * Sử dụng **Deepgram Nova-2 API** (hoặc Whisper Streaming) qua kết nối WebSocket thời gian thực.
   * Bật cờ `diarize=true` trên Deepgram để AI tự động đánh dấu:
     * `[Speaker 0]`: Giọng người đeo.
     * `[Speaker 1]`: Giọng người đối diện.
4. **Màn hình hiển thị (UI):**
   * Hiển thị danh sách hội thoại dạng bong bóng chat:
     * Bên phải (Màu xanh): Lời nói của Speaker 0.
     * Bên trái (Màu xám): Lời nói của Speaker 1.
   * Hiển thị chỉ số Latency (ms) từ lúc dứt câu đến khi text xuất hiện.
5. **Tiêu chí nghiệm thu (Acceptance Criteria):**
   * Đứng cách người đối diện 1 – 1.5 mét, nói chuyện qua lại 5-10 câu.
   * App nhận dạng đúng trên 90% nội dung.
   * Phân biệt đúng lượt nói của từng người.
   * Độ trễ hiển thị text < 800ms.

---

## 6. TECH STACK ĐỀ XUẤT CHO CẢ DỰ ÁN

| Thành phần | Công nghệ đề xuất | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Mobile Framework** | React Native (Expo) | Code trên Windows, test ngay trên iPhone qua Expo Go |
| **Ngôn ngữ** | TypeScript | Chặt chẽ, dễ tích hợp với các SDK AI |
| **Voice Detection (VAD)** | Silero VAD / On-device VAD | Nhận diện dứt câu cực nhanh, tiết kiệm băng thông |
| **Speech-to-Text (STT)** | Deepgram Nova-2 WebSocket | Độ trễ ~300ms, hỗ trợ tiếng Việt và tiếng Anh kèm Diarization |
| **Translation Engine** | OpenAI GPT-4o-mini / DeepL API | Dịch theo ngữ cảnh hội thoại, độ trễ ~300ms |
| **Text-to-Speech (TTS)** | ElevenLabs Flash / OpenAI TTS | Giọng đọc tự nhiên, phản xạ nhanh |
| **Giải pháp Native Voice-to-Voice** | OpenAI Realtime API (WebRTC) | Đạt độ trễ < 800ms cho toàn bộ chu trình dịch |
