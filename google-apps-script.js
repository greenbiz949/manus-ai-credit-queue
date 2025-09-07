// Google Apps Script Code
// Deploy this as a web app with execute permissions set to "Anyone"

function doPost(e) {
  try {
    // Replace with your Google Sheet ID
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
    const SHEET_NAME = 'ManusAI_Queue';
    const DRIVE_FOLDER_NAME = 'ManusAI_Slips'; // Folder to store uploaded slips
    
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
    
    // Handle file upload if present
    let slipUrl = 'ไม่มีไฟล์แนบ';
    
    if (e.postData && e.postData.type === 'multipart/form-data') {
      // Parse multipart form data
      const boundary = e.postData.type.split('boundary=')[1];
      if (boundary) {
        const parts = parseMultipartData(e.postData.contents, boundary);
        
        // Find slip file
        const slipFile = parts.find(part => part.name === 'slip' && part.filename);
        if (slipFile) {
          // Create or get folder for slips
          const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
          
          // Create unique filename
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const fileName = `slip_${timestamp}_${slipFile.filename}`;
          
          // Save file to Drive
          const blob = Utilities.newBlob(slipFile.data, slipFile.type, fileName);
          const file = folder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          slipUrl = file.getUrl();
        }
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
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
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

// Helper function to parse multipart form data
function parseMultipartData(data, boundary) {
  const parts = [];
  const boundaryStr = '--' + boundary;
  const sections = data.split(boundaryStr);
  
  for (let i = 1; i < sections.length - 1; i++) {
    const section = sections[i].trim();
    if (section.length === 0) continue;
    
    const headerEndIndex = section.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) continue;
    
    const headers = section.substring(0, headerEndIndex);
    const content = section.substring(headerEndIndex + 4);
    
    // Parse Content-Disposition header
    const dispositionMatch = headers.match(/Content-Disposition: form-data; name="([^"]+)"(?:; filename="([^"]+)")?/);
    if (dispositionMatch) {
      const part = {
        name: dispositionMatch[1],
        filename: dispositionMatch[2] || null,
        data: content
      };
      
      // Parse Content-Type header
      const typeMatch = headers.match(/Content-Type: (.+)/);
      if (typeMatch) {
        part.type = typeMatch[1].trim();
      }
      
      parts.push(part);
    }
  }
  
  return parts;
}

// Optional: Test function
function testDoPost() {
  const testEvent = {
    parameter: {
      fullName: 'สมชาย ใจดี',
      facebookLink: 'https://facebook.com/somchai.jaidee',
      manusAiRefLink: 'https://manus.ai/ref/somchai123'
    }
  };
  
  const result = doPost(testEvent);
  console.log(result.getContent());
}