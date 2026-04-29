<!-- Header -->
- title: "OOP là gì? 4 Nguyên tắc vàng của Lập trình hướng đối tượng"
- datetime: 2026-04-29 00:00
- author: "Konn04 và nguồn trên internet"
- keywords: ["OOP", "Lập trình hướng đối tượng", "4 tính chất OOP", "Encapsulation", "Inheritance", "Polymorphism", "Abstraction"]
- description: "Tìm hiểu chi tiết về OOP và 4 nguyên tắc cốt lõi: Đóng gói, Kế thừa, Đa hình và Trừu tượng. Cẩm nang không thể thiếu cho sinh viên IT và lập trình viên."
- image: "assets/oop-core-principles-guide.png"
- categories: ["Lập trình", "Kiến thức nền tảng", "Phỏng vấn IT"]
<!-- Content -->
# Lập Trình Hướng Đối Tượng (OOP) và 4 Tính Chất Cốt Lõi

## Giới thiệu

Trong quá trình học lập trình hoặc chuẩn bị cho các buổi phỏng vấn kỹ thuật, bạn chắc chắn sẽ gặp khái niệm **Lập trình hướng đối tượng (Object-Oriented Programming - OOP)**. Đây là một trong những nền tảng quan trọng giúp bạn viết code rõ ràng, dễ bảo trì và có khả năng mở rộng cao.

Vậy OOP là gì? Tại sao nó lại quan trọng đến vậy? Và 4 tính chất cốt lõi của OOP gồm những gì? Bài viết này sẽ giúp bạn hiểu rõ từ cơ bản đến nâng cao, kèm theo ví dụ thực tế dễ hiểu.

<!-- keyword: oop concept diagram, object oriented programming illustration -->
![OOP Overview](assets/oop-overview.png)

---

## OOP là gì?

OOP (Object-Oriented Programming) là phương pháp lập trình dựa trên **đối tượng (object)**. Mỗi đối tượng bao gồm:

* **Thuộc tính (attributes)** – dữ liệu
* **Phương thức (methods)** – hành vi

Ví dụ đơn giản:

* Một đối tượng "Sinh viên" có:

  * Thuộc tính: tên, tuổi, mã sinh viên
  * Phương thức: học(), thi(), đăng ký môn()

---

## 4 Tính Chất Cốt Lõi của OOP

### 1. Tính đóng gói (Encapsulation)

Đóng gói là việc **ẩn đi dữ liệu bên trong đối tượng** và chỉ cho phép truy cập thông qua các phương thức.

**Lợi ích:**

* Bảo vệ dữ liệu
* Tránh bị thay đổi ngoài ý muốn
* Dễ kiểm soát logic

**Ví dụ:**

```java
class Student {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

<!-- keyword: encapsulation diagram oop -->
![encapsulation](assets/encapsulation-image.jpg)

---

### 2. Tính kế thừa (Inheritance)

Kế thừa cho phép một lớp **sử dụng lại thuộc tính và phương thức của lớp khác**.

**Lợi ích:**

* Tái sử dụng code
* Giảm trùng lặp
* Dễ mở rộng hệ thống

**Ví dụ:**

```java
class Animal {
    void eat() {
        System.out.println("Eating...");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Barking...");
    }
}
```

<!-- keyword: inheritance diagram oop -->
![inherritance](assets/inherritance.webp)

---

### 3. Tính đa hình (Polymorphism)

Đa hình cho phép **một phương thức có nhiều cách thực thi khác nhau**.

**Có 2 dạng chính:**

* Overloading (nạp chồng)
* Overriding (ghi đè)

**Ví dụ:**

```java
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Dog barks");
    }
}
```

<!-- keyword: polymorphism oop example diagram -->
![polymorphism](assets/polymorphism.png)
---

### 4. Tính trừu tượng (Abstraction)

Trừu tượng giúp **ẩn chi tiết phức tạp và chỉ hiển thị phần cần thiết**.

**Lợi ích:**

* Giảm độ phức tạp
* Tập trung vào logic chính

**Ví dụ:**

```java
abstract class Animal {
    abstract void sound();
}
```

<!-- keyword: abstraction oop diagram -->
![Abstraction](assets/Abstraction-in-Java-768.webp)
---

## So sánh nhanh 4 tính chất

| Tính chất     | Mục đích chính          |
| ------------- | ----------------------- |
| Encapsulation | Bảo vệ dữ liệu          |
| Inheritance   | Tái sử dụng code        |
| Polymorphism  | Linh hoạt trong hành vi |
| Abstraction   | Giảm độ phức tạp        |

---

## Khi nào nên sử dụng OOP?

OOP đặc biệt hữu ích khi:

* Xây dựng hệ thống lớn (web, app, backend)
* Làm việc nhóm
* Cần mở rộng và bảo trì lâu dài

---

## Mẹo phỏng vấn về OOP

Nếu bạn đang chuẩn bị phỏng vấn, hãy lưu ý:

* Hiểu rõ **4 tính chất** (không chỉ định nghĩa mà cả ví dụ)
* Phân biệt:

  * Overloading vs Overriding
  * Abstract class vs Interface
* Có thể giải thích bằng **tình huống thực tế**

---

## Kết luận

OOP không chỉ là lý thuyết mà còn là công cụ giúp bạn trở thành lập trình viên tốt hơn. Nắm vững 4 tính chất cốt lõi sẽ giúp bạn:

* Viết code sạch hơn
* Dễ dàng bảo trì
* Tự tin hơn khi phỏng vấn

👉 Bạn đã từng gặp câu hỏi nào về OOP trong phỏng vấn chưa?
