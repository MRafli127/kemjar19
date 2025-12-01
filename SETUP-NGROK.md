# 🌐 Setup Ngrok - Deploy Frontend ke Vercel

Panduan lengkap untuk deploy frontend ke Vercel dengan backend tetap di laptop menggunakan Ngrok tunnel.

---

## 📋 Prerequisites

- ✅ Docker Desktop installed
- ✅ Node.js installed
- ✅ Account Vercel (gratis): https://vercel.com
- ✅ Account Ngrok (gratis): https://ngrok.com

---

## 🔧 Setup Ngrok

### 1. Install Ngrok

**Download:**
- https://ngrok.com/download

**Windows:**
```powershell
# Extract ngrok.exe ke folder, misalnya C:\ngrok\
# Atau install via chocolatey:
choco install ngrok
```

### 2. Setup Ngrok Account

1. Daftar di https://dashboard.ngrok.com/signup
2. Dapatkan **authtoken** dari: https://dashboard.ngrok.com/get-started/your-authtoken
3. Authenticate ngrok:

```powershell
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

---

## 🚀 Deployment Steps

### Step 1: Start Backend + FTP di Docker

```powershell
# Di root folder project
cd "c:\Users\Raddief Ezra S. A\CODING\KemjarFinpro\KemjarFinpro"

# Start Docker containers
docker-compose up -d
```

**Verifikasi:**
```powershell
# Cek container running
docker ps

# Test backend
Invoke-RestMethod http://localhost:5000/api/health
```

---

### Step 2: Expose Backend dengan Ngrok

**Terminal Baru (JANGAN DITUTUP):**

```powershell
# Expose backend ke internet
ngrok http 5000
```

**Output yang muncul:**
```
Forwarding    https://abc123def456.ngrok.io -> http://localhost:5000
```

**PENTING:**
- ✅ Copy URL ngrok: `https://abc123def456.ngrok.io`
- ✅ Jangan tutup terminal ngrok (biarkan jalan terus)
- ⚠️ URL berubah setiap restart (kecuali pakai paid plan)

---

### Step 3: Update Frontend Environment

**Edit file `.env.production`:**

```powershell
# Di folder frontend
cd frontend
```

Buat file `.env.production`:

```env
# Ganti dengan ngrok URL Anda
NEXT_PUBLIC_API_URL=https://abc123def456.ngrok.io/api
```

**INGAT:** Ganti `abc123def456` dengan URL ngrok Anda yang sebenarnya!

---

### Step 4: Deploy ke Vercel

#### A. Install Vercel CLI

```powershell
npm install -g vercel
```

#### B. Login ke Vercel

```powershell
vercel login
```

Pilih method login (GitHub/Email)

#### C. Deploy Frontend

```powershell
# Pastikan masih di folder frontend
cd frontend

# Deploy
vercel
```

**Jawab pertanyaan:**
```
? Set up and deploy? [Y/n] Y
? Which scope? → Pilih account Anda
? Link to existing project? [y/N] N
? What's your project's name? kemjar-finpro
? In which directory is your code located? ./
? Want to override settings? [y/N] N
```

**Output:**
```
✅ Production: https://kemjar-finpro-xyz.vercel.app
```

#### D. Set Environment Variables di Vercel

**Option 1: Via CLI**
```powershell
vercel env add NEXT_PUBLIC_API_URL production
# Paste ngrok URL: https://abc123def456.ngrok.io/api
```

**Option 2: Via Dashboard**
1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Settings → Environment Variables
4. Add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://abc123def456.ngrok.io/api`
   - Environment: Production

#### E. Redeploy (Setelah set env)

```powershell
vercel --prod
```

---

### Step 5: Setup ZeroTier (Untuk FTP Testing)

**Di Laptop Anda:**

1. Download ZeroTier: https://www.zerotier.com/download/
2. Install
3. Buat network di: https://my.zerotier.com/
   - Create Network → Dapat **Network ID** (16 digit)
4. Join network:

```powershell
zerotier-cli join YOUR_NETWORK_ID
```

5. Cek IP ZeroTier:

```powershell
ipconfig | Select-String "ZeroTier"
```

Copy IP ZeroTier Anda (contoh: `100.64.123.45`)

**Share ke Teman:**
- Network ID
- IP ZeroTier Anda

---

## 🧪 Testing

### Untuk Anda (Developer):

**1. Test Backend Lokal:**
```powershell
curl http://localhost:5000/api/health
```

**2. Test Backend via Ngrok:**
```powershell
curl https://abc123def456.ngrok.io/api/health
```

**3. Test Frontend di Vercel:**
Buka browser: `https://kemjar-finpro-xyz.vercel.app`

**4. Test FTP Lokal:**
```powershell
ftp localhost
# Username: anonymous atau ftpuser
```

---

### Untuk Teman (Tester):

**1. Install ZeroTier di Kali:**
```bash
curl -s https://install.zerotier.com | sudo bash
sudo zerotier-cli join YOUR_NETWORK_ID
```

**2. Authorize Device:**
- Anda buka https://my.zerotier.com/
- Authorize device teman (centang checkbox)

**3. Test Website:**
```bash
# Di browser Kali
firefox https://kemjar-finpro-xyz.vercel.app
```

