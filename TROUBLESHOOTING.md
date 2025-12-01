# 🔧 Troubleshooting Guide

Common issues and their solutions for the FTP Management System.

---

## 🚨 Installation Issues

### Node.js Not Found

**Error**: `'node' is not recognized as an internal or external command`

**Solution**:
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/PowerShell
3. Verify: `node --version`

---

### npm Install Fails

**Error**: `npm ERR! code EACCES` or permission errors

**Solution**:
```powershell
# Run PowerShell as Administrator
# Or clear npm cache
npm cache clean --force
npm install
```

---

### PowerShell Script Execution Error

**Error**: `cannot be loaded because running scripts is disabled`

**Solution**:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run script with bypass
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

---

## 🖥️ Backend Issues

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```powershell
# Find process using port 5000 (or 3001 for frontend)
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

---

### Cannot Find Module

**Error**: `Error: Cannot find module 'express'`

**Solution**:
```powershell
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### FTP Connection Failed

**Error**: `Failed to connect to FTP server`

**Causes & Solutions**:

1. **FTP Server Not Running**
   ```powershell
   # Check Docker containers
   docker-compose ps
   
   # Start FTP server
   docker-compose up -d vsftpd
   ```

2. **Wrong FTP Credentials**
   - Check `backend/.env` file
   - Verify FTP_USER and FTP_PASSWORD match Docker config
   - Default: `ftpuser` / `ftppassword`

3. **FTP Port Blocked**
   ```powershell
   # Test FTP connection
   telnet localhost 21
   
   # If fails, check firewall
   ```

4. **Docker Network Issues**
   ```powershell
   # Restart Docker services
   docker-compose down
   docker-compose up -d
   ```

---

### JWT Token Invalid

**Error**: `Invalid or expired token`

**Solution**:
1. Clear cookies in browser
2. Login again
3. Check JWT_SECRET in `.env` matches between sessions
4. Token expires after 7 days - login again

---

### File Upload Fails

**Error**: `File upload failed`

**Causes & Solutions**:

1. **File Too Large**
   - Default limit: 10MB
   - Change in `backend/.env`: `MAX_FILE_SIZE=20971520` (20MB)

2. **No Permission**
   ```powershell
   # Create uploads directory manually
   mkdir backend\uploads
   
   # Check write permissions
   ```

3. **No Token**
   - Make sure you're logged in
   - Check Authorization header in network tab

---

### Logs Not Creating

**Issue**: No log files in `backend/logs/`

**Solution**:
```powershell
# Create logs directory
mkdir backend\logs

# Check write permissions
# Restart backend server
```

---

## 🎨 Frontend Issues

### Frontend Won't Start

**Error**: Various Next.js errors

**Solution**:
```powershell
cd frontend
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

---

### Cannot Connect to Backend

**Error**: Network errors, CORS errors

**Causes & Solutions**:

1. **Backend Not Running**
   - Check: http://localhost:5000/api/health
   - Should return JSON with status "OK"

2. **Wrong API URL**
   ```env
   # Check frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **CORS Error**
   ```env
   # Check backend/.env
   FRONTEND_URL=http://localhost:3001
   ```
   - Restart backend after changing

---

### Styles Not Loading

**Issue**: Page has no styling

**Solution**:
```powershell
cd frontend

# Rebuild Tailwind
npm run dev

# Or reinstall
Remove-Item -Recurse -Force .next
npm install
```

---

### Page Not Found (404)

**Issue**: Routes not working

**Solution**:
1. Check file exists in `pages/` directory
2. File name should match route
3. Restart dev server
4. Clear `.next` folder

---

## 🐳 Docker Issues

### Docker Not Starting

**Error**: `docker: command not found`

**Solution**:
1. Install Docker Desktop from https://www.docker.com/
2. Start Docker Desktop application
3. Verify: `docker --version`

---

### Container Won't Start

**Error**: Container exits immediately

**Solution**:
```powershell
# Check logs
docker-compose logs backend

# Check if port is in use
netstat -ano | findstr :5000

# Rebuild container
docker-compose down
docker-compose build
docker-compose up -d
```

---

### Volume Permission Issues

**Error**: Cannot write to volume

**Solution**:
```powershell
# Stop containers
docker-compose down

# Remove volumes
docker volume prune

# Restart
docker-compose up -d
```

---

### FTP Container Not Accessible

**Issue**: Cannot connect to FTP in Docker

**Solution**:
```powershell
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs vsftpd

# Ensure ports are mapped correctly in docker-compose.yml
# Ports 21, 21000-21010 should be open
```

---

## 🌐 Network Issues

### Cannot Access from Other Devices

**Issue**: Want to access from phone/other computer

**Solution**:

