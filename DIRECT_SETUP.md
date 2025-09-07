# 🚀 คู่มือสำหรับ greenbiz001@gmail.com

## 📋 ขั้นตอนง่ายๆ (5 นาที)

### 1. สร้าง Google Sheet
1. ไป [sheets.google.com](https://sheets.google.com) ด้วย greenbiz001@gmail.com
2. คลิก **+ ว่าง** สร้างชีตใหม่
3. ตั้งชื่อ: **"ManusAI Queue 2024"**
4. คัดลอก **Sheet ID** จาก URL bar:
   ```
   https://docs.google.com/spreadsheets/d/[คัดลอกส่วนนี้]/edit#gid=0
   ```

### 2. สร้าง Google Apps Script
1. ในชีตที่เพิ่งสร้าง คลิก **Extensions → Apps Script**
2. **ลบโค้ดเก่าทั้งหมด**
3. **คัดลอกโค้ดทั้งหมดจากไฟล์ `google-apps-script.js`** วางลงไป
4. **แก้บรรทัดที่ 7**: 
   ```javascript
   const SHEET_ID = 'วาง Sheet ID ที่คัดลอกมาตรงนี้';
   ```
5. กด **Ctrl+S** บันทึก

### 3. Deploy Web App
1. คลิก **Deploy → New deployment**
2. เลือก type: **Web app** 
3. ตั้งค่า:
   - Execute as: **Me (greenbiz001@gmail.com)**
   - Who has access: **Anyone**
4. คลิก **Deploy**
5. อนุญาต permissions ที่ขึ้นมา
6. **คัดลอก URL** ที่ได้

### 4. เชื่อมกับแอป
1. เปิดไฟล์ `src/App.js` 
2. หาบรรทัดที่ 42 (ประมาณ):
   ```javascript
   const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. แทนที่ด้วย URL ที่คัดลอกมา:
   ```javascript
   const scriptURL = 'https://script.google.com/macros/s/your-script-id/exec';
   ```

### 5. ทดสอบ
1. บันทึกไฟล์ `App.js`
2. ไป http://localhost:3000
3. กรอกข้อมูลทดสอบ แนบไฟล์ส่ง
4. ตรวจสอบ Google Sheet ว่ามีข้อมูลเข้ามาไหม

---

## 📊 หัวตารางที่จะได้

| วันที่/เวลา | ชื่อ-นามสกุล | Link Facebook ของคุณ | Link Ref. Manus AI | ลิงก์สลิปโอนเงิน |
|-------------|-------------|---------------------|-------------------|------------------|

---

## 🆘 ติดปัญหา?

### ❌ ไม่มีข้อมูลเข้า Sheet
- ตรวจสอบ Sheet ID ใน Apps Script
- ตรวจสอบ URL ใน App.js

### ❌ Error "Permission denied"  
- ตั้งค่า "Who has access" เป็น "Anyone"
- Deploy ใหม่

### ❌ CORS Error
- ตรวจสอบการ Deploy Web App
- รอ 1-2 นาทีแล้วลองใหม่

---

## 💡 Tips

- **ใช้เบราว์เซอร์เดียวกัน** สำหรับ Google และการทดสอบ
- **รอสักครู่** หลัง Deploy ก่อนทดสอบ  
- **ตรวจสอบ Console** ถ้ามี error (F12)

---

**หากยังติดปัญหา แจ้งมาได้เลยครับ!** 🚀