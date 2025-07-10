# 📦 Test RIKAI - Company User Management App

Ứng dụng quản lý công ty và người dùng (Node.js + Express + MySQL + EJS).

---

## 🚀 Tính năng
- Danh sách công ty
- Tạo / Sửa / Xoá công ty
- Danh sách người dùng kèm công ty liên kết
- Tìm kiếm, lọc theo công ty
- Giao diện Bootstrap
- Đóng gói Docker (Node app + MySQL)

---

## 📂 Cấu trúc thư mục

```
.
├── controllers
│   ├── companyController.js
│   └── userController.js
├── models
│   └── db.js
├── utils
│   └── common.js      //các hàm tiện ích
├── routes
│   ├── companyRoute.js
│   └── userRoute.js
├── views
│   ├── layout.ejs
│   ├── companies.ejs
│   ├── company_form.ejs
│   ├── users.ejs
│   └── user_form.ejs
├── server.js
├── package.json
├── Dockerfile
└── docker-compose.yml
```

---

## ⚙️ Cài đặt & chạy cục bộ (không Docker)

```bash
git clone https://github.com/yourname/test-rikai.git
cd test-rikai

npm install

# Chỉnh kết nối CSDL trong models/db.js
# Sau đó chạy
npm start
```

Mở trình duyệt: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Chạy bằng Docker Compose

```bash
git clone https://github.com/yourname/test-rikai.git
cd test-rikai

docker-compose up --build
```

- App chạy ở: [http://localhost:3000](http://localhost:3000)
- MySQL map port: 3307 (host) → 3306 (container)

---

## ⚙️ Biến môi trường (.env ví dụ)

```
DB_HOST=db
DB_USER=root
DB_PASSWORD=root
DB_NAME=company_user_db
```

Trong Docker các giá trị này đã được định nghĩa sẵn trong `docker-compose.yml`.

---

## 🗃️ MySQL mặc định trong Docker
- Database: **company_user_db**
- User: **root**
- Password: **root**
- Port: **3307** (local)

---

## 🧩 Tạo bảng MySQL (migrate thủ công)

Kết nối:

```bash
docker exec -it <db_container_name> mysql -uroot -proot
```

Tạo bảng:

```sql
USE company_user_db;

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);
```

---

## 🧹 Cleanup
```bash
docker-compose down -v
```
Xoá container và volume MySQL.

---

## ❤️ License
MIT

---

> Author: Your Name
