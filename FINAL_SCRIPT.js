// Google Apps Script Code - Final Optimized Version
// Deploy this as a web app with execute permissions set to "Anyone"

function doPost(e) {
  try {
    // Replace with your Google Sheet ID
    const SHEET_ID = '1jf4mkCcu5m_1YA5MJHYUfb5NbMCQC7bWn6CgdcQQ7ZA';
    const SHEET_NAME = 'ManusAI_Queue';
    const DRIVE_FOLDER_NAME = 'ManusAI_Slips';
    
    console.log('=== NEW REQUEST ===');
    console.log('Received parameters:', Object.keys(e.parameter));
    
    // Get the spreadsheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      console.log('Creating new sheet:', SHEET_NAME);
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
    
    console.log('=== FILE UPLOAD CHECK ===');
    console.log('fileBase64 exists:', !!formData.fileBase64);
    console.log('fileBase64 length:', formData.fileBase64 ? formData.fileBase64.length : 'N/A');
    console.log('fileName exists:', !!formData.fileName);
    console.log('fileName value:', formData.fileName || 'N/A');
    
    if (formData.fileBase64 && formData.fileBase64.length > 0 && formData.fileName) {
      try {
        console.log('=== PROCESSING FILE UPLOAD ===');
        
        // Validate Base64 data
        const base64Data = formData.fileBase64.trim();
        if (base64Data.length < 100) {
          throw new Error('Base64 data too short, likely corrupted');
        }
        
        // Create folder for slips if not exists
        console.log('Getting or creating folder:', DRIVE_FOLDER_NAME);
        const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
        
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
        } else if (lowerFileName.includes('.bmp')) {
          mimeType = 'image/bmp';
        }
        
        console.log('File MIME type:', mimeType);
        
        // Create blob from base64
        console.log('Decoding base64 data...');
        const decodedData = Utilities.base64Decode(base64Data);
        console.log('Base64 decoded successfully, byte length:', decodedData.length);
        
        if (decodedData.length === 0) {
          throw new Error('Decoded data is empty');
        }
        
        const blob = Utilities.newBlob(decodedData, mimeType, uniqueFileName);
        console.log('Blob created successfully');
        
        // Upload to Drive
        console.log('Uploading to Google Drive...');
        const file = folder.createFile(blob);
        console.log('File created in Drive, ID:', file.getId());
        
        // Set sharing permissions
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        slipUrl = file.getUrl();
        console.log('=== FILE UPLOADED SUCCESSFULLY ===');
        console.log('File URL:', slipUrl);
        
      } catch (fileError) {
        console.error('=== FILE UPLOAD ERROR ===');
        console.error('Error details:', fileError.toString());
        console.error('Stack trace:', fileError.stack);
        slipUrl = 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์: ' + fileError.toString();
      }
    } else {
      console.log('=== NO FILE DATA ===');
      console.log('Skipping file upload - no valid file data received');
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
    
    console.log('=== ADDING DATA TO SHEET ===');
    console.log('Row data:', rowData);
    
    // Add data to sheet
    activeSheet.appendRow(rowData);
    
    // Auto-resize columns
    activeSheet.autoResizeColumns(1, 5);
    
    // Return success response
    const response = {
      success: true,
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      fileUploaded: slipUrl !== 'ไม่มีไฟล์แนบ' && !slipUrl.includes('เกิดข้อผิดพลาด'),
      fileUrl: slipUrl,
      debug: {
        hasFile: !!formData.fileBase64,
        fileName: formData.fileName,
        fileSize: formData.fileBase64 ? formData.fileBase64.length : 0,
        timestamp: timestamp
      }
    };
    
    console.log('=== RESPONSE ===');
    console.log('Response:', response);
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('=== MAIN ERROR ===');
    console.error('Error:', error.toString());
    console.error('Stack trace:', error.stack);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        message: 'เกิดข้อผิดพลาด: ' + error.toString(),
        error: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper function to get or create folder
function getOrCreateFolder(folderName) {
  try {
    const folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      console.log('Found existing folder:', folderName);
      return folders.next();
    } else {
      console.log('Creating new folder:', folderName);
      return DriveApp.createFolder(folderName);
    }
  } catch (error) {
    console.error('Error with folder operation:', error);
    throw error;
  }
}

// Test function
function testDoPost() {
  const testEvent = {
    parameter: {
      fullName: 'ทดสอบ Final Script',
      facebookLink: 'https://facebook.com/test',
      manusAiRefLink: 'https://manus.ai/ref/test123',
      fileBase64: '/9j/4AAQSkZJRgABAQEAYABgAAD', // Sample base64 (just header)
      fileName: 'test.jpg'
    }
  };
  
  const result = doPost(testEvent);
  console.log('Test result:', result.getContent());
}