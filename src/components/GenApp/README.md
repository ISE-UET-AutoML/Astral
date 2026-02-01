# GenApp Component Documentation

## API Endpoints

### 1. Tạo App mới - POST `/v1/api/pipeline/run`

**Endpoint qua Gateway:**
```
POST {API_BASE_URL}/api/service/adaptive_model_to_app/pipeline/run
```

**Direct endpoint (adaptive-model-to-app service):**
```
POST http://localhost:8000/v1/api/pipeline/run
```

### Payload Structure
```javascript
{
  task: string,              // Loại task ML: "image_classification" | "object_detection" | "text_classification"
  name: string | null,       // Tên của app (optional)
  project_id: string | null, // ID của project (optional)
  deploy_id: string,         // ID của deployment (required)
  requirements: string,      // Custom requirements (optional, default: "")
  skip_rent: boolean,        // Bỏ qua bước thuê GPU instance (default: false)
  instance_id: string | null,// ID instance có sẵn (nếu skip_rent = true)
  skip_deploy: boolean       // Bỏ qua bước deploy (default: false)
}
```

### Ví dụ Payload trong code

```javascript
// File: frontend/src/api/deploy.js
const genApp = ({ deployId, projectId, name, taskType }) => {
    const payload = {
        task: taskType || "image_classification",
        name: name || null,
        project_id: projectId || null,
        deploy_id: String(deployId),
        requirements: "",
        skip_rent: false,
        instance_id: null,
        skip_deploy: false,
    };

    return instance.post(`${ADAPTIVE_URL}/pipeline/run`, payload);
};
```

### Cách sử dụng trong Component

```javascript
// File: frontend/src/pages/project/genapp/index.jsx
const handleConfirmGenApp = async () => {
    if (!selectedDeployId) {
        message.error('Please select a deploy')
        return
    }

    setGenLoading(true)
    try {
        await genApp({
            deployId: selectedDeployId,
            projectId,
            name: appName,
            taskType: resolveTaskType(), // "image_classification" | "object_detection" | "text_classification"
        })
        message.success('Gen app successfully')
        refetch()
        setIsFormOpen(false)
        setAppName('')
    } catch (e) {
        message.error('Gen app failed')
    } finally {
        setGenLoading(false)
    }
}
```

## AppCard Component

### Props

```typescript
interface AppCardProps {
  app: {
    id: string | number
    name?: string
    status?: 'pending' | 'running' | 'generating' | 'generated' | 'deploying' | 'deployed' | 'completed' | 'failed'
    task_type?: string
    deploy_id?: string | number
    created_at?: string
    instance_id?: string
    host?: string
    ports?: {
      frontend?: number
      server?: number
      ssh?: number
      minio?: number
    }
    error_message?: string
  }
  onViewDetails?: (app: any) => void
}
```

### Features

1. **Status Badge** - Hiển thị trạng thái hiện tại với màu sắc tương ứng:
   - `pending` - Vàng
   - `running` - Xanh dương
   - `generating` - Tím
   - `generated` - Indigo
   - `deploying` - Cam
   - `deployed` / `completed` - Xanh lá
   - `failed` - Đỏ

2. **Task Type Icon** - Icon tự động theo loại task:
   - Object Detection - Icon hình vuông với vòng tròn
   - Text Classification - Icon text lines
   - Image Classification - Icon hình ảnh (default)

3. **Instance Info** - Hiển thị thông tin instance nếu có:
   - Instance ID (8 ký tự đầu)
   - Port frontend

4. **Action Buttons**:
   - **Open App** - Mở ứng dụng deployed trong tab mới (chỉ hiển thị khi có URL)
   - **Details** - Xem chi tiết (callback từ parent component)

5. **Error Display** - Hiển thị error message nếu có lỗi

### Usage Example

```jsx
import AppCard from 'src/components/GenApp/AppCard'

function MyAppsPage() {
  const { apps } = useGenApps(projectId)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {apps.map((app) => (
        <AppCard 
          key={app.id}
          app={app}
          onViewDetails={(app) => {
            // Handle view details
            navigate(`/apps/${app.id}`)
          }}
        />
      ))}
    </div>
  )
}
```

## Pipeline Flow

1. **User Action**: Chọn deploy → Nhập tên app → Click "Gen App"
2. **API Call**: POST `/v1/api/pipeline/run` với payload
3. **Response**: Nhận `run_id`
4. **Background Process**:
   - Rent GPU instance (nếu không skip)
   - Generate code cho app (song song với rent)
   - Deploy lên Vast.ai
5. **Status Tracking**: Có thể gọi `GET /v1/api/pipeline/status/{run_id}` để theo dõi
6. **Result**: App được lưu vào database và hiển thị trong danh sách

## API Response Structure

### 2. Lấy danh sách apps - GET `/v1/api/generated_app/list`

**Endpoint qua Gateway:**
```
GET {API_BASE_URL}/api/service/adaptive_model_to_app/generated_app/list?project_id={projectId}
```

**Direct endpoint:**
```
GET http://localhost:8000/v1/api/generated_app/list?project_id={projectId}
```

**Query Parameters:**
- `project_id` (optional): Filter theo project
- `task_type` (optional): Filter theo loại task
- `status` (optional): Filter theo trạng thái
- `deploy_id` (optional): Filter theo deploy ID
- `limit` (optional): Số lượng kết quả (default: 100)
- `offset` (optional): Offset cho pagination (default: 0)

**Response Format:**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "My Image Classifier",
      "status": "deployed",
      "task_type": "image_classification",
      "deploy_id": "123",
      "project_id": "456",
      "run_id": "uuid",
      "instance_id": 12345,
      "host": "1.2.3.4",
      "ports": {
        "frontend": 8501,
        "server": 8000,
        "ssh": 22,
        "minio": 9000
      },
      "requirements": "",
      "model_api_endpoint": null,
      "s3_uri": null,
      "version": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "error_message": null
    }
  ],
  "total": 1
}
```

**Lưu ý:**
- Response trả về object `{ items: [], total: number }`, KHÔNG phải array trực tiếp
- Frontend cần parse `data.items` để lấy danh sách apps

## Dark Mode Support

AppCard hỗ trợ đầy đủ dark mode với:
- Gradient backgrounds cho icons
- Border colors tương thích
- Text colors tự động thay đổi
- Status badges có variant cho dark mode
