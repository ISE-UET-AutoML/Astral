# GenApp Implementation Summary

## 🎯 Mục đích

Trang Gen App cho phép user:
1. Chọn một deployment có sẵn
2. Tạo web application từ deployment đó
3. Xem danh sách các apps đã được generate
4. Truy cập các apps đã deploy

## 📁 Cấu trúc Files

```
frontend/src/
├── pages/project/genapp/
│   └── index.jsx              # Main page component
├── components/GenApp/
│   ├── AppCard.jsx            # Card component hiển thị app
│   ├── README.md              # API & component documentation
│   ├── API_DEBUG.md           # Debug guide
│   └── IMPLEMENTATION_SUMMARY.md  # File này
├── hooks/
│   └── useGenApps.js          # Hook để fetch danh sách apps
└── api/
    └── deploy.js              # API functions
```

## 🔄 Data Flow

### 1. Page Load
```
User visits → /app/project/{projectId}/my-apps
         ↓
useParams() extracts projectId
         ↓
useGenApps(projectId) hook được gọi
         ↓
Hook gọi getGenAppsList(projectId)
         ↓
API call: GET /api/service/adaptive_model_to_app/generated_app/list?project_id={projectId}
         ↓
Backend response: { items: [...], total: number }
         ↓
Hook parse data.items → setApps()
         ↓
Component render danh sách AppCard
```

### 2. Gen App Flow
```
User clicks "Gen App"
         ↓
Modal opens (nhập name, chọn deploy, xem task type)
         ↓
User clicks "Confirm"
         ↓
handleConfirmGenApp() được gọi
         ↓
genApp({ deployId, projectId, name, taskType })
         ↓
API call: POST /api/service/adaptive_model_to_app/pipeline/run
Payload: {
  task: "image_classification",
  name: "My App",
  project_id: "uuid",
  deploy_id: "123",
  requirements: "",
  skip_rent: false,
  instance_id: null,
  skip_deploy: false
}
         ↓
Backend starts pipeline (rent → generate → deploy)
         ↓
Success message
         ↓
refetch() để load lại danh sách apps
```

## 🎨 Components

### ProjectGenApp (Main Page)
- **Location:** `frontend/src/pages/project/genapp/index.jsx`
- **State:**
  - `apps`: Danh sách apps (từ useGenApps hook)
  - `deploys`: Danh sách deployments
  - `selectedDeployId`: Deploy được chọn
  - `appName`: Tên app mới
  - `isFormOpen`: Show/hide modal
  - `genLoading`: Loading state khi gen app

### AppCard
- **Location:** `frontend/src/components/GenApp/AppCard.jsx`
- **Props:**
  ```typescript
  {
    app: GeneratedApp,
    onViewDetails?: (app) => void
  }
  ```
- **Features:**
  - Status badge với màu sắc theo trạng thái
  - Task type icon
  - Instance info (nếu có)
  - Open App button (mở deployed app)
  - Details button
  - Error message display
  - Dark mode support

## 🔌 API Endpoints

### 1. GET /v1/api/generated_app/list
**Mục đích:** Lấy danh sách apps đã generate

