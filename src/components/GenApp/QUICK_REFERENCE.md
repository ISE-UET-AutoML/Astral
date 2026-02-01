# 📋 GenApp - Quick Reference Card

## 🚀 Start Services

```bash
# Backend
cd adaptive-model-to-app/backend && python app.py

# Frontend  
cd frontend && npm start
```

## 🔗 URLs

| Type | URL |
|------|-----|
| Frontend Page | `http://localhost:3003/app/project/{projectId}/my-apps` |
| Backend Service | `http://localhost:8000` |
| API Gateway | `http://localhost:8080` |
| Health Check | `http://localhost:8000/v1/api/health` |

## 📡 API Endpoints

### List Apps
```bash
GET /v1/api/generated_app/list?project_id={projectId}

# cURL
curl "http://localhost:8000/v1/api/generated_app/list?project_id=xxx"
```

### Gen App
```bash
POST /v1/api/pipeline/run

# cURL
curl -X POST http://localhost:8000/v1/api/pipeline/run \
  -H "Content-Type: application/json" \
  -d '{
    "task": "image_classification",
    "name": "My App",
    "project_id": "uuid",
    "deploy_id": "123",
    "requirements": "",
    "skip_rent": false,
    "instance_id": null,
    "skip_deploy": false
  }'
```

## 📂 Key Files

| File | Purpose |
|------|---------|
| `pages/project/genapp/index.jsx` | Main page |
| `components/GenApp/AppCard.jsx` | App card component |
| `hooks/useGenApps.js` | Fetch apps hook |
| `api/deploy.js` | API functions |

## 🎨 Component Props

### AppCard
```jsx
<AppCard 
  app={{
    id, name, status, task_type, 
    deploy_id, created_at, instance_id,
    host, ports, error_message
  }}
  onViewDetails={(app) => { ... }}
/>
```

## 🎯 Status Values

| Status | Color | Meaning |
|--------|-------|---------|
| `pending` | Yellow | Queued |
| `running` | Blue | In progress |
| `generating` | Purple | Generating code |
| `generated` | Indigo | Code ready |
| `deploying` | Orange | Deploying |
| `deployed` | Green | Live |
| `completed` | Green | Done |
| `failed` | Red | Error |

## 🔧 Task Types

| Type | Value | Icon |
|------|-------|------|
| Image Classification | `image_classification` | 🖼️ Image |
| Object Detection | `object_detection` | 📦 Box |
| Text Classification | `text_classification` | 📝 Text |

## 🐛 Debug Commands

```bash
# Check backend running
curl http://localhost:8000/v1/api/health

# Check gateway
curl http://localhost:8080/api/service/adaptive_model_to_app/health

# Test API
curl "http://localhost:8000/v1/api/generated_app/list"

# Check database
psql -h localhost -U postgres -d adaptive_db
SELECT * FROM generated_apps;
```

## 📊 Console Logs

```javascript
// Hook logs
[useGenApps] Raw response: {...}
[useGenApps] Found items array: X apps

// Component logs  
View details for app: {...}
```

## ⚡ Common Commands

```bash
# Install dependencies
cd frontend && npm install

# Run frontend
npm start

# Run backend
cd adaptive-model-to-app/backend && python app.py

# Check env vars
echo $REACT_APP_API_URL

# View logs
tail -f backend.log
```

## 🎨 Style Classes

```jsx
// Status badge
className="px-2.5 py-0.5 rounded-full text-xs"

// Card
className="rounded-2xl shadow-lg hover:shadow-xl"

// Button
className="bg-blue-600 hover:bg-blue-700 text-white"

// Grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
```

## 🔐 Auth Headers

```javascript
// Auto-added by axios interceptor
headers: {
  'Authorization': 'Bearer {token}',
  'x-user-id': '{userId}'
}
```

## 📦 Response Format

```javascript
// List Apps Response
{
  items: [
    {
      id: "uuid",
      name: "App Name",
      status: "deployed",
      task_type: "image_classification",
      deploy_id: "123",
      ports: { frontend: 8501 },
      created_at: "2024-01-15T10:30:00Z"
    }
  ],
  total: 1
}
```

## 🎯 Payload Format

```javascript
// Gen App Payload
{
  task: "image_classification",
  name: "My App",
  project_id: "uuid",
  deploy_id: "123",
  requirements: "",
  skip_rent: false,
  instance_id: null,
  skip_deploy: false
}
```

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Apps not showing | Check response format: `data.items` |
| CORS error | Check backend CORS config |
| 404 error | Check service running |
| Empty list | Check project_id filter |
| Can't gen app | Check deploy_id exists |

## 📚 Documentation Files

| File | When to Read |
|------|-------------|
| `README.md` | API & component docs |
| `API_DEBUG.md` | Debugging API issues |
| `IMPLEMENTATION_SUMMARY.md` | Understanding system |
| `TESTING_CHECKLIST.md` | Testing the feature |
| `FLOW_DIAGRAM.md` | Visual flows |
| `QUICK_REFERENCE.md` | Quick lookup (this file) |

## 💡 Useful Snippets

### Parse response
```javascript
if (data?.items) {
  setApps(data.items);
}
```

### Format date
```javascript
new Date(dateStr).toLocaleString('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})
```

### Build app URL
```javascript
const url = `http://${app.host}:${app.ports.frontend}`;
window.open(url, '_blank');
```

## 🎨 Color Palette

```css
/* Primary */
--blue-600: #2563eb
--blue-700: #1d4ed8

/* Status Colors */
--yellow: #eab308  /* pending */
--blue: #3b82f6    /* running */
--purple: #a855f7  /* generating */
--indigo: #6366f1  /* generated */
--orange: #f97316  /* deploying */
--green: #16a34a   /* deployed/completed */
--red: #dc2626     /* failed */
```

## ⚙️ Environment Variables

```bash
# Frontend
REACT_APP_API_URL=http://localhost:8080

# Backend
POSTGRES_CONN_URL=postgresql://user:pass@localhost/adaptive_db
PORT=8000
```

## 🎯 Key Functions

```javascript
// Fetch apps
useGenApps(projectId)

// Gen app
genApp({ deployId, projectId, name, taskType })

// Get deploys
getAllDeployedModel(projectId)

// Refetch
refetch()
```

## 📱 Responsive Breakpoints

| Breakpoint | Grid Columns |
|------------|--------------|
| < 640px (mobile) | 1 |
| 640px - 1024px (tablet) | 2 |
| 1024px - 1280px (desktop) | 3 |
| > 1280px (large) | 4 |

## 🔥 Hot Keys

| Key | Action |
|-----|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + /` | Toggle dark mode |
| `Esc` | Close modal |

---

**💡 Tip:** Bookmark this page for quick reference!

**📖 Full Docs:** See `INDEX.md` for all documentation files
