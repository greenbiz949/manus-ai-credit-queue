# Customer Data Collection App

แอปพลิเคชันสำหรับเก็บข้อมูลลูกค้าและส่งไปยัง Google Sheets แบบอัตโนมัติ พัฒนาด้วย React ในธีมสีดาร์คที่ทันสมัย

## คุณสมบัติ

- 🌙 **ธีมดาร์คสุดทันสมัย** - UI ที่สวยงามและใช้งานง่าย
- 📝 **ฟอร์มครบครัน** - เก็บข้อมูลลูกค้าได้ครบถ้วน
- 🔗 **เชื่อมต่อ Google Sheets** - บันทึกข้อมูลอัตโนมัติ
- ✅ **ตรวจสอบข้อมูล** - Validation ข้อมูลแบบ Real-time
- 📱 **Responsive Design** - ใช้งานได้ทุกอุปกรณ์

## การติดตั้ง

1. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

2. **ตั้งค่า Google Sheets**
   - สร้าง Google Sheet ใหม่
   - คัดลอก Sheet ID จาก URL
   - ไปที่ [Google Apps Script](https://script.google.com/)
   - สร้างโปรเจกต์ใหม่และวางโค้ดจากไฟล์ `google-apps-script.js`
   - แทนที่ `YOUR_GOOGLE_SHEET_ID_HERE` ด้วย Sheet ID ของคุณ
   - Deploy เป็น Web App:
     - คลิก "Deploy" > "New deployment"
     - เลือก type เป็น "Web app"
     - ตั้งค่า Execute as: "Me"
     - Who has access: "Anyone"
     - คัดลอก URL ที่ได้

3. **อัพเดต URL ในแอป**
   - เปิดไฟล์ `src/App.js`
   - แทนที่ `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` ด้วย URL ที่คัดลอกมา

4. **รันแอป**
   ```bash
   npm start
   ```

## โครงสร้างข้อมูลใน Google Sheets

แอปจะสร้างคอลัมน์ดังนี้ใน Google Sheet:

| วันที่/เวลา | ชื่อ-นามสกุล | Link Facebook ของคุณ | Link Ref. Manus AI |
|-------------|-------------|---------------------|-------------------|

## การใช้งาน

1. เปิดแอปในเบราว์เซอร์
2. กรอกข้อมูลในฟอร์ม (ฟิลด์ที่มี * เป็นฟิลด์บังคับ)
3. หากต้องการติดต่อด่วน สามารถคลิกปุ่ม "อยากได้ด่วน แอดไลน์ @beerfreedom"
4. คลิกปุ่ม "ส่งข้อมูล" เพื่อบันทึกข้อมูล
5. ระบบจะบันทึกข้อมูลไปยัง Google Sheets อัตโนมัติ

## เทคโนโลยีที่ใช้

- **React 18** - UI Framework
- **Lucide React** - Icons
- **Google Apps Script** - Backend API
- **Google Sheets** - Database
- **CSS3** - Modern Dark Theme

## การปรับแต่ง

### เปลี่ยนสีธีม
แก้ไขตัวแปร CSS ในไฟล์ `src/index.css`:
```css
/* เปลี่ยนสี Gradient หลัก */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### เพิ่มฟิลด์ข้อมูล
1. เพิ่มฟิลด์ใน state `formData` ในไฟล์ `src/App.js`
2. เพิ่ม input element ในฟอร์ม
3. อัพเดตฟังก์ชัน validation หากจำเป็น
4. เพิ่มคอลัมน์ใน Google Sheet

## การ Deploy

### Deploy บน Netlify
1. Build โปรเจกต์: `npm run build`
2. Upload โฟลเดอร์ `build` ไป Netlify
3. ตั้งค่า Custom Domain หากต้องการ

### Deploy บน Vercel
1. Push โค้ดไป GitHub
2. เชื่อมต่อ Repository กับ Vercel
3. Deploy อัตโนมัติ

## การแก้ปัญหา

### ข้อมูลไม่ถูกส่งไป Google Sheets
- ตรวจสอบ URL ของ Google Apps Script
- ตรวจสอบสิทธิ์การเข้าถึง Web App
- ตรวจสอบ Sheet ID ใน Google Apps Script

### ปัญหา CORS
- ตรวจสอบการตั้งค่า Google Apps Script Web App
- ตั้งค่า "Who has access" เป็น "Anyone"

## License

MIT License