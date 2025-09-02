
## ฟีเจอร์หลัก

### หน้าโปรไฟล์ (Profile Screen)
- แสดงข้อมูลส่วนตัวของนักศึกษา
- ข้อมูลการศึกษา และทักษะ
- ระบบ Dark/Light Mode Toggle
- Navigation ไปยังหน้าต่างๆ

### ระบบ Authentication
- **Login/Register** - เข้าสู่ระบบและสมัครสมาชิก
- **Auto-login** - จำการเข้าสู่ระบบด้วย AsyncStorage
- **Protected Routes** - ป้องกันการเข้าถึงหน้าต่างๆ โดยไม่ login
- **User Profile** - แสดงข้อมูล user ที่ login

### ระบบจัดการหนังสือ (Books Management)
- **แสดงรายการหนังสือทั้งหมด** - ดึงข้อมูลจาก API พร้อม pagination และ search
- **ค้นหาหนังสือ** - ค้นหาแบบ real-time
- **ดูรายละเอียดหนังสือ** - คลิกเพื่อดูข้อมูลครบถ้วน
- **เพิ่มหนังสือใหม่** - ฟอร์มสำหรับสร้างหนังสือใหม่
- **แก้ไขข้อมูลหนังสือ** - อัปเดตข้อมูลหนังสือที่มีอยู่
- **ลบหนังสือ** - ลบหนังสือพร้อม confirmation dialog
- **Pull to Refresh** - รีเฟรชข้อมูลแบบ pull down
- **Permission Control** - ตรวจสอบสิทธิ์การแก้ไข/ลบหนังสือ
- **Error Handling** - จัดการ error และแสดงข้อความที่เหมาะสม

### หน้าข้อมูลรายวิชา (About Course)
- ข้อมูลรายวิชา IN405109
- คำอธิบายรายวิชาแบบละเอียด

##  API Integration
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

## การติดตั้งและรัน

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
   
## 👨‍🎓 ผู้พัฒนา

**นายถิรวัฒน์ โชติธนกิจไพศาล**
- รหัสนักศึกษา: 653450090-6
- สาขา: วิทยาการคอมพิวเตอร์และสารสนเทศ
- มหาวิทยาลัยข่อนแก่นวิทยาเขตหนองคาย
