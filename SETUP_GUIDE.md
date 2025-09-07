# 📋 คู่มือตั้งค่าระบบคิวรับเครดิต Manus AI

## 🚀 ขั้นตอนการตั้งค่าครบครัน

### 1. 📊 สร้าง Google Sheets
1. ไปที่ [Google Sheets](https://sheets.google.com)
2. คลิก **+ ว่างเปล่า** เพื่อสร้างชีตใหม่
3. ตั้งชื่อ: **"ManusAI Queue System"**
4. คัดลอก **Sheet ID** จาก URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit#gid=0
   ```

### 2. 🛠️ ตั้งค่า Google Apps Script
1. ในชีต คลิก **Extensions → Apps Script**
2. ลบโค้ดเดิมทั้งหมด
3. คัดลอกโค้ดจาก `google-apps-script.js` และวางแทนที่
4. **แก้ไขบรรทัดที่ 7**: 
   ```javascript
   const SHEET_ID = 'ใส่ SHEET_ID ของคุณที่นี่';
   ```

### 3. 🌐 Deploy Web App
1. คลิก **Deploy → New deployment**
2. เลือก Type: **Web app**
3. ตั้งค่า:
   - **Execute as**: Me (email ของคุณ)
   - **Who has access**: Anyone
4. คลิก **Deploy**
5. **คัดลอก URL** ที่ได้ (จะใช้ในขั้นตอนต่อไป)

### 4. 🔧 อัพเดต React App
1. เปิดไฟล์ `src/App.js` 
2. ไปที่บรรทัดที่ 42:
   ```javascript
   const scriptURL = 'ใส่ URL จาก Google Apps Script ที่นี่';
   ```
3. แทนที่ `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` ด้วย URL จริง

### 5. 📱 เพิ่ม QR Code สำหรับโอนเงิน
**วิธีเพิ่ม QR Code:**

#### วิธีที่ 1: ใส่ในโฟลเดอร์ public
1. บันทึกรูป QR Code เป็น `qr-payment.png`
2. วางไฟล์ใน `public/qr-payment.png`
3. อัพเดตโค้ดใน `src/App.js`:
   ```javascript
   <div className="qr-code-section">
     <h4>📱 QR Code สำหรับโอนเงิน</h4>
     <img src="/qr-payment.png" alt="QR Code" style={{maxWidth: '200px'}} />
   </div>
   ```

#### วิธีที่ 2: ใช้ Base64
1. แปลงรูป QR Code เป็น Base64
2. แทนที่ใน component

#### วิธีที่ 3: Upload ไป Cloud
1. Upload ไป Google Drive/Imgur
2. ใช้ URL โดยตรง

### 6. ✅ ทดสอบระบบ
1. รันแอป: `npm start`
2. กรอกข้อมูลทดสอบ
3. แนบไฟล์สลิป
4. ตรวจสอบ Google Sheets ว่าข้อมูลเข้าหรือไม่
5. ตรวจสอบ Google Drive ว่ามีโฟลเดอร์ `ManusAI_Slips` และมีไฟล์หรือไม่

## 📋 โครงสร้างข้อมูลใน Google Sheets

| วันที่/เวลา | ชื่อ-นามสกุล | Link Facebook ของคุณ | Link Ref. Manus AI | ลิงก์สลิปโอนเงิน |
|-------------|-------------|---------------------|-------------------|------------------|
| 06/09/2567 14:30:25 | สมชาย ใจดี | https://facebook.com/... | https://manus.ai/... | https://drive.google.com/... |

## 💳 ข้อมูลการโอนเงิน
- **ธนาคาร**: กสิกรไทย
- **พร้อมเพย์**: 0809898949
- **ชื่อบัญชี**: ดนัยชนก อิ่มชุ่ม
- **จำนวนเงิน**: 1,500 บาท

## 🔍 การแก้ปัญหา

### ปัญหาการอัพโหลดไฟล์
- ตรวจสอบ CORS settings ใน Google Apps Script
- ตรวจสอบสิทธิ์การเข้าถึง Drive

### ปัญหาการเชื่อมต่อ
- ตรวจสอบ URL ของ Web App
- ตรวจสอบการ Deploy ใหม่

### ปัญหาข้อมูลไม่เข้า
- ตรวจสอบ Sheet ID
- ตรวจสอบชื่อ Sheet ว่าตรงกันหรือไม่

## 📞 ติดต่อสอบถาม
**LINE**: @beerfreedom
**เฟซบุ๊ก**: แจ้งตามที่กำหนด

---
*💡 หมายเหตุ: ระบบจะสร้างโฟลเดอร์ `ManusAI_Slips` ใน Google Drive อัตโนมัติ และเก็บไฟล์สลิปที่อัพโหลดไว้ที่นั่น*