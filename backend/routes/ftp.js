import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Client } from 'basic-ftp';
import { authMiddleware } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const userDir = path.join(uploadDir, req.user.username);
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    cb(null, true);
  }
});

// FTP connection helper
async function connectFTP() {
  const client = new Client();
  client.ftp.verbose = process.env.NODE_ENV === 'development';
  
  try {
    await client.access({
      host: process.env.FTP_HOST,
      port: parseInt(process.env.FTP_PORT) || 21,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false
    });
    return client;
  } catch (error) {
    logger.error('FTP connection error:', error);
    throw new Error('Failed to connect to FTP server');
  }
}

// Upload file endpoint
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user.username,
      uploadedAt: new Date()
    };

    // Try to upload to FTP server
    try {
      const client = await connectFTP();
      
      // Create user directory on FTP server
      const ftpUserDir = `/${req.user.username}`;
      try {
        await client.ensureDir(ftpUserDir);
      } catch (err) {
        // Directory might already exist
      }
      
      await client.uploadFrom(req.file.path, `${ftpUserDir}/${req.file.filename}`);
      await client.close();
      
      fileInfo.ftpPath = `${ftpUserDir}/${req.file.filename}`;
      logger.info(`File uploaded to FTP: ${fileInfo.ftpPath}`);
    } catch (ftpError) {
      logger.error('FTP upload error:', ftpError);
      // Continue even if FTP upload fails - file is still stored locally
      fileInfo.ftpError = 'Failed to upload to FTP server';
    }

    logger.info(`File uploaded: ${req.file.filename} by ${req.user.username}`);

    res.json({ 
      success: true, 
      file: fileInfo 
    });
  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'File upload failed' 
    });
  }
});

// List files endpoint
router.get('/files', authMiddleware, async (req, res) => {
  try {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const userDir = path.join(uploadDir, req.user.username);

    if (!fs.existsSync(userDir)) {
      return res.json({ 
        success: true, 
        files: [] 
      });
    }

    const files = fs.readdirSync(userDir).map(filename => {
      const filePath = path.join(userDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    });

    res.json({ 
      success: true, 
      files 
    });
  } catch (error) {
    logger.error('List files error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list files' 
    });
  }
});

// Download file endpoint
router.get('/download/:filename', authMiddleware, (req, res) => {
  try {
    const { filename } = req.params;
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const filePath = path.join(uploadDir, req.user.username, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    logger.info(`File download: ${filename} by ${req.user.username}`);
    
    res.download(filePath);
  } catch (error) {
    logger.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'File download failed' 
    });
  }
});

// Delete file endpoint
router.delete('/files/:filename', authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const filePath = path.join(uploadDir, req.user.username, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    // Delete local file
    fs.unlinkSync(filePath);

    // Try to delete from FTP server
    try {
      const client = await connectFTP();
      const ftpPath = `/${req.user.username}/${filename}`;
      await client.remove(ftpPath);
      await client.close();
      logger.info(`File deleted from FTP: ${ftpPath}`);
    } catch (ftpError) {
      logger.error('FTP delete error:', ftpError);
    }

    logger.info(`File deleted: ${filename} by ${req.user.username}`);

    res.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    logger.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'File deletion failed' 
    });
  }
});

// FTP connection test endpoint
router.get('/test-connection', authMiddleware, async (req, res) => {
  try {
    const client = await connectFTP();
    const list = await client.list();
    await client.close();
    
    res.json({ 
      success: true, 
      message: 'FTP connection successful',
      files: list.length
    });
  } catch (error) {
    logger.error('FTP test connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
