// Google Apps Script Code - เวอร์ชั่นอัพเดตสำหรับรับไฟล์
// Deploy this as a web app with execute permissions set to "Anyone"

function doPost(e) {
  try {
    // Replace with your Google Sheet ID
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
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
    
    // Handle file upload
    let slipUrl = 'ไม่มีไฟล์แนบ';
    
    // Check if there's file data in the request
    if (e.postData && e.postData.type && e.postData.type.includes('multipart/form-data')) {
      try {
        // Create folder for slips if not exists
        const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
        
        // Parse the multipart data
        const boundary = '--' + e.postData.type.split('boundary=')[1];
        const parts = e.postData.contents.split(boundary);
        
        // Find the file part
        for (let part of parts) {
          if (part.includes('filename=') && part.includes('Content-Type:')) {
            // Extract filename
            const filenameMatch = part.match(/filename="([^"]+)"/);
            if (filenameMatch) {
              const originalFilename = filenameMatch[1];
              
              // Extract file content
              const contentStart = part.indexOf('\r\n\r\n') + 4;
              const contentEnd = part.lastIndexOf('\r\n');
              const fileContent = part.substring(contentStart, contentEnd);
              
              // Create unique filename
              const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
              const filename = `slip_${timestamp}_${originalFilename}`;
              
              // Create blob and upload to Drive
              const blob = Utilities.newBlob(fileContent, 'image/jpeg', filename);
              const file = folder.createFile(blob);
              file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
              
              slipUrl = file.getUrl();
              break;
            }
          }
        }
      } catch (fileError) {
        console.error('File upload error:', fileError);
        slipUrl = 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์';
      }
    }
    
    // Get form data
    const formData = e.parameter;
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
        message: 'ข้อมูลและไฟล์ถูกบันทึกเรียบร้อยแล้ว',
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
      fullName: 'ทดสอบ ระบบ',
      facebookLink: 'https://facebook.com/test',
      manusAiRefLink: 'https://manus.ai/ref/test123'
    }
  };
  
  const result = doPost(testEvent);
  console.log(result.getContent());
}