# Lab Expo Profile - Books Management App

แอปพลิเคชัน React Native สำหรับจัดการหนังสือและแสดงข้อมูลส่วนตัว สร้างด้วย Expo และ Expo Router  
เชื่อมต่อกับ REST API สำหรับระบบ Authentication และ Books Management

## 🎯 ฟีเจอร์หลัก

### 📱 หน้าโปรไฟล์ (Profile Screen)
- แสดงข้อมูลส่วนตัวของนักศึกษา
- ข้อมูลการศึกษา และทักษะ
- ระบบ Dark/Light Mode Toggle
- Navigation ไปยังหน้าต่างๆ

### 🔐 ระบบ Authentication
- **Login/Register** - เข้าสู่ระบบและสมัครสมาชิก
- **Auto-login** - จำการเข้าสู่ระบบด้วย AsyncStorage
- **Protected Routes** - ป้องกันการเข้าถึงหน้าต่างๆ โดยไม่ login
- **User Profile** - แสดงข้อมูล user ที่ login

### 📚 ระบบจัดการหนังสือ (Books Management)
- **แสดงรายการหนังสือทั้งหมด** - ดึงข้อมูลจาก API พร้อม pagination และ search
- **ค้นหาหนังสือ** - ค้นหาแบบ real-time
- **ดูรายละเอียดหนังสือ** - คลิกเพื่อดูข้อมูลครบถ้วน
- **เพิ่มหนังสือใหม่** - ฟอร์มสำหรับสร้างหนังสือใหม่
- **แก้ไขข้อมูลหนังสือ** - อัปเดตข้อมูลหนังสือที่มีอยู่
- **ลบหนังสือ** - ลบหนังสือพร้อม confirmation dialog
- **Pull to Refresh** - รีเฟรชข้อมูลแบบ pull down
- **Permission Control** - ตรวจสอบสิทธิ์การแก้ไข/ลบหนังสือ
- **Error Handling** - จัดการ error และแสดงข้อความที่เหมาะสม

### 📖 หน้าข้อมูลรายวิชา (About Course)
- ข้อมูลรายวิชา IN405109
- คำอธิบายรายวิชาแบบละเอียด

## 🛠️ เทคโนโลยีที่ใช้

- **React Native** - Framework สำหรับพัฒนาแอปมือถือ
- **Expo SDK 53** - Platform สำหรับพัฒนา React Native
- **Expo Router 5.1.1** - File-based routing system
- **Context API** - State management สำหรับ theme และ authentication
- **React Hooks** - useState, useEffect, useContext
- **AsyncStorage** - เก็บข้อมูล authentication
- **Expo Router** - File-based routing และ navigation

## 🎨 การออกแบบ UI/UX

- **Modern Design** - Card-based layout ที่สวยงาม
- **Pink Theme** - โทนสีชมพูที่สดใส
- **Dark/Light Mode** - รองรับทั้ง 2 โหมด
- **Responsive** - ปรับได้ตามขนาดหน้าจอ
- **Smooth Animations** - Shadow effects และ transitions
- **Intuitive Navigation** - การนำทางที่ง่ายและเข้าใจง่าย

## 🔌 API Integration

แอปเชื่อมต่อกับ REST API ที่ `http://localhost:3000` หรือ `http://10.10.15.11:3000`

### Authentication API Endpoints:
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - สมัครสมาชิก
- `GET /api/auth/profile` - ดึงข้อมูลโปรไฟล์

### Books API Endpoints:
- `GET /api/books` - ดึงรายการหนังสือทั้งหมด (รองรับ search และ pagination)
- `POST /api/books` - สร้างหนังสือใหม่
- `GET /api/books/{id}` - ดึงข้อมูลหนังสือตาม ID
- `PUT /api/books/{id}` - อัปเดตข้อมูลหนังสือ
- `DELETE /api/books/{id}` - ลบหนังสือ
- `GET /api/books/genres/list` - ดึงรายการ genres
- `GET /api/books/user/my-books` - ดึงหนังสือของ user

## 📁 โครงสร้างไฟล์