1. **Find Your IP**
   ```powershell
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Allow Through Firewall**
   ```powershell
   # Windows Firewall - Allow Node.js
   # Add inbound rule for ports 3000 and 5000
   ```

3. **Update URLs**
   ```env
   # Frontend .env.local
   NEXT_PUBLIC_API_URL=http://192.168.1.100:5000/api
   
   # Backend .env
   FRONTEND_URL=http://192.168.1.100:3001
   ```

4. **Start with Host Binding**
   ```json
   // frontend/package.json
   "scripts": {
     "dev": "next dev -p 3001 -H 0.0.0.0"
   }
   ```

---

## 🔐 Authentication Issues

### Cannot Login with Admin

**Error**: `Invalid credentials`

**Solution**:
1. Check `backend/.env`:
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```
2. Restart backend
3. Use exact credentials (case-sensitive)

---

### Anonymous Login Not Working

**Error**: Anonymous login fails

**Solution**:
1. Check backend logs
2. Verify `/auth/anonymous` endpoint works:
   ```powershell
   curl http://localhost:5000/api/auth/anonymous -X POST
   ```
3. Should return token

---

### Token Expires Too Quickly

**Issue**: Keep getting logged out

**Solution**:
```env
# backend/.env
JWT_EXPIRE=30d  # Change from 7d to 30d
```
Restart backend

---

## 📤 File Upload/Download Issues

### Upload Stalls

**Issue**: Upload never completes

**Solution**:
1. Check file size (must be under limit)
2. Check network connection
3. Check backend logs
4. Try smaller file first

---

### Downloaded File Corrupted

**Issue**: Downloaded file won't open

**Solution**:
1. Check file was uploaded correctly
2. Try re-uploading
3. Check FTP connection
4. Verify file size matches

---

### Cannot Delete File

**Error**: Delete fails silently

**Solution**:
1. Check if file exists
2. Check user permissions
3. Check backend logs
4. Verify you own the file

---

## 🛡️ DOS Testing Issues

### Rate Limit Not Working

**Issue**: Can make unlimited requests

**Solution**:
1. Check rate limiter is applied in `routes/dos.js`
2. Test with rapid clicks
3. Check if using localhost (might bypass in dev)
4. Check logs for "DOS attack blocked" messages

---

### DOS Test Always Fails

**Error**: DOS test returns error

**Solution**:
1. Check authentication token is valid
2. Try lower intensity first
3. Check backend logs
4. Verify endpoint: `POST /api/dos/test`

---

### Metrics Not Updating

**Issue**: DOS metrics stay at zero

**Solution**:
1. Run a DOS test first
2. Refresh the page
3. Check console for errors
4. Verify API call to `/dos/status` works

---

## 🔍 Debugging Tips

### Enable Detailed Logging

**Backend**:
```javascript
// server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend**:
```javascript
// utils/api.js
api.interceptors.request.use(config => {
  console.log('Request:', config);
  return config;
});
```

---

### Check Environment Variables

```powershell
# Backend
cd backend
Get-Content .env

# Frontend
cd frontend
Get-Content .env.local
```

---

### Test API Directly

```powershell
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'
```

---

### Browser DevTools

1. **Network Tab**: Check API requests/responses
2. **Console Tab**: Check for JavaScript errors
3. **Application Tab**: Check cookies/local storage
4. **Sources Tab**: Debug with breakpoints

---

### Check Logs

**Backend Logs**:
```powershell
# View last 50 lines
Get-Content backend\logs\combined.log -Tail 50

# Watch logs in real-time
Get-Content backend\logs\combined.log -Wait
```

**Docker Logs**:
```powershell
docker-compose logs -f backend
docker-compose logs -f vsftpd
```

---

## 🆘 Still Having Issues?

### Checklist

- [ ] Node.js 18+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` files exist and configured
- [ ] Ports 3001 and 5000 not in use
- [ ] Backend running (check http://localhost:5000/api/health)
- [ ] Frontend running (check http://localhost:3001)
- [ ] Docker running (if using Docker)
- [ ] Firewall not blocking ports

### Fresh Start

```powershell
# Stop everything
docker-compose down
# Kill any Node processes

# Clean install
cd backend
Remove-Item -Recurse -Force node_modules, .next, logs, uploads
npm install

cd ../frontend
Remove-Item -Recurse -Force node_modules, .next
npm install

# Start fresh
cd ..
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

---

## 📞 Getting Help

1. **Check Documentation**:
   - README.md
   - QUICKSTART.md
   - API.md

2. **Review Logs**:
   - Backend: `backend/logs/`
   - Browser Console
   - Docker logs

3. **Common Issues**:
   - Most issues are configuration errors
   - Check .env files
   - Verify ports are correct
   - Ensure services are running

4. **Report Bug**:
   - Include error message
   - Include relevant logs
   - Describe steps to reproduce
   - Mention OS and Node.js version

---

**Need more help?** Create an issue with:
- Detailed error message
- Steps to reproduce
- Environment details (OS, Node version, etc.)
- Screenshots if applicable