**4. Test FTP via ZeroTier:**
```bash
# Ganti dengan IP ZeroTier Anda
ftp 100.64.123.45

# Login anonymous
Name: anonymous
Password: (enter)

# Test commands
ftp> ls
ftp> cd upload
ftp> ls
```

**5. Test Nmap:**
```bash
sudo nmap -p 21 --script ftp-anon 100.64.123.45
```

---

## 🔄 Restart/Update Workflow

### Jika Ngrok URL Berubah:

**1. Restart Ngrok → Dapat URL baru**

**2. Update di Vercel:**
```powershell
# Update env variable
vercel env rm NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_API_URL production
# Paste URL ngrok yang baru

# Redeploy
vercel --prod
```

### Jika Update Code:

**Frontend:**
```powershell
cd frontend
git add .
git commit -m "update"
git push

# Auto deploy by Vercel (jika linked ke GitHub)
# Atau manual: vercel --prod
```

**Backend/FTP:**
```powershell
docker-compose down
docker-compose up -d --build
```

---

## 🌍 Akses URLs

Setelah setup lengkap:

| Service | URL | Accessible By |
|---------|-----|---------------|
| **Website** | `https://kemjar-finpro-xyz.vercel.app` | 🌐 Public (Anyone) |
| **Backend API** | `https://abc123.ngrok.io/api` | 🌐 Public (via Ngrok) |
| **FTP Server** | `ftp://100.64.123.45:21` | 🔒 Private (ZeroTier only) |
| **Backend Local** | `http://localhost:5000` | 💻 Localhost only |
| **FTP Local** | `ftp://localhost:21` | 💻 Localhost only |

---

## 📊 Monitoring

### Cek Ngrok Traffic:

Buka browser: `http://localhost:4040`

Ngrok web interface untuk monitoring:
- Request logs
- Response status
- Traffic stats

### Cek Docker Logs:

```powershell
# Semua logs
docker-compose logs -f

# Backend saja
docker-compose logs -f backend

# FTP saja
docker-compose logs -f vsftpd
```

### Cek Vercel Logs:

https://vercel.com/dashboard → Project → Logs

---

## ⚠️ Troubleshooting

### Ngrok: "Session Expired"

**Masalah:** Free tier ngrok session expire setelah 8 jam

**Solusi:**
```powershell
# Restart ngrok
Ctrl+C
ngrok http 5000

# Update URL baru di Vercel environment variables
```

### Vercel: "API Request Failed"

**Cek:**
1. ✅ Ngrok masih running?
2. ✅ NEXT_PUBLIC_API_URL di Vercel benar?
3. ✅ Backend Docker masih running?

```powershell
docker ps
curl https://your-ngrok-url.ngrok.io/api/health
```

### FTP: "Connection Refused"

**Cek:**
1. ✅ Docker FTP container running?
2. ✅ ZeroTier connected?
3. ✅ IP ZeroTier benar?

```powershell
docker ps | Select-String "ftp"
zerotier-cli listnetworks
ipconfig | Select-String "ZeroTier"
```

### Frontend: Environment Variable Not Working

**Solusi:**
```powershell
# Clear Vercel cache
vercel --prod --force
```

---

## 💰 Ngrok Pricing (Optional)

### Free Tier:
- ✅ 1 online ngrok process
- ✅ 4 tunnels/ngrok process
- ✅ 40 connections/minute
- ⚠️ Random URLs (berubah setiap restart)
- ⚠️ Session expire 8 jam

### Paid ($8/month):
- ✅ Custom subdomain (fixed URL)
- ✅ Reserved domains
- ✅ No session limit
- ✅ More connections

**Untuk testing project: Free tier sudah cukup!**

---

## ✅ Deployment Checklist

### Setup Awal:
- [ ] Ngrok installed & authenticated
- [ ] Vercel CLI installed & login
- [ ] ZeroTier installed
- [ ] Docker running

### Deploy Process:
- [ ] Docker containers up (`docker-compose up -d`)
- [ ] Ngrok running (`ngrok http 5000`)
- [ ] Copy ngrok URL
- [ ] Update `.env.production` dengan ngrok URL
- [ ] Deploy ke Vercel (`vercel --prod`)
- [ ] Set environment variables di Vercel
- [ ] ZeroTier network created & joined

### Testing:
- [ ] Website accessible (Vercel URL)
- [ ] Website bisa connect backend (check browser console)
- [ ] Login works
- [ ] File upload works
- [ ] Teman bisa akses website
- [ ] Teman bisa FTP via ZeroTier
- [ ] Files from website visible in FTP

---

## 📞 Quick Commands Reference

```powershell
# Start Everything
docker-compose up -d
ngrok http 5000
cd frontend && npm run dev  # (untuk local test)

# Deploy to Vercel
cd frontend
vercel --prod

# Check Status
docker ps
zerotier-cli listnetworks
curl https://your-ngrok.ngrok.io/api/health

# Restart
docker-compose restart
# Ctrl+C on ngrok, then restart

# Stop Everything
docker-compose down
# Ctrl+C on ngrok
```

---

**🎉 Setup Complete! Teman Anda sekarang bisa akses website public dan test FTP via ZeroTier!**
