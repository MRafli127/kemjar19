# FTP & DOS Management System

Modern web application dengan frontend Next.js dan backend Node.js yang mendukung FTP connection, DOS testing, dan anonymous login.

## 🚀 Features

- **Authentication System**
  - Login dengan username & password
  - Anonymous login untuk guest users
  - JWT-based authentication
  - Secure password hashing dengan bcrypt

- **FTP Functionality**
  - Upload file ke FTP server
  - Download file dari server
  - List semua file user
  - Delete file
  - Automatic storage di local dan FTP server

- **DOS Testing**
  - Simulate DOS attacks dengan berbagai intensity
  - Rate limiting protection (100 req/min)
  - Real-time metrics dan monitoring
  - Stress testing capabilities

- **Security**
  - Helmet.js untuk security headers
  - CORS configuration
  - Rate limiting
  - Input validation dengan Joi
  - Error logging dengan Winston

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Docker (optional, untuk deployment)
- FTP server (vsftpd via Docker atau lokal)

## 🛠️ Installation

### Backend Setup

1. Navigate ke backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

4. Start backend server:
```bash
npm run dev
```

Backend akan running di `http://localhost:5000`

### Frontend Setup

1. Navigate ke frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
# Edit .env.local jika perlu
```

4. Start frontend development server:
```bash
npm run dev
```

Frontend akan running di `http://localhost:3001`

## 🐳 Docker Deployment

### Using Docker Compose

1. Pastikan Docker dan Docker Compose terinstall

2. Start semua services:
```bash
docker-compose up -d
```

Services yang akan berjalan:
- Backend API: `http://localhost:5000`
- FTP Server: `ftp://localhost:21`

3. Stop services:
```bash
docker-compose down
```

### Manual Docker Build

Backend:
```bash
cd backend
docker build -t ftp-backend .
docker run -p 5000:5000 ftp-backend
```

## 🌐 Vercel Deployment (Frontend)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy frontend:
```bash
cd frontend
vercel
```

3. Set environment variables di Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

Note: Untuk development lokal, frontend berjalan di port 3001.

## 📝 Default Credentials

- **Admin Account**
  - Username: `admin`
  - Password: `admin123`

- **FTP Server**
  - Username: `ftpuser`
  - Password: `ftppassword`

⚠️ **IMPORTANT**: Ganti credentials default di production!

## 🎯 Usage

### File Upload & Management

1. Login menggunakan credentials atau anonymous
2. Navigate ke "File Management" tab
3. Select file dan click "Upload"
4. File akan tersimpan di local storage dan FTP server
5. Download atau delete file dari list

### DOS Testing

1. Navigate ke "DOS Testing" tab
2. View current metrics (total requests, blocked requests, etc.)
3. Click intensity level untuk run DOS test:
   - **Low**: Ringan, response time ~500ms
   - **Medium**: Sedang, response time ~1000ms
   - **High**: Berat, response time ~2000ms
4. Monitor rate limiting protection

Rate limiter akan block requests yang exceed 100 per minute.

## 📁 Project Structure

```
KemjarFinpro/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js  # Error handling
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints
│   │   ├── ftp.js           # FTP operations
│   │   └── dos.js           # DOS testing
│   ├── utils/
│   │   └── logger.js        # Winston logger
│   ├── server.js            # Main server file
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── pages/
│   │   ├── index.js         # Home/redirect page
│   │   ├── login.js         # Login page
│   │   ├── dashboard.js     # Main dashboard
│   │   ├── _app.js          # App wrapper
│   │   └── _document.js     # Document config
│   ├── context/
│   │   └── AuthContext.js   # Auth state management
│   ├── utils/
│   │   └── api.js           # API client
│   ├── styles/
│   │   └── globals.css      # Global styles
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.local
└── docker-compose.yml
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `POST /api/auth/anonymous` - Anonymous login
- `GET /api/auth/verify` - Verify token

### FTP Operations
- `POST /api/ftp/upload` - Upload file
- `GET /api/ftp/files` - List files
- `GET /api/ftp/download/:filename` - Download file
- `DELETE /api/ftp/files/:filename` - Delete file
- `GET /api/ftp/test-connection` - Test FTP connection

### DOS Testing
- `POST /api/dos/test` - Run DOS test
- `GET /api/dos/status` - Get DOS metrics
- `POST /api/dos/stress-test` - Run stress test
- `POST /api/dos/reset-metrics` - Reset metrics (admin only)

## 🔒 Security Features

- JWT authentication dengan expiration
- Password hashing dengan bcrypt
- Rate limiting untuk DOS protection
- Input validation
- Secure HTTP headers dengan Helmet
- CORS configuration
- Error logging
- File upload size limits

## 🎨 UI/UX Features

- Modern, responsive design dengan Tailwind CSS
- Smooth animations dan transitions
- Toast notifications untuk user feedback
- Loading states
- Professional color scheme
- Mobile-friendly
- Accessible components

## 📊 Monitoring & Logging

Backend menggunakan Winston untuk logging:
- Error logs: `backend/logs/error.log`
- Combined logs: `backend/logs/combined.log`
- Console output (development mode)

## 🐛 Troubleshooting

### Backend tidak connect ke FTP
1. Check FTP server running: `docker ps`
2. Verify FTP credentials di `.env`
3. Test connection: `GET /api/ftp/test-connection`

### CORS errors
1. Pastikan `FRONTEND_URL` di backend `.env` sesuai
2. Check frontend running di URL yang benar

### Rate limiting terlalu ketat
Adjust di `backend/routes/dos.js`:
```javascript
const dosTestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100, // Increase this number
  ...
});
```

## 📄 License

MIT

## 👥 Contributors

- Your Team Name

## 🙏 Acknowledgments

- Express.js
- Next.js
- Tailwind CSS
- basic-ftp
- Winston
- And all other open-source libraries used
