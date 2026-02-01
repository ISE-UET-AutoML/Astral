# GenApp Feature Documentation Index

## 📚 Tài liệu

### 1. [README.md](./README.md)
**Mục đích:** API documentation và component usage

**Nội dung:**
- Payload API `/v1/api/pipeline/run`
- AppCard component props và features
- Usage examples
- API response structure

**Đọc khi:** Cần biết cách sử dụng API hoặc component

---

### 2. [API_DEBUG.md](./API_DEBUG.md)
**Mục đích:** Debug guide cho API calls

**Nội dung:**
- URL mapping (frontend → gateway → service)
- cURL commands để test API
- Expected responses
- Common issues & solutions
- Environment variables
- Database checks

**Đọc khi:** API không hoạt động, cần debug

---

### 3. [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
**Mục đích:** Tổng quan implementation

**Nội dung:**
- Cấu trúc files
- Data flow diagram
- Components chi tiết
- URL mapping
- Key features
- Next steps & enhancements

**Đọc khi:** Cần hiểu tổng quan hệ thống

---

### 4. [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
**Mục đích:** QA testing checklist

**Nội dung:**
- Pre-requisites setup
- Test cases chi tiết
- Browser compatibility
- Responsive design tests
- Performance tests
- Acceptance criteria

**Đọc khi:** Cần test feature

---

## 🚀 Quick Start

### Để chạy feature:

1. **Start backend service**
   ```bash
   cd adaptive-model-to-app/backend
   python app.py
   ```

2. **Start frontend**
   ```bash
   cd frontend
   npm start
   ```

3. **Navigate to page**
   ```
   http://localhost:3003/app/project/{projectId}/my-apps
   ```

### Để test API:

```bash
# List apps
curl "http://localhost:8000/v1/api/generated_app/list?project_id={projectId}"

# Gen app (cần payload JSON)
curl -X POST http://localhost:8000/v1/api/pipeline/run \
  -H "Content-Type: application/json" \
  -d '{
    "task": "image_classification",
    "name": "Test App",
    "project_id": "uuid",
    "deploy_id": "123",
    "requirements": "",
    "skip_rent": false,
    "instance_id": null,
    "skip_deploy": false
  }'
```

## 🔧 Troubleshooting Flow

```
Problem
   ↓
Check console logs → [API_DEBUG.md]
   ↓
Check Network tab → [API_DEBUG.md]
   ↓
Test API directly → [API_DEBUG.md]
   ↓
Check backend logs → [API_DEBUG.md]
   ↓
Check database → [API_DEBUG.md]
   ↓
Still not working? → Check [IMPLEMENTATION_SUMMARY.md]
```

## 📝 Code References

### Components
- **Main Page:** `frontend/src/pages/project/genapp/index.jsx`
- **App Card:** `frontend/src/components/GenApp/AppCard.jsx`

### Hooks
- **Fetch Apps:** `frontend/src/hooks/useGenApps.js`

### API
- **API Functions:** `frontend/src/api/deploy.js`
- **Axios Instance:** `frontend/src/api/axios.js`

### Backend
- **Routes:** `adaptive-model-to-app/backend/api/routes/generated_app.py`
- **Schemas:** `adaptive-model-to-app/backend/database/schemas/generated_app.py`

## 🎯 Common Tasks

### Task: Thêm field mới vào AppCard
1. Update backend schema: `database/schemas/generated_app.py`
2. Update database model: `database/models/generated_app.py`
3. Create migration
4. Update AppCard component: `components/GenApp/AppCard.jsx`

### Task: Thêm filter mới
1. Update API route: `api/routes/generated_app.py`
2. Update hook: `hooks/useGenApps.js`
3. Add UI controls in page: `pages/project/genapp/index.jsx`

### Task: Customize status colors
1. Edit `StatusBadge` component in `AppCard.jsx`
2. Update `statusConfig` object

### Task: Add new action button
1. Add button in `AppCard.jsx` actions section
2. Implement handler
3. Update props interface

## 🐛 Known Issues

1. **Pagination not implemented**
   - Currently showing all apps (max 100)
   - TODO: Add pagination UI

2. **Real-time updates not available**
   - Status updates require manual refresh
   - TODO: Implement WebSocket or polling

3. **No delete functionality**
   - Can't delete apps from UI
   - TODO: Add delete button with confirmation

## 📈 Metrics to Monitor

- Page load time
- API response time
- Number of apps per project
- Gen app success rate
- Error rate by error type

## 🔐 Security Considerations

- ✅ Authentication required (via axios interceptor)
- ✅ Project ID validation
- ✅ Deploy ID validation
- ⚠️ TODO: RBAC - Check user permissions
- ⚠️ TODO: Rate limiting for gen app API

## 🎨 Design System

### Colors
- Primary: Blue (#2563eb)
- Success: Green (#16a34a)
- Warning: Yellow (#eab308)
- Error: Red (#dc2626)
- Info: Indigo (#6366f1)

### Typography
- Heading: text-3xl font-bold
- Title: text-lg font-semibold
- Body: text-sm
- Caption: text-xs

### Spacing
- Card gap: gap-6
- Section padding: p-6
- Content spacing: space-y-3

## 📞 Support

Nếu cần hỗ trợ, check theo thứ tự:

1. Console logs
2. API_DEBUG.md
3. TESTING_CHECKLIST.md
4. IMPLEMENTATION_SUMMARY.md
5. README.md

## 🎓 Learning Resources

### Để hiểu về tổng thể:
→ Start with [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

### Để implement tính năng mới:
→ Read [README.md](./README.md) + [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

### Để fix bugs:
→ Use [API_DEBUG.md](./API_DEBUG.md)

### Để test:
→ Follow [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

---

**Last Updated:** 2024-01-29
**Version:** 1.0.0
**Maintainer:** Development Team
