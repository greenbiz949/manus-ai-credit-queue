import React, { useState } from 'react';
import { Send, User, Facebook, Link, MessageCircle, Upload, HelpCircle } from 'lucide-react';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    facebookLink: '',
    manusAiRefLink: '',
    slip: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showHelpModal, setShowHelpModal] = useState(false);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        console.log('Base64 conversion successful, length:', base64Data.length);
        resolve(base64Data);
      };
      reader.onerror = error => {
        console.error('Base64 conversion failed:', error);
        reject(error);
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setMessage({ text: 'กรุณากรอกชื่อ-นามสกุล', type: 'error' });
      return false;
    }
    if (!formData.facebookLink.trim()) {
      setMessage({ text: 'กรุณากรอก Link Facebook ของคุณ', type: 'error' });
      return false;
    }
    if (!formData.manusAiRefLink.trim()) {
      setMessage({ text: 'กรุณากรอกลิงก์ Ref. Manus AI', type: 'error' });
      return false;
    }
    if (!formData.slip) {
      setMessage({ text: 'กรุณาแนบสลิปโอนเงิน', type: 'error' });
      return false;
    }
    return true;
  };

  const submitToGoogleSheets = async (data) => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz8ROsUNqwKNP7b76J2SjCCY9eLuQSYr0lNmbSyL-lStq_S0g_ycFF_l10Or5DtSDgL8w/exec';
    
    // Convert file to Base64 if exists
    let fileBase64 = '';
    let fileName = '';
    
    if (data.slip) {
      try {
        const fileBase64Result = await convertFileToBase64(data.slip);
        fileBase64 = fileBase64Result;
        fileName = data.slip.name;
        console.log('File converted:', fileName, 'Size:', fileBase64.length);
        console.log('File type:', data.slip.type);
        console.log('First 50 chars of base64:', fileBase64.substring(0, 50));
      } catch (error) {
        console.error('File conversion error:', error);
        return;
      }
    } else {
      console.log('No file selected for upload');
    }
    
    // Send as URL encoded form data
    const formDataToSend = new URLSearchParams();
    formDataToSend.append('fullName', data.fullName);
    formDataToSend.append('facebookLink', data.facebookLink);
    formDataToSend.append('manusAiRefLink', data.manusAiRefLink);
    formDataToSend.append('fileBase64', fileBase64);
    formDataToSend.append('fileName', fileName);

    console.log('Sending data to Google Apps Script:');
    console.log('- fullName:', data.fullName);
    console.log('- facebookLink:', data.facebookLink);
    console.log('- manusAiRefLink:', data.manusAiRefLink);
    console.log('- fileName:', fileName);
    console.log('- fileBase64 length:', fileBase64.length);

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formDataToSend.toString()
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log('Response from Google Apps Script:', responseText);
        try {
          const responseData = JSON.parse(responseText);
          console.log('Parsed response:', responseData);
          return responseData;
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          return { success: true };
        }
      } else {
        const errorText = await response.text();
        console.error('HTTP Error response:', errorText);
        throw new Error('การส่งข้อมูลล้มเหลว: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await submitToGoogleSheets(formData);
      setMessage({ text: 'บันทึกข้อมูลเรียบร้อยแล้ว! ขอบคุณค่ะ', type: 'success' });
      
      setFormData({
        fullName: '',
        facebookLink: '',
        manusAiRefLink: '',
        slip: null
      });
    } catch (error) {
      setMessage({ text: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="main-container">
        <div className="form-container">
          <div className="header">
            <h1>คิวรับเครดิต Manus AI</h1>
            <p>กรุณากรอกข้อมูลและแนบสลิปเพื่อจองคิว</p>
          </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              <User size={16} style={{ display: 'inline', marginRight: '5px' }} />
              ชื่อ-นามสกุล *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="กรอกชื่อ-นามสกุลของท่าน"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="facebookLink" className="form-label">
              <Facebook size={16} style={{ display: 'inline', marginRight: '5px' }} />
              Link Facebook ของคุณ *
            </label>
            <input
              type="url"
              id="facebookLink"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleChange}
              className="form-input"
              placeholder="https://facebook.com/your-profile"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="manusAiRefLink" className="form-label">
              <Link size={16} style={{ display: 'inline', marginRight: '5px' }} />
              Link Ref. Manus AI *
              <button
                type="button"
                className="help-button"
                onClick={() => setShowHelpModal(true)}
                title="วิธีหา Link Ref. Manus AI"
              >
                <HelpCircle size={16} />
              </button>
              <small className="help-hint">เอาจากตรงไหน</small>
            </label>
            <input
              type="url"
              id="manusAiRefLink"
              name="manusAiRefLink"
              value={formData.manusAiRefLink}
              onChange={handleChange}
              className="form-input"
              placeholder="https://manus.ai/ref/your-ref-code"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slip" className="form-label">
              <Upload size={16} style={{ display: 'inline', marginRight: '5px' }} />
              แนบสลิปสำหรับจองคิว *
            </label>
            <input
              type="file"
              id="slip"
              name="slip"
              onChange={handleChange}
              className="form-input file-input"
              accept="image/*"
              required
            />
            {formData.slip && (
              <div className="file-preview">
                <span>📎 {formData.slip.name}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading">
                <span className="spinner"></span>
                กำลังส่งข้อมูล...
              </span>
            ) : (
              <>
                <Send size={20} style={{ marginRight: '8px' }} />
                ส่งข้อมูล
              </>
            )}
          </button>

          {message.text && (
            <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
              {message.text}
            </div>
          )}

          <div className="button-group">
            <button
              type="button"
              className="line-button"
              onClick={() => window.open('https://line.me/ti/p/@beerfreedom', '_blank')}
            >
              <MessageCircle size={20} style={{ marginRight: '8px' }} />
              อยากได้ด่วน แอดไลน์ @beerfreedom
            </button>
          </div>
        </form>
        </div>
        
        <div className="info-container">
          <div className="pricing-card">
            <div className="price-highlight">
              <span className="price">1,900 บาท</span>
              <span className="credits">ผมเติมให้ 50,000 เครดิตไปแบบจุกๆ</span>
            </div>
            
            <div className="comparison">
              <p>📊 <strong>มูลค่าเติมเอง:</strong> เกือบสามหมื่นบาท</p>
              <p>💡 <strong>เอาประหยัดสุดๆ:</strong> ใช้เหลือๆ</p>
            </div>
            
            <div className="guarantee">
              <p>✅ <strong>เช็คแล้ว:</strong></p>
              <p>น่าจะถูกที่สุดในโลก!</p>
            </div>

            <div className="payment-info">
              <div className="bank-details">
                <p><strong>🏦 กสิกรไทย | 📱 พร้อมเพย์:</strong> 0809898949</p>
                <p><strong>👤 ดนัยชนก อิ่มชุ่ม | 💵</strong> 1,900 บาท</p>
              </div>
              
              <div className="qr-code-section">
                <div className="qr-code-container">
                  <img src="/qr-payment.png" alt="QR Code Payment" className="qr-code-image" />
                </div>
              </div>
            </div>
            
            <div className="features">
              <h3>🎯 ได้อะไร?</h3>
              <ul>
                <li>50,000 เครดิต Manus AI</li>
                <li>ใช้งานได้เต็มประสิทธิภาพ</li>
                <li>ประหยัดกว่าเติมเอง 20 เท่า!</li>
                <li>รับประกันคุณภาพ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Help Modal */}
        {showHelpModal && (
          <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🔗 วิธีหา Link Ref. Manus AI</h3>
                <button className="modal-close" onClick={() => setShowHelpModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="help-image-container">
                  <img src="/manus-ref-help.png" alt="วิธีหา Link Ref Manus AI" className="help-image" />
                </div>
                
                <div className="help-instructions">
                  <h4>🔗 วิธีหา Link Referral ของคุณ:</h4>
                  
                  <div className="step-box">
                    <h5>📍 เอาจากตรงไหน:</h5>
                    <ul>
                      <li><strong>ในแอป Manus AI:</strong> เมนู "Referral" หรือ "แนะนำเพื่อน"</li>
                      <li><strong>ในเว็บไซต์:</strong> หน้า Profile → Referral Program</li>
                      <li><strong>หรือ:</strong> Settings → My Referral Link</li>
                    </ul>
                  </div>

                  <div className="step-box">
                    <h5>📋 ขั้นตอนการทำ:</h5>
                    <ol>
                      <li>เปิดแอป Manus AI หรือเข้าเว็บไซต์</li>
                      <li>Login เข้าสู่ระบบของคุณ</li>
                      <li>หาเมนู "Referral" หรือ "แนะนำเพื่อน"</li>
                      <li>คัดลอก Link Referral ของคุณ</li>
                      <li>นำมาวางในช่องด้านล่าง</li>
                    </ol>
                  </div>

                  <div className="tip-box">
                    <p>💡 <strong>เคล็ดลับ:</strong> Link ปกติจะขึ้นต้นด้วย https://manus.ai/ref/[รหัสของคุณ]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;