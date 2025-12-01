# 🚀 FTP Management System - Setup Guide

Panduan lengkap untuk menjalankan FTP Management System dengan Docker dan Next.js.

## 📋 Prerequisites

Pastikan sudah terinstall:
- ✅ **Docker Desktop** (untuk Windows)
- ✅ **Node.js** (v16 atau lebih baru)
- ✅ **Git**

---

## 🔧 Setup Awal

### 1. Clone Repository

```powershell
git clone https://github.com/Raddief/KemjarFinpro.git
cd KemjarFinpro
```

### 2. Install Dependencies Frontend

```powershell
cd frontend
npm install
cd ..
```

---

## 🐳 Menjalankan Aplikasi

### Step 1: Start Docker (Backend + FTP Server)

```powershell
# Di root folder project
docker-compose up -d
```

**Output yang diharapkan:**
```
✔ Network kemjarfinpro_ftp-network  Created
✔ Container ftp-backend             Started
✔ Container ftp-server              Started
```

**Services yang jalan:**
- 🖥️ Backend API: `http://localhost:5000`
- 📁 FTP Server: `ftp://localhost:21`

### Step 2: Start Frontend (Terminal Baru)

```powershell
cd frontend
npm run dev
```

**Output yang diharapkan:**
```
ready - started server on 0.0.0.0:4000
```

**Website:** `http://localhost:4000`

---

## 🌐 Akses Aplikasi

### Website
```
URL: http://localhost:4000
```

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

Atau gunakan **Anonymous Login** (button "Continue as Guest")

### Backend API
```
URL: http://localhost:5000/api
Health Check: http://localhost:5000/api/health
```

### FTP Server
```
Host: localhost (atau IP Windows Anda)
Port: 21
```

**Credentials:**
- **Anonymous**: username `anonymous`, password kosong
- **Authenticated**: username `ftpuser`, password `ftppassword`

---

## 🧪 Testing dari Kali Linux

### 1. Cek IP Windows Anda

Di Windows PowerShell:
```powershell
ipconfig
```

Cari **IPv4 Address** (contoh: `192.168.0.102` atau `10.189.192.27`)

### 2. Test FTP Anonymous Login

Di Kali Linux:
```bash
# Basic FTP
ftp <IP-Windows-Anda>
# Username: anonymous
# Password: (tekan Enter)

# Disable passive mode jika ls gagal
ftp> passive
ftp> ls
ftp> cd upload
ftp> ls
```

### 3. Scan dengan Nmap

```bash
# Cek anonymous FTP
sudo nmap -p 21 --script ftp-anon <IP-Windows-Anda>

# Full scan
nmap -A -p 21 <IP-Windows-Anda>
```

### 4. Test dengan lftp (Recommended)

```bash
# Install lftp
sudo apt install lftp -y

# Connect
lftp -u anonymous, <IP-Windows-Anda>

# List files
lftp> ls
lftp> cd upload
lftp> ls
```

---

## 📁 File Upload Flow

### Dari Website:

1. Login ke `http://localhost:4000`
2. Upload file via form
3. File disimpan di `./backend/uploads/<username>/`
4. File juga di-upload ke FTP server

### Dari Kali Linux:

```bash
ftp <IP-Windows-Anda>
ftp> cd upload
ftp> ls   # File dari website akan terlihat di sini!
ftp> get <filename>  # Download file
```

---

## 🛑 Menghentikan Aplikasi

### Stop Frontend
Tekan `Ctrl+C` di terminal yang menjalankan `npm run dev`

### Stop Docker

```powershell
docker-compose down
```

---

## 🔄 Restart Aplikasi

### Restart Semua Services

```powershell
docker-compose restart
```

### Restart Hanya FTP Server

```powershell
docker-compose restart vsftpd
```

### Restart Hanya Backend

```powershell
docker-compose restart backend
```

### Rebuild Docker Images (Jika Ada Perubahan)

```powershell
docker-compose up -d --build
```

---

## 📊 Monitoring & Logs

