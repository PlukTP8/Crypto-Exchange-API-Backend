# 🪙 Crypto Exchange API - Backend

RESTful API สำหรับระบบแลกเปลี่ยนสกุลเงินดิจิทัล (Crypto Exchange) พัฒนาโดยใช้ Node.js, Express, Sequelize และ PostgreSQL

---

## 📦 Features

- ระบบผู้ใช้: สมัคร, ล็อกอิน, โปรไฟล์
- กระเป๋าเงิน: สร้างกระเป๋า, โอนเหรียญ, ล็อกยอดคงเหลือ
- คำสั่งซื้อขาย: Buy/Sell, Matching Engine
- การทำธุรกรรม: แสดงประวัติ, บันทึก transfer/trade
- Swagger UI สำหรับทดสอบ API

---

## 🛠️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/PlukTP8/Crypto-Exchange-API-Backend.git
cd Crypto-Exchange-API-Backend
```
### 2. ติดตั้ง dependencies

```bash
npm install
```
### 3. สร้างไฟล์ .env

```bash
cp .env.template .env    # หรือใช้ Copy-Item ใน PowerShell
```

### 4. รัน Server

```bash
npm run dev
```

### การทดสอบ API ด้วย Swagger

```bash
http://localhost:3000/api-docs
```
