# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm start` - Run development server on http://localhost:3000
- `npm run build` - Build production-ready app to `/build` directory
- `npm test` - Run tests (React test suite)

### Deployment
- Production builds are deployed to Vercel
- Deployment configuration is in `vercel.json`

## Architecture

This is a React-based customer data collection app that integrates with Google Sheets for data storage and Google Drive for file uploads.

### Key Components

1. **Frontend (React SPA)**
   - Main component: `src/App.js` - Form for collecting customer data with Facebook link, Manus AI referral link, and payment slip upload
   - Handles file conversion to Base64 for transmission
   - Dark theme UI with responsive design

2. **Backend (Google Apps Script)**
   - Deploy script from `google-apps-script.js` as a Web App
   - Handles form submissions via POST requests
   - Stores data in Google Sheets with columns: Date/Time, Name, Facebook Link, Manus AI Ref Link, Slip Link
   - Uploads payment slips to Google Drive folder "ManusAI_Slips"

3. **Integration Points**
   - Google Apps Script URL needs to be configured in `src/App.js` line 64
   - Google Sheet ID needs to be configured in deployed Apps Script
   - Communication via URL-encoded form data with Base64 file encoding

### Data Flow
1. User fills form with Facebook link, Manus AI referral link, and payment slip
2. Form validates required fields
3. File is converted to Base64 on client side
4. Data is sent as URL-encoded form to Google Apps Script endpoint
5. Script saves data to Google Sheets and uploads file to Google Drive
6. Success/error response is shown to user

## Configuration Requirements

Before the app can function:
1. Create a Google Sheet and note its ID
2. Deploy `google-apps-script.js` as Web App with "Anyone" access
3. Update script URL in `src/App.js` (line 64)
4. Update Sheet ID in deployed Google Apps Script