**Query Params:**
- `project_id` (optional): Filter theo project
- `task_type` (optional): Filter theo task type
- `status` (optional): Filter theo status
- `deploy_id` (optional): Filter theo deploy
- `limit` (optional, default: 100)
- `offset` (optional, default: 0)

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "App Name",
      "status": "deployed",
      "task_type": "image_classification",
      "deploy_id": "123",
      "project_id": "uuid",
      "run_id": "uuid",
      "instance_id": 12345,
      "host": "1.2.3.4",
      "ports": {
        "frontend": 8501,
        "server": 8000,
        "ssh": 22,
        "minio": 9000
      },
      "created_at": "2024-01-15T10:30:00Z",
      "error_message": null
    }
  ],
  "total": 1
}
```

### 2. POST /v1/api/pipeline/run
**Mục đích:** Trigger pipeline tạo app mới

**Payload:**
```json
{
  "task": "image_classification",
  "name": "My App",
  "project_id": "uuid",
  "deploy_id": "123",
  "requirements": "",
  "skip_rent": false,
  "instance_id": null,
  "skip_deploy": false
}
```

**Response:**
```json
{
  "run_id": "uuid",
  "status": "pending",
  "message": "Pipeline started"
}
```

## 🔍 URL Mapping

### Frontend URL
```
http://localhost:3003/app/project/{projectId}/my-apps
```

### API Calls (via Gateway)
```
GET  http://localhost:8080/api/service/adaptive_model_to_app/generated_app/list?project_id={projectId}
POST http://localhost:8080/api/service/adaptive_model_to_app/pipeline/run
```

### Direct Service URLs
```
GET  http://localhost:8000/v1/api/generated_app/list?project_id={projectId}
POST http://localhost:8000/v1/api/pipeline/run
```

## 🐛 Debug Tips

### 1. Check console logs
```javascript
// Hook logs khi fetch apps
[useGenApps] Raw response: {...}
[useGenApps] Found items array: 3 apps

// Component logs khi view details
View details for app: {...}
```

### 2. Check Network tab
- Request URL: `{API_BASE_URL}/api/service/adaptive_model_to_app/generated_app/list`
- Query String: `?project_id=xxx`
- Response format: `{ items: [], total: number }`

### 3. Test API directly
```bash
# Test với cURL
curl "http://localhost:8000/v1/api/generated_app/list?project_id=20d9848a-30e9-4e0e-ba02-020409086ebd"
```

### 4. Common Issues

**Issue:** Apps không hiển thị
- ✅ Check response format: `data.items` not `data`
- ✅ Check projectId có đúng không
- ✅ Check backend service đang chạy

**Issue:** CORS Error
- ✅ Check backend CORS config
- ✅ Check gateway routing

**Issue:** 404 Not Found
- ✅ Check service đang chạy: `curl http://localhost:8000/v1/api/health`
- ✅ Check gateway routing

## ✨ Key Features

### Status Management
8 trạng thái với màu sắc riêng:
- `pending` - Vàng
- `running` - Xanh dương
- `generating` - Tím
- `generated` - Indigo
- `deploying` - Cam
- `deployed` - Xanh lá
- `completed` - Xanh lá
- `failed` - Đỏ

### Task Types
3 loại task với icon riêng:
- `image_classification` - Icon hình ảnh
- `object_detection` - Icon hình vuông + vòng tròn
- `text_classification` - Icon text lines

### Dark Mode
- Tất cả components support dark mode
- Colors tự động thay đổi theo theme
- Gradients và shadows điều chỉnh

### Responsive
- Grid layout: 1 col (mobile) → 4 cols (desktop)
- Cards responsive với hover effects
- Modal responsive

## 🚀 Next Steps

### Possible Enhancements
1. **Pagination** - Thêm pagination cho danh sách apps
2. **Filtering** - UI để filter theo status, task type
3. **Sorting** - Sort theo created_at, name, status
4. **Search** - Tìm kiếm theo tên app
5. **Details Page** - Trang chi tiết cho mỗi app
6. **Edit App** - Chỉnh sửa app config
7. **Delete App** - Xóa app
8. **Real-time Updates** - WebSocket để update status real-time
9. **Pipeline Status** - Show chi tiết progress của pipeline
10. **Logs Viewer** - Xem logs của pipeline

### Code Improvements
1. Add TypeScript types
2. Add unit tests
3. Add integration tests
4. Error boundary
5. Loading skeletons
6. Optimistic updates
7. Cache management với React Query

## 📝 Notes

- Hook `useGenApps` đã được fix để parse `data.items` chính xác
- AppCard component đã được tách ra để dễ maintain
- Console logs đã được thêm để debug dễ dàng
- Documentation đầy đủ cho API và components
