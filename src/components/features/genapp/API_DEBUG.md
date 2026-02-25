# API Debug Guide

## URL Mapping

Khi truy cập trang:
```
http://localhost:3003/app/project/20d9848a-30e9-4e0e-ba02-020409086ebd/my-apps
```

Frontend sẽ gọi API:

### 1. Lấy danh sách apps
```
GET {API_BASE_URL}/api/service/adaptive_model_to_app/generated_app/list?project_id=20d9848a-30e9-4e0e-ba02-020409086ebd
```

Nếu `API_BASE_URL = http://localhost:8080` (gateway), URL đầy đủ sẽ là:
```
http://localhost:8080/api/service/adaptive_model_to_app/generated_app/list?project_id=20d9848a-30e9-4e0e-ba02-020409086ebd
```

Gateway sẽ forward request đến adaptive-model-to-app service:
```
http://localhost:8000/v1/api/generated_app/list?project_id=20d9848a-30e9-4e0e-ba02-020409086ebd
```

## Test API với cURL

### Test trực tiếp với adaptive-model-to-app service

```bash
# Lấy danh sách tất cả apps
curl -X GET "http://localhost:8000/v1/api/generated_app/list"

# Lấy danh sách apps của 1 project
curl -X GET "http://localhost:8000/v1/api/generated_app/list?project_id=20d9848a-30e9-4e0e-ba02-020409086ebd"

# Filter theo status
curl -X GET "http://localhost:8000/v1/api/generated_app/list?project_id=20d9848a-30e9-4e0e-ba02-020409086ebd&status=deployed"

# Filter theo deploy_id
curl -X GET "http://localhost:8000/v1/api/generated_app/list?deploy_id=123"
```

### Test qua Gateway

```bash
# Qua gateway (cần có authentication token nếu gateway yêu cầu)
curl -X GET "http://localhost:8080/api/service/adaptive_model_to_app/generated_app/list?project_id=20d9848a-30e9-4e0e-ba02-020409086ebd" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Expected Response

### Success Response (200 OK)

```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Image Classifier App",
      "project_id": "20d9848a-30e9-4e0e-ba02-020409086ebd",
      "deploy_id": "123",
      "task_type": "image_classification",
      "requirements": "",
      "model_api_endpoint": null,
      "version": 1,
      "run_id": "660e8400-e29b-41d4-a716-446655440001",
      "instance_id": 12345,
      "host": "123.45.67.89",
      "ports": {
        "frontend": 8501,
        "server": 8000,
        "ssh": 22,
        "minio": 9000
      },
      "s3_uri": null,
      "status": "deployed",
      "error_message": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

### Empty Response (200 OK)

```json
{
  "items": [],
  "total": 0
}
```

## Frontend Code Flow

### 1. Component Load
```javascript
// frontend/src/pages/project/genapp/index.jsx
const { id: projectId } = useParams() // "20d9848a-30e9-4e0e-ba02-020409086ebd"
const { apps, loading, error, refetch } = useGenApps(projectId)
```

### 2. Hook Fetch
```javascript
// frontend/src/hooks/useGenApps.js
const { data } = await getGenAppsList(projectId)
// data = { items: [...], total: 1 }
setApps(data.items)
```

### 3. API Call
```javascript
// frontend/src/api/deploy.js
const getGenAppsList = (projectId) => {
    const params = projectId ? { project_id: projectId } : {};
    return instance.get(`${ADAPTIVE_URL}/generated_app/list`, { params });
};
```

### 4. Axios Instance
```javascript
// instance.get() sẽ gọi:
// URL: {API_BASE_URL}/api/service/adaptive_model_to_app/generated_app/list
// Params: { project_id: "20d9848a-30e9-4e0e-ba02-020409086ebd" }
// Final URL: http://localhost:8080/api/service/adaptive_model_to_app/generated_app/list?project_id=20d9848a-30e9-4e0e-ba02-020409086ebd
```

## Common Issues & Solutions

### Issue 1: Apps không hiển thị

**Nguyên nhân:** Response format không đúng, hook parse sai

**Giải pháp:**
- Check response trong Network tab của browser
- Đảm bảo backend trả về `{ items: [], total: number }`
- Hook đã được fix để parse `data.items`

### Issue 2: CORS Error

**Nguyên nhân:** Backend chưa config CORS

**Giải pháp:**
```python
# adaptive-model-to-app/backend/app.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 3: 404 Not Found

**Nguyên nhân:** Gateway chưa route đúng hoặc service không chạy

**Kiểm tra:**
```bash
# Check adaptive-model-to-app service
curl http://localhost:8000/v1/api/health

# Check gateway routing
curl http://localhost:8080/api/service/adaptive_model_to_app/health
```

### Issue 4: Empty list nhưng đã có apps trong DB

**Nguyên nhân:** Filter sai project_id hoặc DB query có vấn đề

**Debug:**
```bash
# Test không filter
curl http://localhost:8000/v1/api/generated_app/list

# Test với project_id khác
curl "http://localhost:8000/v1/api/generated_app/list?project_id=test-123"
```

## Environment Variables

Đảm bảo frontend có biến môi trường đúng:

```bash
# frontend/.env
REACT_APP_API_URL=http://localhost:8080
```

Khi chạy dev:
```bash
cd frontend
npm start
# Hoặc
yarn dev
```

## Backend Service Check

```bash
# Check service đang chạy
cd adaptive-model-to-app/backend
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Hoặc
python app.py
```

## Database Check

```bash
# Connect to PostgreSQL
psql -h localhost -U postgres -d adaptive_db

# Check table
SELECT * FROM generated_apps WHERE project_id = '20d9848a-30e9-4e0e-ba02-020409086ebd';

# Check all apps
SELECT id, name, project_id, deploy_id, status, created_at FROM generated_apps;
```
