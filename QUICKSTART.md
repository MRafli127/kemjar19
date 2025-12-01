# Quick Start Guide

Get the FTP Management System up and running in minutes!

## 🚀 Fast Setup (5 minutes)

### Prerequisites
- Node.js 18+ installed ([Download](https://nodejs.org/))
- Git installed
- Text editor (VS Code recommended)

### Step 1: Install Dependencies

Open PowerShell in the project root directory and run:

```powershell
# Run automated setup
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

This will install all dependencies for both backend and frontend.

### Step 2: Start the Application

```powershell
# Start both backend and frontend
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

This opens two terminal windows:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3001

### Step 3: Access the Application

1. Open browser: http://localhost:3001
2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

🎉 **That's it!** You're ready to use the application.

---

## 📋 Manual Setup (Alternative)

If you prefer manual setup or automated scripts don't work:

### Backend

```powershell
cd backend
npm install
npm run dev
```

### Frontend (in new terminal)

```powershell
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Setup (Optional)

If you have Docker installed:

```powershell
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🎯 First Steps After Login

### 1. Upload a File
1. Go to "File Management" tab
2. Click "Choose File" and select a file
3. Click "Upload"
4. Your file appears in the list below

### 2. Download/Delete Files
1. In the files list, click download icon 📥 to download
2. Click trash icon 🗑️ to delete

### 3. Test DOS Protection
1. Go to "DOS Testing" tab
2. View current metrics
3. Click "Low Intensity", "Medium", or "High" to run test
4. Watch metrics update in real-time
5. Try multiple clicks quickly to trigger rate limit

### 4. Try Anonymous Login
1. Logout from current session
2. On login page, click "Continue as Guest"
3. Access limited features without account

---

## ⚙️ Configuration

### Change Admin Password

Edit `backend/.env`:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_new_password
```

Restart backend for changes to take effect.

### Change Ports

**Backend Port** - Edit `backend/.env`:
```env
PORT=5000
```

**Frontend Port** - Default is 3001. To change:
```bash
cd frontend
npm run dev -- -p 3002
```

Don't forget to update API URL if backend port changes!

### FTP Configuration

Edit `backend/.env`:
```env
FTP_HOST=localhost
FTP_PORT=21
FTP_USER=ftpuser
FTP_PASSWORD=ftppassword
```

---

## 🔧 Troubleshooting

### Backend won't start

**Error**: Port 5000 already in use

**Solution**: 
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Frontend can't connect to backend

**Check**:
1. Backend is running: http://localhost:5000/api/health
2. Should return: `{"status":"OK",...}`

**Fix**: Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### CORS errors in browser

**Fix**: Edit `backend/.env`:
```env
FRONTEND_URL=http://localhost:3001
```

### Files not uploading

**Check**:
1. Uploads folder exists: `backend/uploads/`
2. File size under limit (10MB default)
3. User is authenticated (check token)

### Node modules errors

**Fix**:
```powershell
# Delete node_modules and reinstall
cd backend
Remove-Item -Recurse -Force node_modules
npm install

cd ../frontend
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📱 Testing the Application

### Test File Upload/Download
1. Upload a small text file
2. Download it back
3. Verify contents are identical
4. Delete the file

### Test Authentication
1. Logout
2. Try accessing dashboard (should redirect to login)
3. Login with wrong password (should show error)
4. Login with correct credentials
5. Token should persist across page refresh

### Test DOS Protection
1. Open "DOS Testing" tab
2. Rapidly click "Low Intensity" button 10+ times
3. Should see "Rate limit exceeded" error
4. Wait 1 minute and try again

### Test Anonymous Access
1. Logout
2. Click "Continue as Guest"
3. Try uploading files
4. Should work with temporary user ID

---

## 🎨 Customization

### Change Color Theme

Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color', // Change main color
      },
    },
  },
}
```

### Modify Rate Limits

Edit `backend/routes/dos.js`:
```javascript
const dosTestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Time window
  max: 100, // Max requests - increase/decrease
});
```

### Change File Upload Limit

Edit `backend/.env`:
```env
MAX_FILE_SIZE=20971520  # 20MB in bytes
```

---

## 📚 Next Steps

- [ ] Read full [README.md](README.md) for detailed documentation
- [ ] Check [API.md](API.md) for API documentation
- [ ] Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- [ ] Customize settings in `.env` files
- [ ] Change default passwords
- [ ] Set up FTP server (if not using Docker)
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to your server

---

## 💡 Pro Tips

1. **Use Docker** for easiest setup with FTP server included
2. **Check logs** when something goes wrong:
   - Backend: `backend/logs/combined.log`
   - Browser console for frontend errors
3. **Keep tokens secure** - never commit `.env` files
4. **Test locally first** before deploying to production
5. **Use HTTPS in production** for secure communication

---

## 🆘 Getting Help

### Check Logs

**Backend logs**:
```powershell
Get-Content backend\logs\combined.log -Tail 50
```

**Docker logs**:
```powershell
docker-compose logs -f backend
```

### Common Issues

1. **Module not found**: Run `npm install` in correct directory
2. **Port in use**: Change port or kill existing process
3. **Cannot connect**: Check firewall settings
4. **Upload fails**: Check file size and permissions

### Resources

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## ✅ Quick Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`setup.ps1` or `npm install`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login with admin/admin123
- [ ] Can upload a file
- [ ] Can download a file
- [ ] DOS testing works
- [ ] Anonymous login works

---

**Ready to deploy?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guide!

**Need API details?** See [API.md](API.md) for complete API documentation!

**Questions?** Check [README.md](README.md) for comprehensive documentation!
