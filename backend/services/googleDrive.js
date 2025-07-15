const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    this.init();
  }

  async init() {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials.json',
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      this.drive = google.drive({ version: 'v3', auth });
      console.log('Google Drive service initialized');
    } catch (error) {
      console.error('Error initializing Google Drive:', error);
    }
  }

  async uploadFile(fileBuffer, fileName, mimeType) {
    try {
      if (!this.drive) {
        throw new Error('Google Drive service not initialized');
      }

      const fileMetadata = {
        name: fileName,
        parents: [this.folderId],
      };

      const media = {
        mimeType: mimeType,
        body: fileBuffer,
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,webViewLink',
      });

      return {
        fileId: response.data.id,
        webViewLink: response.data.webViewLink,
        directLink: `https://drive.google.com/uc?id=${response.data.id}`
      };
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw error;
    }
  }

  async uploadBase64Image(base64Data, fileName) {
    try {
      // Remover el prefijo data:image/...;base64, si existe
      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Image, 'base64');
      
      return await this.uploadFile(buffer, fileName, 'image/jpeg');
    } catch (error) {
      console.error('Error uploading base64 image:', error);
      throw error;
    }
  }
}

module.exports = new GoogleDriveService(); 