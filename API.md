# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error or user already exists
- `500` - Server error

---

### 2. Login

**POST** `/auth/login`

Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Validation error
- `401` - Invalid credentials
- `500` - Server error

---

### 3. Anonymous Login

**POST** `/auth/anonymous`

Login as anonymous user (guest access).

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "anon_1234567890",
    "role": "anonymous"
  }
}
```

**Status Codes:**
- `200` - Anonymous login successful
- `500` - Server error

---

### 4. Verify Token

**GET** `/auth/verify`

Verify if current token is valid.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "role": "admin",
    "iat": 1234567890,
    "exp": 1234567890
  }
}
```

**Status Codes:**
- `200` - Token valid
- `401` - Token invalid or expired
- `500` - Server error

---

## 📁 FTP Endpoints

All FTP endpoints require authentication.

### 1. Upload File

**POST** `/ftp/upload`

Upload a file to the FTP server.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <file-data>
```

**Response:**
```json
{
  "success": true,
  "file": {
    "originalName": "document.pdf",
    "filename": "1234567890-document.pdf",
    "size": 102400,
    "path": "/uploads/username/1234567890-document.pdf",
    "uploadedBy": "username",
    "uploadedAt": "2024-01-01T12:00:00.000Z",
    "ftpPath": "/username/1234567890-document.pdf"
  }
}
```

**Status Codes:**
- `200` - Upload successful
- `400` - No file uploaded
- `401` - Unauthorized
- `500` - Upload failed

---

### 2. List Files

**GET** `/ftp/files`

Get list of all files uploaded by current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "filename": "1234567890-document.pdf",
      "size": 102400,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "modifiedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### 3. Download File

**GET** `/ftp/download/:filename`

Download a specific file.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `filename` (path) - Name of the file to download

**Response:**
Binary file data with appropriate headers

**Status Codes:**
- `200` - Download successful
- `401` - Unauthorized
- `404` - File not found
- `500` - Download failed

---

### 4. Delete File

**DELETE** `/ftp/files/:filename`

Delete a specific file.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `filename` (path) - Name of the file to delete

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

**Status Codes:**
- `200` - Delete successful
- `401` - Unauthorized
- `404` - File not found
- `500` - Delete failed

---

### 5. Test FTP Connection

**GET** `/ftp/test-connection`

Test connection to FTP server.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "FTP connection successful",
  "files": 5
}
```

**Status Codes:**
- `200` - Connection successful
- `401` - Unauthorized
- `500` - Connection failed

---

## 🛡️ DOS Testing Endpoints

All DOS endpoints require authentication.

### 1. Run DOS Test

**POST** `/dos/test`

Run a DOS attack simulation with specified intensity.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "intensity": "medium",
  "duration": 1000
}
```

**Parameters:**
- `intensity` (optional) - Attack intensity: `"low"`, `"medium"`, or `"high"`. Default: `"low"`
- `duration` (optional) - Duration in milliseconds. Default: `1000`

**Response:**
```json
{
  "success": true,
  "message": "DOS test completed",
  "metrics": {
    "intensity": "medium",
    "duration": 1000,
    "totalRequests": 150,
    "blockedRequests": 50,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

**Rate Limit:** 100 requests per minute

**Status Codes:**
- `200` - Test completed successfully
- `401` - Unauthorized
- `429` - Rate limit exceeded (DOS protection triggered)
- `500` - Test failed

---

### 2. Get DOS Status

**GET** `/dos/status`

Get current DOS protection metrics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "metrics": {
    "totalRequests": 1500,
    "blockedRequests": 250,
    "activeAttacks": 0,
    "lastAttackTime": "2024-01-01T12:00:00.000Z",
    "rateLimitConfig": {
      "windowMs": "1 minute",
      "maxRequests": 100
    },
    "protectionActive": true
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### 3. Run Stress Test

**POST** `/dos/stress-test`

Run a stress test with multiple concurrent requests.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "requests": 50,
  "concurrent": 10
}
```

**Parameters:**
- `requests` (optional) - Total number of requests. Default: `10`
- `concurrent` (optional) - Number of concurrent requests. Default: `5`

**Response:**
```json
{
  "success": true,
  "results": {
    "total": 50,
    "successful": 50,
    "failed": 0,
    "avgResponseTime": 125.5,
    "startTime": 1234567890,
    "totalTime": 2500
  }
}
```

**Status Codes:**
- `200` - Test completed
- `401` - Unauthorized
- `500` - Test failed

---

### 4. Reset Metrics

**POST** `/dos/reset-metrics`

Reset DOS protection metrics. Admin only.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Metrics reset successfully"
}
```

**Status Codes:**
- `200` - Reset successful
- `401` - Unauthorized
- `403` - Forbidden (admin only)

---

## 🏥 Health Check

### Health Check

**GET** `/health`

Check if server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Server is running

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Error Codes

- `400` - Bad Request (validation error, missing parameters)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Rate Limiting

DOS testing endpoints are rate-limited to 100 requests per minute per IP address. When the limit is exceeded:

```json
{
  "success": false,
  "error": "Rate limit exceeded - Potential DOS attack detected",
  "blocked": true,
  "blockedCount": 10
}
```

---

## Example Usage

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Upload File
```bash
curl -X POST http://localhost:5000/api/ftp/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

#### List Files
```bash
curl -X GET http://localhost:5000/api/ftp/files \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Run DOS Test
```bash
curl -X POST http://localhost:5000/api/dos/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"intensity":"medium"}'
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Login
const login = async () => {
  const { data } = await api.post('/auth/login', {
    username: 'admin',
    password: 'admin123'
  });
  
  // Store token
  localStorage.setItem('token', data.token);
  
  // Add to headers
  api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
};

// Upload file
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await api.post('/ftp/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return data;
};

// Get files
const getFiles = async () => {
  const { data } = await api.get('/ftp/files');
  return data.files;
};

// Run DOS test
const runDosTest = async () => {
  const { data } = await api.post('/dos/test', {
    intensity: 'medium'
  });
  return data;
};
```

---

## Security Notes

1. **Always use HTTPS in production** to protect tokens and sensitive data
2. **Never share JWT tokens** - they provide full access to user accounts
3. **Tokens expire after 7 days** (configurable via JWT_EXPIRE env variable)
4. **Rate limiting is IP-based** - use X-Forwarded-For header if behind proxy
5. **File uploads are limited** to MAX_FILE_SIZE (default 10MB)
6. **Anonymous users have limited access** - 1 hour token expiry

---

## WebSocket Support (Future Enhancement)

Currently not implemented. Future versions may include:
- Real-time file upload progress
- Live DOS attack monitoring
- Real-time notifications

---

## Versioning

Current API Version: `v1`

Future versions may use path-based versioning: `/api/v2/endpoint`

---

## Support

For API issues or questions:
1. Check this documentation
2. Review error messages in response
3. Check server logs
4. Verify authentication token is valid
5. Ensure request format matches specification
