// Google Apps Script Code - Debug Version
// Deploy this as a web app with execute permissions set to "Anyone"

function doPost(e) {
  try {
    // Replace with your Google Sheet ID
    const SHEET_ID = '1jf4mkCcu5m_1YA5MJHYUfb5NbMCQC7bWn6CgdcQQ7ZA';
    const SHEET_NAME = 'ManusAI_Queue';
    const DRIVE_FOLDER_NAME = 'ManusAI_Slips';
    
    // Debug: Log received data
    console.log('Received parameters:', e.parameter);
    console.log('Has fileBase64:', !!e.parameter.fileBase64);
    console.log('fileName:', e.parameter.fileName);
    
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
    
    console.log('Checking file data...');
    console.log('fileBase64 exists:', !!formData.fileBase64);
    console.log('fileBase64 length:', formData.fileBase64 ? formData.fileBase64.length : 'N/A');
    console.log('fileName exists:', !!formData.fileName);
    console.log('fileName value:', formData.fileName || 'N/A');
    
    if (formData.fileBase64 && formData.fileBase64.length > 0 && formData.fileName) {
      try {
        console.log('Processing file upload...');
        
        // Create folder for slips if not exists
        const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
        
        // Convert Base64 to blob
        const base64Data = formData.fileBase64;
        const fileName = formData.fileName;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const uniqueFileName = `slip_${timestamp}_${fileName}`;
        
        console.log('Creating file:', uniqueFileName);
        
        // Determine MIME type based on file extension
        let mimeType = 'image/jpeg';
        const lowerFileName = fileName.toLowerCase();
        if (lowerFileName.includes('.png')) {
          mimeType = 'image/png';
        } else if (lowerFileName.includes('.gif')) {
          mimeType = 'image/gif';
        } else if (lowerFileName.includes('.webp')) {
          mimeType = 'image/webp';
        }
        
        console.log('File MIME type:', mimeType);
        
        // Create blob from base64
        console.log('Decoding base64 data...');
        const decodedData = Utilities.base64Decode(base64Data);
        console.log('Base64 decoded successfully, byte length:', decodedData.length);
        
        const blob = Utilities.newBlob(decodedData, mimeType, uniqueFileName);
        console.log('Blob created successfully');
        
        // Upload to Drive
        console.log('Uploading to Google Drive...');
        const file = folder.createFile(blob);
        console.log('File created in Drive, setting permissions...');
        
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        slipUrl = file.getUrl();
        console.log('File uploaded successfully:', slipUrl);
        
      } catch (fileError) {
        console.error('File upload error:', fileError);
        slipUrl = 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์: ' + fileError.toString();
      }
    } else {
      console.log('No file data received');
      console.log('fileBase64 length:', formData.fileBase64 ? formData.fileBase64.length : 'undefined');
      console.log('fileName:', formData.fileName || 'undefined');
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
    
    console.log('Adding row data:', rowData);
    
    // Add data to sheet
    activeSheet.appendRow(rowData);
    
    // Auto-resize columns
    activeSheet.autoResizeColumns(1, 5);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        fileUploaded: slipUrl !== 'ไม่มีไฟล์แนบ',
        debug: {
          hasFile: !!formData.fileBase64,
          fileName: formData.fileName,
          fileSize: formData.fileBase64 ? formData.fileBase64.length : 0
        }
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
      fullName: 'ทดสอบ Debug',
      facebookLink: 'https://facebook.com/test',
      manusAiRefLink: 'https://manus.ai/ref/test123',
      fileBase64: 'dGVzdCBkYXRh', // "test data" in base64
      fileName: 'test.jpg'
    }
  };
  
  const result = doPost(testEvent);
  console.log(result.getContent());
}