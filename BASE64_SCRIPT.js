// Google Apps Script Code - รับไฟล์แบบ Base64
// Deploy this as a web app with execute permissions set to "Anyone"

function doPost(e) {
  try {
    // Replace with your Google Sheet ID
    const SHEET_ID = '1jf4mkCcu5m_1YA5MJHYUfb5NbMCQC7bWn6CgdcQQ7ZA';
    const SHEET_NAME = 'ManusAI_Queue';
    const DRIVE_FOLDER_NAME = 'ManusAI_Slips';
    
    // Get the spreadsheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);
      // Add headers
      newSheet.getRange(1, 1, 1, 5).setValues([[
        'วันที่/เวลา', 'ชื่อ-นามสกุล', 'Link Facebook ของคุณ', 'Link Ref. Manus AI', 'ลิงก์สลิปโอนเงิน'
      ]]);
      newSheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      newSheet.getRange(1, 1, 1, 5).setBackground('#4285f4');
      newSheet.getRange(1, 1, 1, 5).setFontColor('white');
    }
    
    const activeSheet = sheet || SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Get form data
    const formData = e.parameter;
    
    // Handle file upload from Base64
    let slipUrl = 'ไม่มีไฟล์แนบ';
    
    if (formData.fileBase64 && formData.fileName) {
      try {
        // Create folder for slips if not exists
        const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
        
        // Convert Base64 to blob
        const base64Data = formData.fileBase64;
        const fileName = formData.fileName;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const uniqueFileName = `slip_${timestamp}_${fileName}`;
        
        // Create blob from base64
        const blob = Utilities.newBlob(
          Utilities.base64Decode(base64Data), 
          'image/jpeg', 
          uniqueFileName
        );
        
        // Upload to Drive
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        slipUrl = file.getUrl();
        
      } catch (fileError) {
        console.error('File upload error:', fileError);
        slipUrl = 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์: ' + fileError.toString();
      }
    }
    
    // Get timestamp
    const timestamp = new Date().toLocaleString('th-TH', { 
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Prepare data row
    const rowData = [
      timestamp,
      formData.fullName || '',
      formData.facebookLink || '',
      formData.manusAiRefLink || '',
      slipUrl
    ];
    
    // Add data to sheet
    activeSheet.appendRow(rowData);
    
    // Auto-resize columns
    activeSheet.autoResizeColumns(1, 5);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        fileUploaded: slipUrl !== 'ไม่มีไฟล์แนบ'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        message: 'เกิดข้อผิดพลาด: ' + error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper function to get or create folder
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// Test function
function testDoPost() {
  const testEvent = {
    parameter: {
      fullName: 'ทดสอบ Base64',
      facebookLink: 'https://facebook.com/test',
      manusAiRefLink: 'https://manus.ai/ref/test123',
      fileBase64: '',
      fileName: ''
    }
  };
  
  const result = doPost(testEvent);
  console.log(result.getContent());
}