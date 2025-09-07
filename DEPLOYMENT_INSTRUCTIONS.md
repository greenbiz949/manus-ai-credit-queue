# 🚀 การติดตั้งและใช้งาน คิวรับเครดิต Manus AI

## ✅ ขั้นตอนการติดตั้ง

### 1. อัพเดต Google Apps Script

1. เปิด [Google Apps Script](https://script.google.com)
2. เปิดโปรเจกต์เดิมของคุณ
3. **ลบโค้ดเก่าทั้งหมด** ในไฟล์ Code.gs
4. **คัดลอกโค้ดใหม่** จากไฟล์ `FINAL_SCRIPT.js`
5. วางโค้ดใหม่ลงในไฟล์ Code.gs
6. กด **Save** (Ctrl+S)

### 2. ตรวจสอบการตั้งค่า

1. ตรวจสอบว่า **SHEET_ID** ในโค้ดตรงกับ Google Sheet ของคุณหรือไม่
   ```javascript
   const SHEET_ID = '1jf4mkCcu5m_1YA5MJHYUfb5NbMCQC7bWn6CgdcQQ7ZA';
   ```

2. ถ้าต้องการเปลี่ยน ID ของ Sheet ให้แก้ไขบรรทัดนี้

### 3. Deploy เป็น Web App

1. คลิก **Deploy** (ปุ่มสีน้ำเงิน)
2. เลือก **New deployment**
3. ตั้งค่าดังนี้:
   - **Type**: Web app
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. คลิก **Deploy**
5. **อนุญาต permissions** ตามที่ระบบขอ
6. **คัดลอก Web app URL** ที่ได้

### 4. อัพเดท React App

1. เปิดไฟล์ `src/App.js`
2. หาบรรทัดที่มี `scriptURL`
3. แทนที่ URL เก่าด้วย URL ใหม่ที่ได้จากขั้นตอนที่ 3

```javascript
const scriptURL = 'URL_ใหม่ที่ได้จาก_DEPLOY';
```

## 🧪 การทดสอบ

### ทดสอบใน React App
1. เปิดเว็บไซต์ (npm start)
2. กรอกข้อมูลทดสอบ
3. แนบไฟล์ภาพ (JPEG, PNG)
4. กดส่งข้อมูล
5. เช็คใน Browser Console (F12) ดูข้อความ debug

### ทดสอบใน Google Apps Script
1. ในหน้า Apps Script เลือก function `testDoPost`
2. กดปุ่ม **Run**
3. ดู execution log ใน **Execution transcript**

## 🔍 การแก้ไขปัญหา

### ถ้าไฟล์ยังไม่อัพโหลด:

1. **ตรวจสอบ Console Log**:
   - เปิด Browser Developer Tools (F12)
   - ไปที่ Console tab
   - ส่งฟอร์มและดู error messages

2. **ตรวจสอบ Google Apps Script Log**:
   - ในหน้า Apps Script ไปที่ **Executions**
   - ดู execution ล่าสุด
   - เช็คว่ามี error อะไรไหม

3. **ตรวจสอบ Permissions**:
   - ตรวจสอบว่า Script มี permission เข้า Google Drive
   - ลองรัน function `testDoPost` ใน Apps Script

### ข้อความ Error ที่อาจเจอ:

- `"Base64 data too short"` = ไฟล์ไม่ถูกแปลงเป็น Base64 ถูกต้อง
- `"Decoded data is empty"` = Base64 decode ล้มเหลว
- `"Permission denied"` = Script ไม่มีสิทธิ์เข้า Drive

## 📋 ข้อมูล Debug ที่มีประโยชน์

เมื่อส่งฟอร์ม ระบบจะแสดงข้อมูล debug ใน Console:

```
File converted: example.jpg Size: 12345
File type: image/jpeg
Sending data to Google Apps Script:
- fileName: example.jpg
- fileBase64 length: 12345
```

ใน Google Apps Script จะมี log:
```
=== FILE UPLOAD CHECK ===
fileBase64 exists: true
fileBase64 length: 12345
=== PROCESSING FILE UPLOAD ===
File MIME type: image/jpeg
=== FILE UPLOADED SUCCESSFULLY ===
```

## ✨ คุณสมบัติใหม่

1. **Improved Error Handling**: แสดง error message ที่ละเอียดมากขึ้น
2. **Better File Validation**: ตรวจสอบไฟล์ก่อนอัพโหลด
3. **Comprehensive Logging**: log ทุกขั้นตอนเพื่อ debug ง่าย
4. **MIME Type Detection**: รองรับไฟล์หลายประเภท (JPEG, PNG, GIF, WebP, BMP)
5. **Response Validation**: ตรวจสอบ response จาก Google Apps Script

## 🎯 หมายเหตุสำคัญ

- ใช้ไฟล์ `FINAL_SCRIPT.js` เป็น version ล่าสุด
- `DEBUG_SCRIPT.js` มี logging เยอะมาก เหมาะสำหรับ debug
- ทดสอบด้วยไฟล์เล็กๆ ก่อน (< 1MB)
- Google Drive มีข้อจำกัดเรื่อง file size และ quota

---
**หากยังมีปัญหา ให้ส่ง Console Log และ Google Apps Script Execution Log มาด้วย**