```
app/
├── (tabs)/                # Tab Navigation
│   ├── _layout.jsx        # Tab layout configuration
│   ├── index.jsx          # หน้าโปรไฟล์หลัก
│   ├── about.jsx          # หน้าข้อมูลรายวิชา
│   └── books.jsx          # หน้าจัดการหนังสือ
├── (auth)/                # Authentication screens
│   ├── _layout.jsx        # Auth layout
│   └── login.jsx          # หน้า login/register
├── book-detail.jsx        # หน้ารายละเอียดหนังสือ
├── _layout.jsx            # Root layout
├── components/
│   └── ThemeToggle.js     # ปุ่มเปลี่ยน theme
├── config/
│   └── api.js             # API configuration
├── context/
│   ├── AuthContext.js     # Context สำหรับ authentication
│   └── ThemeContext.js    # Context สำหรับ theme
└── styles/
    ├── index.js           # Export ทุก styles
    ├── ProfileStyles.js   # Styles สำหรับโปรไฟล์
    ├── AboutStyles.js     # Styles สำหรับ about
    ├── BookStyles.js      # Styles สำหรับ books
    ├── AuthStyles.js      # Styles สำหรับ authentication
    └── CommonStyles.js    # Styles ที่ใช้ร่วมกัน
```

## 🚀 การติดตั้งและรัน

### Prerequisites
- Node.js และ npm
- API Server รันอยู่ที่ `http://localhost:3000`

### การติดตั้ง
1. **ติดตั้ง dependencies:**
   ```bash
   npm install
   ```

2. **รันแอป:**
   ```bash
   npm start
   # หรือ
   expo start
   ```

3. **รันบนแพลตฟอร์มต่างๆ:**
   ```bash
   npm run android    # Android
   npm run ios        # iOS  
   npm run web        # Web
   ```

### การใช้งาน
1. **เปิดแอป** → จะเริ่มที่หน้า Login
2. **Register Account** → สร้างบัญชีใหม่หรือ
3. **Login** → ใช้บัญชีที่มีอยู่แล้ว
4. **Books Management** → จัดการหนังสือผ่าน API

## 📱 การใช้งาน

### Authentication
1. **Register** - สร้างบัญชีใหม่ด้วย username, email, password
2. **Login** - เข้าสู่ระบบด้วย email และ password
3. **Auto-navigation** - หลัง login จะไปหน้า Profile อัตโนมัติ

### หน้า Profile (หลัง Login)
1. ดูข้อมูลส่วนตัวและทักษะ
2. แสดงข้อมูล user ที่ login (username, email, role)
3. เข้าถึง Books Management ผ่าน Tab Navigation
4. กดปุ่ม 🌙/☀️ เพื่อเปลี่ยน theme
5. กดปุ่ม "🚪 Logout" เพื่อออกจากระบบ

### หน้าจัดการหนังสือ (Books Management)
1. **ดูรายการหนังสือ** - แสดงหนังสือจาก API
2. **ค้นหา** - ค้นหาหนังสือแบบ real-time
3. **เพิ่มหนังสือ** - กดปุ่ม "+ Add Book" เพื่อสร้างใหม่
4. **ดูรายละเอียด** - กดที่การ์ดหนังสือเพื่อดู detail
5. **แก้ไข** - กดปุ่ม ✏️ เพื่อแก้ไขข้อมูล
6. **ลบ** - กดปุ่ม 🗑️ เพื่อลบหนังสือ
7. **Pull to Refresh** - ลากลงเพื่อรีเฟรชข้อมูลจาก API
8. **Permission Control** - แสดงปุ่มแก้ไข/ลบตามสิทธิ์
9. **Error Handling** - แสดงข้อความ error ที่เข้าใจง่าย

## 🎓 วัตถุประสงค์การศึกษา

Project นี้สร้างขึ้นสำหรับรายวิชา **IN405109 - การเขียนโปรแกรมบนอุปกรณ์เคลื่อนที่แบบไฮบริด** 

เพื่อแสดงให้เห็นถึงความสามารถในการ:
- พัฒนาแอป React Native ด้วย Expo
- ใช้งาน Expo Router สำหรับ navigation
- เชื่อมต่อกับ REST API และจัดการ authentication
- จัดการ state ด้วย Context API
- ออกแบบ UI/UX ที่สวยงามและใช้งานง่าย
- จัดการ responsive design
- ใช้งาน modern React patterns และ hooks
- จัดการ error handling และ user feedback
- ใช้งาน AsyncStorage สำหรับ persistent data
- สร้างระบบ permission control

## 👨‍🎓 ผู้พัฒนา

**ถิรวัฒน์ โชติธนกิจไพศาล**
- รหัสนักศึกษา: 653450090-6
- สาขา: วิทยาการคอมพิวเตอร์
- มหาวิทยาลัยข่อนแก่นวิทยาเขตหนองคาย
