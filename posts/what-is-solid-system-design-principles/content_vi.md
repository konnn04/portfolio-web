<!-- Header -->
- title: "SOLID là gì? 5 Nguyên tắc vàng trong Thiết kế Hệ thống cho Lập trình viên"
- datetime: 2026-04-28 00:00
- author: "Konnn04 và nguồn internet"
- keywords: ["SOLID", "Clean Code", "System Design", "Lập trình hướng đối tượng", "OOP", "Kinh nghiệm lập trình"]
- description: "Khám phá 5 nguyên tắc SOLID giúp nâng tầm tư duy thiết kế hệ thống, viết code sạch và chuyên nghiệp dành cho sinh viên IT và Developer."
- image: "assets/solid-principles-visual-guide.png"
- categories: ["Lập trình", "Kiến trúc phần mềm", "Kinh nghiệm"]
<!-- Content -->
# SOLID là gì? Chìa khóa vàng trong thiết kế hệ thống cho Lập trình viên

Chào các bạn, mình là Triều. Trong hành trình học IT, chắc hẳn các bạn đã từng nghe đến thuật ngữ "Clean Code" hay "System Design". Một trong những nền tảng quan trọng nhất để đạt được điều đó chính là **SOLID**. 

Dù bạn đang là sinh viên năm 3 đang "vật lộn" với đồ án hay đang chuẩn bị cho kỳ thực tập sắp tới, việc nắm vững SOLID không chỉ giúp bạn viết code "xịn" hơn mà còn là điểm cộng cực lớn trong mắt nhà tuyển dụng. Hãy cùng mình giải mã 5 nguyên tắc này một cách chi tiết nhé!

---

![SOLID principles visual explanation icons](assets/SOLID-principles.png)

## 1. S - Single Responsibility Principle (Nguyên tắc đơn trách nhiệm)

### Định nghĩa
Một class (hoặc module) chỉ nên giữ một trách nhiệm duy nhất và chỉ có một lý do duy nhất để thay đổi.

### Tại sao lại quan trọng?
Hãy tưởng tượng một chiếc dao đa năng: khui bia, cắt giấy, vặn vít. Nếu lưỡi dao gãy, bạn phải thay cả bộ. Trong lập trình cũng vậy, nếu một class làm quá nhiều việc (God Object), khi bạn sửa logic này, vô tình lại làm hỏng logic kia.

### Ví dụ thực tế (TypeScript)
Thay vì để một class `UserService` vừa xử lý logic người dùng, vừa gửi email, vừa log dữ liệu vào file:
- **Sai:** `UserService` lo hết.
- **Đúng:** Chia ra `UserService`, `EmailService`, và `LoggerService`.

![SRP example](assets/srp.png)

> **Mẹo phỏng vấn:** Khi được hỏi về SRP, hãy nhấn mạnh vào khả năng **dễ bảo trì (maintainability)** và **dễ kiểm thử (testability)**.

---

## 2. O - Open/Closed Principle (Nguyên tắc Đóng/Mở)

### Định nghĩa
Thực thể phần mềm (class, module, function) nên **mở để mở rộng (open for extension)** nhưng **đóng để chỉnh sửa (closed for modification)**.

### Giải thích
Bạn không nên sửa code cũ đã chạy ổn định mỗi khi có yêu cầu mới. Thay vào đó, hãy viết thêm code mới dựa trên nền tảng cũ (thông qua kế thừa hoặc interface).

<!-- [Image keyword: Open Closed Principle diagram interface inheritance] -->
![OCP example](assets/ocp.png)


### Ví dụ
Nếu bạn có một module tính lương cho `FullTimeEmployee`, khi có thêm `PartTimeEmployee`, bạn không nên dùng `if-else` trong hàm cũ. Hãy tạo một interface `Employee` và để các class con tự thực hiện logic tính lương của riêng mình.

---

## 3. L - Liskov Substitution Principle (Nguyên tắc thay thế Liskov)

### Định nghĩa
Các đối tượng của class con phải có thể thay thế cho các đối tượng của class cha mà không làm thay đổi tính đúng đắn của chương trình.

### Tại sao sinh viên hay nhầm?
Mọi người thường nghĩ "Con kế thừa từ Cha thì hiển nhiên thay thế được". Nhưng thực tế không đơn giản vậy.
- **Ví dụ điển hình:** Chim biết bay. Đà điểu là chim nhưng đà điểu... không biết bay. Nếu bạn để `Ostrich` kế thừa `Bird` và gọi hàm `fly()`, chương trình sẽ lỗi.

### Giải pháp
Hãy phân cấp lớp hợp lý hơn hoặc sử dụng Composition (kết hợp) thay vì Inheritance (kế thừa) quá đà.

---

## 4. I - Interface Segregation Principle (Nguyên tắc phân tách Interface)

### Định nghĩa
Thay vì dùng một interface lớn cho tất cả, hãy chia thành nhiều interface nhỏ với các mục đích cụ thể. Không nên ép buộc một class phải thực thi những phương thức (method) mà nó không sử dụng.

<!-- [Image keyword: Interface Segregation Principle vs Fat Interface] -->
![ISP example](assets/isp.png)

### Liên hệ thực tế
Trong dự án NestJS hay Next.js, nếu bạn tạo một `RepositoryInterface` chứa 20 phương thức, nhưng một class con chỉ cần 2 cái, đó là vi phạm ISP. Hãy chia nhỏ thành `Readable`, `Writable`, `Deletable`.

---

## 5. D - Dependency Inversion Principle (Nguyên tắc đảo ngược phụ thuộc)

### Định nghĩa
1. Các module cấp cao không nên phụ thuộc vào các module cấp thấp. Cả hai nên phụ thuộc vào sự trừu tượng (abstraction).
2. Sự trừu tượng không nên phụ thuộc vào chi tiết. Chi tiết nên phụ thuộc vào sự trừu tượng.

### Ứng dụng
Đây chính là nền tảng của **Dependency Injection (DI)** mà các bạn thấy trong NestJS hay Angular. 
- Thay vì `Controller` khởi tạo trực tiếp `MySQLDatabase`, hãy để `Controller` nhận một `DatabaseInterface`. Sau này bạn muốn đổi sang MongoDB? Chỉ cần thay class thực thi mà không cần động vào `Controller`.

---

## Tổng kết và Lời khuyên cho các bạn Sinh viên

Nắm vững SOLID không phải là chuyện một sớm một chiều. Bạn cần thực hành, "đập đi xây lại" code của mình nhiều lần để thực sự thấm nhuần.

**Tóm tắt nhanh để đi phỏng vấn:**
- **S:** Một việc duy nhất.
- **O:** Mở rộng chứ không sửa đổi.
- **L:** Con thay được Cha.
- **I:** Interface nhỏ, gọn.
- **D:** Phụ thuộc vào interface/abstraction.

Bạn có đang áp dụng nguyên tắc nào trong dự án của mình không? Hay bạn thấy nguyên tắc nào là khó hiểu nhất?