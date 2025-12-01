# ⚡ QUICK START: Connect Frontend Vercel ke Backend

## 🎯 Masalah Saat Ini
Frontend Anda sudah di Vercel tapi **tidak bisa login** karena backend masih di localhost.

---

## ✅ SOLUSI TERCEPAT (5 Menit)

### 1️⃣ Deploy Backend ke Railway
👉 **Ikuti panduan lengkap di:** `RAILWAY-DEPLOY.md`

**Singkatnya:**
1. Buka https://railway.app
2. Login dengan GitHub
3. Deploy from repo `kemjar19`
4. Set Root Directory = `backend`
5. Add environment variables
6. Generate domain
7. Copy URL backend

### 2️⃣ Update Frontend Environment Variable
1. Buka: https://vercel.com/rafli127s-projects/kemjar19/settings/environment-variables
2. Tambah variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-railway-url.up.railway.app/api
   ```
3. Centang: Production, Preview, Development
4. Save

### 3️⃣ Redeploy Frontend
```powershell
vercel --prod
```

### 4️⃣ Test Login
Buka: https://kemjar19-10v7ehsvf-rafli127s-projects.vercel.app
- Username: `admin`
- Password: `admin123`

---

## 🔗 Files Yang Sudah Disiapkan

✅ **`backend/api/index.js`** - Entry point untuk serverless
✅ **`backend/vercel.json`** - Konfigurasi Vercel (jika mau pakai Vercel)
✅ **CORS sudah diset** untuk allow Vercel domains

---

## 📚 Dokumentasi Lengkap

- **`RAILWAY-DEPLOY.md`** - Panduan deploy ke Railway (RECOMMENDED)
- **`DEPLOY-BACKEND-GUIDE.md`** - Panduan lengkap semua opsi
- **`FIX-LOGIN-VERCEL.md`** - Troubleshooting login

---

## 🚨 Error Vercel Team Permission?

Karena ada error team permission di Vercel CLI, gunakan **Railway** atau **deploy via Vercel Dashboard** (manual import).

---

## 💡 Tips

**Untuk Development Lokal:**
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Buka: http://localhost:4000

**Untuk Production:**
- Frontend: Vercel (sudah deployed)
- Backend: Railway (recommended) atau Render

---

## ✅ Checklist

- [ ] Backend deployed ke Railway/Render
- [ ] Test: `https://your-backend.railway.app/api/health`
- [ ] Environment variable `NEXT_PUBLIC_API_URL` diset di Vercel
- [ ] Frontend redeploy
- [ ] Test login di production URL

---

## 🎉 Result

Setelah selesai, Anda akan punya:
- ✅ Frontend Next.js running di Vercel
- ✅ Backend Express API running di Railway
- ✅ Login system berfungsi penuh
- ✅ FTP operations bisa diakses

**Frontend URL:**
```
https://kemjar19-10v7ehsvf-rafli127s-projects.vercel.app
```

**Backend URL:** (setelah deploy)
```
https://your-app.up.railway.app
```
