# 🔧 Cara Mengatasi Masalah Login di Vercel

## 🎯 Masalah
Frontend di Vercel tidak bisa login karena tidak bisa connect ke backend yang berjalan di `localhost:5000` di komputer Anda.

## ✅ Solusi

### Opsi 1: Test di Local (Quick Test)
1. **Jalankan Frontend di Local:**
   ```powershell
   cd frontend
   npm run dev
   ```
   
2. **Buka browser:** `http://localhost:4000`

3. **Login dengan:**
   - Username: `admin`
   - Password: `admin123`
   
   Atau klik "Continue as Guest"

---

### Opsi 2: Connect Vercel ke Backend Lokal dengan ngrok (Recommended untuk Testing)

#### Step 1: Install ngrok
1. Download ngrok dari: https://ngrok.com/download
2. Extract file zip ke folder (misal: `C:\ngrok`)
3. Buka PowerShell dan jalankan:
   ```powershell
   # Daftar di ngrok.com untuk dapat authtoken
   # Kemudian jalankan:
   .\ngrok.exe config add-authtoken YOUR_AUTHTOKEN
   ```

#### Step 2: Expose Backend
1. **Pastikan backend sudah running:**
   ```powershell
   cd backend
   npm start
   ```

2. **Di terminal baru, jalankan ngrok:**
   ```powershell
   ngrok http 5000
   ```

3. **Copy URL yang muncul** (contoh: `https://abc123.ngrok.io`)

#### Step 3: Update Environment Variable di Vercel
1. Buka Vercel Dashboard: https://vercel.com/rafli127s-projects/kemjar19
2. Pilih **Settings** → **Environment Variables**
3. Tambah variable baru:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://abc123.ngrok.io/api` (ganti dengan URL ngrok Anda)
   - **Environment:** Production, Preview, Development (centang semua)

4. Klik **Save**

#### Step 4: Redeploy
```powershell
vercel --prod
```

Sekarang frontend di Vercel bisa connect ke backend lokal Anda!

---

### Opsi 3: Deploy Backend ke Cloud (Production Ready)

Untuk production yang proper, deploy backend ke platform cloud:

#### A. Deploy ke Railway.app (Gratis, Mudah)
1. Buat akun di https://railway.app
2. Klik **New Project** → **Deploy from GitHub repo**
3. Pilih repository `kemjar19`
4. Pilih folder `backend`
5. Set environment variables:
   ```
   PORT=5000
   JWT_SECRET=7o0brzol4zmigqj7f5r2hvt4b
   JWT_EXPIRE=7d
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   FTP_HOST=localhost
   FTP_PORT=21
   FTP_USER=ftpuser
   FTP_PASSWORD=ftppassword
   ```
6. Deploy!

#### B. Deploy ke Render.com (Gratis)
1. Buat akun di https://render.com
2. Klik **New** → **Web Service**
3. Connect repository GitHub
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Set environment variables sama seperti di atas
6. Deploy!

#### C. Update Vercel Environment Variable
Setelah backend deploy, update `NEXT_PUBLIC_API_URL` di Vercel dengan URL backend yang baru (contoh: `https://your-app.railway.app/api`)

---

## 📋 Checklist Troubleshooting

- [ ] Backend berjalan di `http://localhost:5000`
- [ ] Test endpoint: `http://localhost:5000/api/health`
- [ ] Frontend lokal bisa login
- [ ] ngrok running dan expose port 5000
- [ ] Environment variable `NEXT_PUBLIC_API_URL` sudah diset di Vercel
- [ ] Redeploy Vercel setelah update env variable
- [ ] Test login di Vercel URL

---

## 🐛 Debug Tips

### Cek Backend Status
```powershell
# Cek apakah backend running
netstat -ano | findstr :5000

# Cek health endpoint
curl http://localhost:5000/api/health
```

### Cek Frontend Config
```powershell
# Di folder frontend
cat .env.local
```

### Cek Browser Console
1. Buka DevTools (F12)
2. Tab **Console** - lihat error
3. Tab **Network** - lihat request API, pastikan tidak ada CORS error

---

## 📝 Credentials Default

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**Anonymous Login:**
- Klik tombol "Continue as Guest"

---

## 🎉 Setelah Selesai

Frontend Anda di Vercel: https://kemjar19-10v7ehsvf-rafli127s-projects.vercel.app

Pastikan backend accessible dari internet (via ngrok atau cloud deployment) agar login bekerja!
