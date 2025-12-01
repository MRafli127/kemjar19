# 🚀 Deploy Backend ke Vercel - Step by Step

## ❗ Masalah Error Team Access
Jika Anda mendapat error "must have access to the team", ikuti langkah ini:

### Solusi 1: Logout dan Login Ulang Vercel
```powershell
vercel logout
vercel login
```
Pilih email yang benar dan pastikan tidak menggunakan team account.

### Solusi 2: Deploy Backend ke Vercel (Manual via Dashboard)

#### Step 1: Persiapan File Backend
File sudah siap dengan struktur:
```
backend/
  ├── api/
  │   └── index.js (entry point untuk Vercel)
  ├── routes/
  ├── middleware/
  ├── utils/
  ├── package.json
  └── vercel.json
```

#### Step 2: Push ke GitHub (Jika Belum)
```powershell
# Di folder root project
git add .
git commit -m "Add backend Vercel config"
git push origin main
```

#### Step 3: Deploy via Vercel Dashboard
1. **Buka:** https://vercel.com
2. **Klik:** "Add New" → "Project"
3. **Import:** Repository `kemjar19`
4. **Configure:**
   - Project Name: `kemjar-backend` (atau nama lain)
   - Framework Preset: `Other`
   - Root Directory: **`backend`** ← PENTING!
   - Build Command: (kosongkan)
   - Output Directory: (kosongkan)
   - Install Command: `npm install`

5. **Environment Variables** - Klik "Add" dan masukkan:
   ```
   JWT_SECRET = 7o0brzol4zmigqj7f5r2hvt4b
   JWT_EXPIRE = 7d
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = admin123
   NODE_ENV = production
   ```

6. **Klik:** "Deploy"

#### Step 4: Dapatkan Backend URL
Setelah deploy selesai, Anda akan dapat URL seperti:
```
https://kemjar-backend.vercel.app
```

#### Step 5: Update Frontend Environment Variable
1. Buka project frontend di Vercel: https://vercel.com/rafli127s-projects/kemjar19
2. **Settings** → **Environment Variables**
3. Tambah/Update:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://kemjar-backend.vercel.app/api`
   - **Environments:** Production, Preview, Development

4. **Redeploy Frontend:**
```powershell
cd "c:\Users\MUHAMMAD RAFLI\OneDrive\Documents\SEMESTER 5\PRAKTIKUM\Keamanan Jaringan Komputer\KemjarFinpro"
vercel --prod
```

---

## 🎯 Solusi Alternatif: Deploy Backend ke Platform Lain

### Opsi A: Railway.app (Recommended - Gratis & Mudah)

#### Step 1: Setup Railway
1. **Buka:** https://railway.app
2. **Sign up** dengan GitHub
3. **Klik:** "New Project" → "Deploy from GitHub repo"
4. **Pilih:** Repository `kemjar19`

#### Step 2: Konfigurasi
1. **Klik:** "Add variables"
2. **Tambahkan Environment Variables:**
   ```
   PORT = 5000
   JWT_SECRET = 7o0brzol4zmigqj7f5r2hvt4b
   JWT_EXPIRE = 7d
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = admin123
   NODE_ENV = production
   ```

3. **Settings** → **Root Directory:** `backend`
4. **Deploy!**

#### Step 3: Dapatkan URL
Railway akan generate URL seperti:
```
https://your-app.railway.app
```

#### Step 4: Update Vercel Frontend
Sama seperti Step 5 di atas, tapi gunakan Railway URL.

---

### Opsi B: Render.com (Gratis)

#### Step 1: Setup Render
1. **Buka:** https://render.com
2. **Sign up** dengan GitHub
3. **Klik:** "New" → "Web Service"

#### Step 2: Konfigurasi
1. **Connect repository:** `kemjar19`
2. **Settings:**
   - Name: `kemjar-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables:**
   ```
   PORT = 5000
   JWT_SECRET = 7o0brzol4zmigqj7f5r2hvt4b
   JWT_EXPIRE = 7d
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = admin123
   NODE_ENV = production
   ```

4. **Klik:** "Create Web Service"

#### Step 3: URL
Render akan generate URL seperti:
```
https://kemjar-backend.onrender.com
```

---

## ⚡ Quick Test Backend

Setelah deploy, test backend dengan:

```powershell
# Ganti URL dengan backend URL Anda
curl https://your-backend-url.vercel.app/api/health
```

Response yang benar:
```json
{
  "status": "OK",
  "message": "Backend API is running on Vercel",
  "timestamp": "2025-12-01T..."
}
```

---

## 🔗 Update Frontend untuk Connect ke Backend

### File: frontend/.env.local (untuk test local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

### Vercel Environment Variable (untuk production)
```
NEXT_PUBLIC_API_URL = https://your-backend-url.vercel.app/api
```

---

## ✅ Checklist Final

- [ ] Backend deployed ke Vercel/Railway/Render
- [ ] Test endpoint: `/api/health` berhasil
- [ ] Environment variable `NEXT_PUBLIC_API_URL` diset di Vercel
- [ ] Frontend redeploy
- [ ] Test login di frontend production URL
- [ ] Login dengan: username `admin`, password `admin123`

---

## 🎉 URLs

**Frontend Production:**
```
https://kemjar19-10v7ehsvf-rafli127s-projects.vercel.app
```

**Backend Production:**
```
https://your-backend-url.vercel.app (setelah deploy)
```

**Credentials:**
- Username: `admin`
- Password: `admin123`
- Atau klik "Continue as Guest"

---

## 🐛 Troubleshooting

### Error: CORS
Backend sudah dikonfigurasi untuk allow semua `*.vercel.app` domains.

### Error: Cannot connect to backend
1. Pastikan backend URL benar di environment variable
2. Test backend health endpoint
3. Cek browser console untuk error detail

### Error: Login Failed
1. Pastikan environment variables (JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD) sudah diset di backend
2. Test dengan anonymous login dulu ("Continue as Guest")

---

## 📱 Rekomendasi

Untuk production yang stabil, gunakan **Railway.app** atau **Render.com** untuk backend karena:
- ✅ Support persistent connections lebih baik
- ✅ Gratis dengan limits yang cukup
- ✅ Lebih mudah untuk file uploads
- ✅ Support environment variables dengan baik

Vercel bagus untuk frontend (Next.js), tapi untuk backend Node.js dengan FTP dan file operations, Railway/Render lebih suitable.
