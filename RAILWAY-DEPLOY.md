# 🚀 SOLUSI TERCEPAT: Deploy Backend ke Railway

## ⚡ Kenapa Railway?
- ✅ **Gratis** dan mudah
- ✅ **Tidak ada masalah team permission**
- ✅ **Auto-detect Node.js**
- ✅ **Support environment variables**
- ✅ **Deploy dalam 2 menit**

---

## 📝 Langkah-langkah Deploy Backend ke Railway

### Step 1: Buka Railway
1. Kunjungi: **https://railway.app**
2. Klik **"Start a New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Login dengan GitHub

### Step 2: Authorize & Select Repository
1. Authorize Railway untuk akses GitHub
2. Pilih repository: **`kemjar19`**
3. Klik repository yang muncul

### Step 3: Konfigurasi Project
1. Railway akan auto-detect sebagai Node.js project
2. Klik **"Add variables"** atau **"Variables"** di sidebar

### Step 4: Tambahkan Environment Variables
Klik **"New Variable"** dan tambahkan satu per satu:

```
PORT = 5000
```

```
JWT_SECRET = 7o0brzol4zmigqj7f5r2hvt4b
```

```
JWT_EXPIRE = 7d
```

```
ADMIN_USERNAME = admin
```

```
ADMIN_PASSWORD = admin123
```

```
NODE_ENV = production
```

### Step 5: Set Root Directory (PENTING!)
1. Klik **"Settings"** di sidebar
2. Scroll ke **"Root Directory"**
3. Isi dengan: **`backend`**
4. Klik **"Update"**

### Step 6: Deploy!
1. Klik **"Deploy"** atau tunggu auto-deploy
2. Tunggu 1-2 menit
3. Railway akan build dan deploy backend Anda

### Step 7: Dapatkan URL Backend
1. Setelah deploy selesai, klik **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"**
4. Copy URL yang muncul, contoh:
   ```
   https://kemjar-backend-production.up.railway.app
   ```

---

## 🔗 Update Frontend Vercel

### Step 8: Set Environment Variable di Vercel
1. Buka: **https://vercel.com/rafli127s-projects/kemjar19**
2. Klik **"Settings"** → **"Environment Variables"**
3. Cari atau tambah variable:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app/api`
   - **Environments:** Centang **Production**, **Preview**, **Development**
4. Klik **"Save"**

### Step 9: Redeploy Frontend
```powershell
cd "c:\Users\MUHAMMAD RAFLI\OneDrive\Documents\SEMESTER 5\PRAKTIKUM\Keamanan Jaringan Komputer\KemjarFinpro"
vercel --prod
```

---

## ✅ Testing

### Test Backend
Buka browser atau gunakan curl:
```
https://your-railway-url.up.railway.app/api/health
```

Response yang benar:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-12-01T..."
}
```

### Test Frontend Login
1. Buka: **https://kemjar19-10v7ehsvf-rafli127s-projects.vercel.app**
2. Login dengan:
   - Username: **`admin`**
   - Password: **`admin123`**
3. Atau klik **"Continue as Guest"**

---

## 🎯 Troubleshooting Railway

### Build Failed?
- Pastikan Root Directory = `backend`
- Cek logs di Railway dashboard
- Pastikan `package.json` ada di folder backend

### Port Error?
- Railway otomatis assign port via environment variable `PORT`
- Backend kita sudah support ini: `process.env.PORT || 5000`

### Cannot Access?
- Pastikan sudah Generate Domain di Railway Settings
- Test health endpoint dulu

---

## 📱 Alternative: Vercel via Dashboard (Manual)

Jika Railway tidak bisa, gunakan Vercel Dashboard:

### Step 1: Push ke GitHub
```powershell
cd "c:\Users\MUHAMMAD RAFLI\OneDrive\Documents\SEMESTER 5\PRAKTIKUM\Keamanan Jaringan Komputer\KemjarFinpro"
git add .
git commit -m "Add backend Vercel config"
git push origin main
```

### Step 2: Deploy via Vercel Dashboard
1. **Buka:** https://vercel.com/new
2. **Import** repository `kemjar19`
3. **Create** project baru (jangan link ke existing)
4. **Project Name:** `kemjar-backend`
5. **Root Directory:** `backend` ← PENTING!
6. **Add Environment Variables** (sama seperti Railway di atas)
7. **Deploy**

---

## 🎉 Selesai!

Setelah langkah-langkah di atas, sistem Anda akan:
- ✅ Frontend di Vercel: Next.js app
- ✅ Backend di Railway: Express API
- ✅ Login berfungsi penuh
- ✅ FTP operations berjalan

**URLs:**
- Frontend: `https://kemjar19-10v7ehsvf-rafli127s-projects.vercel.app`
- Backend: `https://your-app.up.railway.app` (setelah deploy)

**Credentials:**
- Username: `admin`
- Password: `admin123`
