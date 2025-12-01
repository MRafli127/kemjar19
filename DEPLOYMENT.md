# Deployment Guide

## 📦 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository (optional but recommended)

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`

6. Redeploy after setting environment variables:
```bash
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push code to GitHub repository

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your GitHub repository

5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`

7. Click "Deploy"

Note: Local development uses port 3001.

### Post-Deployment

1. Your frontend will be available at: `https://your-project.vercel.app`

2. Update backend CORS settings:
   - Edit `backend/.env`
   - Set `FRONTEND_URL=https://your-project.vercel.app`
   - For local development: `FRONTEND_URL=http://localhost:3001`

## 🖥️ Backend Deployment (Local/On-Premise)

### Option 1: Docker Deployment (Recommended)

1. Install Docker and Docker Compose

2. Create production environment file:
```bash
cp .env.example .env
# Edit .env with production values
```

3. Start services:
```bash
docker-compose up -d
```

4. Check status:
```bash
docker-compose ps
```

5. View logs:
```bash
docker-compose logs -f
```

6. Stop services:
```bash
docker-compose down
```

### Option 2: Direct Node.js Deployment

1. Install Node.js 18+ on your server

2. Clone repository:
```bash
git clone <your-repo-url>
cd KemjarFinpro
```

3. Install dependencies:
```bash
cd backend
npm install
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with production values
```

5. Install PM2 (Process Manager):
```bash
npm install -g pm2
```

6. Start application:
```bash
pm2 start server.js --name ftp-backend
```

7. Configure PM2 to start on boot:
```bash
pm2 startup
pm2 save
```

8. Monitor application:
```bash
pm2 status
pm2 logs ftp-backend
```

### Option 3: Windows Service

1. Install node-windows:
```bash
npm install -g node-windows
```

2. Create service script (`install-service.js`):
```javascript
const Service = require('node-windows').Service;

const svc = new Service({
  name: 'FTP Backend Service',
  description: 'FTP Management Backend Server',
  script: 'C:\\path\\to\\backend\\server.js',
  nodeOptions: ['--harmony', '--max_old_space_size=4096']
});

svc.on('install', () => {
  svc.start();
});

svc.install();
```

3. Install service:
```bash
node install-service.js
```

## 🔒 Production Security Checklist

### Backend Security

- [ ] Change JWT_SECRET to strong random value
- [ ] Change admin password from default
- [ ] Change FTP credentials
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring
- [ ] Regular security updates
- [ ] Backup strategy
- [ ] Configure CORS properly

### Environment Variables (Production)

```env
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<strong-password>
FTP_PASSWORD=<strong-password>
FRONTEND_URL=https://your-frontend-domain.com
```

### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🌐 Network Configuration

### Firewall Rules

Allow the following ports:
- Port 5000: Backend API (or your configured port)
- Port 21: FTP control
- Ports 21000-21010: FTP passive mode

### Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### SSL/TLS Certificate

Using Let's Encrypt:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## 📊 Monitoring & Maintenance

### Log Files Location

- Backend logs: `backend/logs/`
- FTP logs: Check Docker logs or system logs
- Application logs: `logs/combined.log` and `logs/error.log`

### Monitor Application

```bash
# Check Docker containers
docker-compose ps

# View logs
docker-compose logs -f backend

# Check resource usage
docker stats
```

### Backup Strategy

1. Database backups (if using database)
2. Uploaded files: `backend/uploads/`
3. FTP data: `ftp-data/`
4. Configuration files: `.env`
5. Log files (optional)

### Update Application

```bash
# Pull latest changes
git pull origin main

# Backend updates
cd backend
npm install
pm2 restart ftp-backend

# Or with Docker
docker-compose down
docker-compose build
docker-compose up -d
```

## 🐛 Troubleshooting

### Backend won't start

1. Check logs: `pm2 logs` or `docker-compose logs backend`
2. Verify .env file exists and is properly configured
3. Check port 5000 is not in use: `netstat -ano | findstr :5000`
4. Verify Node.js version: `node --version`

### FTP connection issues

1. Check FTP service: `docker-compose ps vsftpd`
2. Verify FTP credentials in .env
3. Test FTP connection: Use FileZilla or command line FTP client
4. Check firewall allows FTP ports

### CORS errors

1. Verify FRONTEND_URL in backend .env matches your frontend URL
2. Check backend CORS configuration
3. Ensure frontend is making requests to correct API URL

### Rate limiting blocking legitimate traffic

1. Adjust rate limit in `backend/routes/dos.js`
2. Implement IP whitelisting for trusted sources
3. Use Redis for distributed rate limiting (advanced)

## 📞 Support

For issues and questions:
- Check logs first
- Review configuration
- Check firewall and network settings
- Verify all environment variables are set correctly

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /path/to/app
            git pull
            cd backend
            npm install
            pm2 restart ftp-backend
```

## ✅ Post-Deployment Checklist

- [ ] Application is accessible from internet
- [ ] HTTPS is working (if configured)
- [ ] Login with default credentials works
- [ ] File upload/download works
- [ ] DOS testing works
- [ ] Rate limiting is active
- [ ] Logs are being generated
- [ ] Backups are configured
- [ ] Monitoring is active
- [ ] Changed all default passwords
- [ ] Updated CORS settings
- [ ] Documentation is updated with actual URLs