### Lihat Logs Semua Container

```powershell
docker-compose logs -f
```

### Logs Backend Saja

```powershell
docker-compose logs -f backend
```

### Logs FTP Server Saja

```powershell
docker-compose logs -f vsftpd
```

### Cek Status Container

```powershell
docker-compose ps
```

---

## 🐛 Troubleshooting

### Problem: Port sudah digunakan

**Error:** `bind: address already in use`

**Solusi:**
```powershell
# Cek port yang digunakan
netstat -ano | findstr :5000
netstat -ano | findstr :4000
netstat -ano | findstr :21

# Kill process (ganti <PID> dengan Process ID)
taskkill /PID <PID> /F
```

### Problem: Docker container tidak start

**Solusi:**
```powershell
# Stop semua
docker-compose down

# Rebuild
docker-compose up -d --build

# Cek logs untuk error
docker-compose logs
```

### Problem: FTP `ls` command gagal

**Solusi di Kali Linux:**
```bash
# Disable passive mode
ftp> passive
Passive mode off.
ftp> ls

# Atau gunakan lftp
lftp -u anonymous, <IP-Windows>
```

### Problem: File upload dari website tidak muncul di FTP

**Cek volume mapping:**
```powershell
docker-compose down
docker-compose up -d
```

File seharusnya ada di:
- Local: `./backend/uploads/`
- FTP: `ftp://localhost/upload/`

### Problem: Login failed

**Pastikan credentials benar:**
- Admin: `admin` / `admin123`
- FTP User: `ftpuser` / `ftppassword`
- Anonymous: `anonymous` / (kosong)

---

## 🌍 Deploy untuk Testing Remote

Jika ingin teman dari tempat lain bisa akses:

### Opsi 1: Deploy ke VPS (Recommended)

1. Sewa VPS (DigitalOcean, AWS, dll)
2. Install Docker & Docker Compose
3. Clone repo
4. Update IP di `Dockerfile.ftp` (baris 32: `pasv_address`)
5. Setup firewall:
   ```bash
   ufw allow 21/tcp
   ufw allow 5000/tcp
   ufw allow 4000/tcp
   ufw allow 30000:30009/tcp
   ```
6. Run `docker-compose up -d`
7. Run frontend: `cd frontend && npm run build && npm start`

### Opsi 2: Ngrok (Quick Testing)

```powershell
# Install ngrok: https://ngrok.com/download

# Expose frontend
ngrok http 4000

# Expose backend (terminal baru)
ngrok http 5000

# Share URL ngrok ke teman
```

---

## 📝 Project Structure

```
KemjarFinpro/
├── backend/              # Backend API (Node.js)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── uploads/         # Uploaded files
│   └── server.js        # Main server file
├── frontend/            # Frontend (Next.js)
│   ├── pages/          # React pages
│   ├── context/        # Auth context
│   └── utils/          # API utilities
├── Dockerfile.ftp      # FTP server Docker image
├── docker-compose.yml  # Docker orchestration
└── GUIDE.md           # This file
```

---

## 🔗 Useful Links

- Backend API Docs: [API.md](./API.md)
- Deployment Guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Quick Start: [QUICKSTART.md](./QUICKSTART.md)

---

## ✅ Checklist Testing

Sebelum demo/presentasi, pastikan:

- [ ] Docker containers running (`docker ps`)
- [ ] Backend health check OK (`http://localhost:5000/api/health`)
- [ ] Frontend accessible (`http://localhost:4000`)
- [ ] Login admin berhasil
- [ ] Anonymous login berhasil
- [ ] Upload file dari website berhasil
- [ ] FTP anonymous login dari Kali berhasil
- [ ] `ls` command di FTP berhasil
- [ ] File dari website terlihat di FTP
- [ ] Download file dari FTP berhasil

---

## 📞 Support

Jika ada masalah, cek:
1. Logs Docker: `docker-compose logs -f`
2. Frontend console di browser (F12)
3. File [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Happy Coding! 🚀**
