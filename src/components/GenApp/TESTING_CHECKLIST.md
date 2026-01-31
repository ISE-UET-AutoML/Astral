# Testing Checklist - GenApp Feature

## ✅ Pre-requisites

### Backend Services
- [ ] adaptive-model-to-app service đang chạy trên port 8000
  ```bash
  cd adaptive-model-to-app/backend
  python app.py
  # hoặc
  uvicorn app:app --host 0.0.0.0 --port 8000 --reload
  ```

- [ ] Database đã được setup và có dữ liệu
  ```bash
  # Check database connection
  psql -h localhost -U postgres -d adaptive_db
  # Check table
  \dt generated_apps
  ```

- [ ] Gateway đang chạy (nếu có)
  ```bash
  # Test gateway health
  curl http://localhost:8080/health
  ```

### Frontend Setup
- [ ] Environment variables đã được set
  ```bash
  # frontend/.env
  REACT_APP_API_URL=http://localhost:8080
  ```

- [ ] Dependencies đã được install
  ```bash
  cd frontend
  npm install
  # hoặc
  yarn install
  ```

- [ ] Frontend đang chạy
  ```bash
  npm start
  # hoặc
  yarn dev
  ```

## 🧪 Test Cases

### 1. Page Load & Display

#### Test 1.1: Navigate to GenApp page
- [ ] Navigate to `/app/project/{projectId}/my-apps`
- [ ] Page loads without errors
- [ ] Header hiển thị "My Apps"
- [ ] Counter hiển thị số lượng apps đúng

#### Test 1.2: Empty state
- [ ] Nếu chưa có apps, hiển thị empty state với icon
- [ ] Message: "You haven't generated any apps yet"
- [ ] Không có lỗi console

#### Test 1.3: Loading state
- [ ] Khi đang load, hiển thị "Loading..."
- [ ] Loading card có styling đúng

#### Test 1.4: Error state
- [ ] Nếu API error, hiển thị error message
- [ ] Error card có background đỏ
- [ ] Error message rõ ràng

### 2. Apps List Display

#### Test 2.1: Apps grid
- [ ] Apps hiển thị dạng grid
- [ ] Responsive: 1 col (mobile) → 4 cols (desktop)
- [ ] Cards có spacing đều nhau

#### Test 2.2: AppCard content
- [ ] Tên app hiển thị đúng (hoặc fallback "App #ID")
- [ ] Status badge hiển thị với màu đúng
- [ ] Task type icon đúng loại
- [ ] Deploy ID hiển thị
- [ ] Created date format đúng (DD/MM/YYYY HH:MM)

#### Test 2.3: Status badges
Test tất cả các status:
- [ ] `pending` - Badge vàng với dot
- [ ] `running` - Badge xanh dương
- [ ] `generating` - Badge tím
- [ ] `generated` - Badge indigo
- [ ] `deploying` - Badge cam
- [ ] `deployed` - Badge xanh lá
- [ ] `completed` - Badge xanh lá
- [ ] `failed` - Badge đỏ

#### Test 2.4: Task type icons
- [ ] `image_classification` - Icon hình ảnh
- [ ] `object_detection` - Icon detect box
- [ ] `text_classification` - Icon text lines

#### Test 2.5: Instance info
- [ ] Nếu có instance_id và host, hiển thị instance info section
- [ ] Instance ID hiển thị 8 ký tự đầu
- [ ] Port hiển thị đúng

#### Test 2.6: Error message
- [ ] Nếu có error_message, hiển thị error box màu đỏ
- [ ] Error text được truncate nếu quá dài
- [ ] Hover để xem full error

### 3. Deploy Selection

#### Test 3.1: Deploy list load
- [ ] Danh sách deploys load từ API
- [ ] Deploys được sort theo ID (mới nhất trên cùng)
- [ ] Auto-select deploy đầu tiên

#### Test 3.2: Deploy dropdown
- [ ] Dropdown hiển thị tất cả deploys
- [ ] Format: "Deploy Name (ID: XXX)"
- [ ] Select được deploy khác
- [ ] Khi chọn deploy mới, app name auto-fill

#### Test 3.3: Empty deploys
- [ ] Nếu chưa có deploy, hiển thị message
- [ ] Button "Go to Deploy page" hoạt động
- [ ] Navigate đến trang deploy đúng

### 4. Gen App Flow

#### Test 4.1: Open modal
- [ ] Click "Gen App" button
- [ ] Modal mở ra
- [ ] Title: "Gen App Configuration"

#### Test 4.2: Modal form
- [ ] Deploy dropdown có giá trị selected
- [ ] App name input có placeholder
- [ ] App name được pre-fill từ deploy name
- [ ] Task type field read-only, hiển thị đúng
- [ ] Task type được determine từ project

#### Test 4.3: Form validation
- [ ] Nếu chưa chọn deploy, button disabled
- [ ] Nếu đã chọn deploy, button enabled

#### Test 4.4: Submit form
- [ ] Click "Confirm"
- [ ] Button hiển thị "Processing..."
- [ ] Button disabled khi đang process
- [ ] API call với payload đúng:
  ```json
  {
    "task": "image_classification",
    "name": "App Name",
    "project_id": "uuid",
    "deploy_id": "123",
    "requirements": "",
    "skip_rent": false,
    "instance_id": null,
    "skip_deploy": false
  }
  ```

#### Test 4.5: Success handling
- [ ] Success message hiển thị
- [ ] Modal đóng
- [ ] App name được reset
- [ ] Danh sách apps được refetch
- [ ] App mới xuất hiện trong danh sách

#### Test 4.6: Error handling
- [ ] Nếu API error, hiển thị error message
- [ ] Modal không đóng
- [ ] Form vẫn giữ nguyên giá trị
- [ ] User có thể thử lại

#### Test 4.7: Cancel
- [ ] Click "Cancel" button
- [ ] Modal đóng
- [ ] Form data không bị submit

### 5. App Actions

#### Test 5.1: Open App button
- [ ] Button chỉ hiển thị khi có deployed URL
- [ ] Click button mở tab mới
- [ ] URL đúng format: `http://{host}:{port}`
- [ ] App mở thành công

#### Test 5.2: Details button
- [ ] Click "Details" button
- [ ] Console log hiển thị app data
- [ ] (TODO: Navigate to details page)

#### Test 5.3: Hover effects
- [ ] Card có hover effect (shadow, translate)
- [ ] Buttons có hover effect
- [ ] Smooth transitions

### 6. Dark Mode

#### Test 6.1: Toggle dark mode
- [ ] Switch theme sang dark
- [ ] Background shapes hiển thị
- [ ] Cards có background tối
- [ ] Text colors thay đổi phù hợp

#### Test 6.2: Status badges in dark mode
- [ ] Tất cả badges có variant dark mode
- [ ] Colors vẫn dễ nhìn
- [ ] Contrast đủ

#### Test 6.3: Icons in dark mode
- [ ] Icon colors điều chỉnh
- [ ] Gradient backgrounds phù hợp

### 7. API Integration

#### Test 7.1: Fetch apps API
- [ ] Network tab: Request URL đúng
- [ ] Query params: `project_id={projectId}`
- [ ] Response format: `{ items: [...], total: number }`
- [ ] Hook parse `data.items` đúng
- [ ] Console logs:
  ```
  [useGenApps] Raw response: {...}
  [useGenApps] Found items array: X apps
  ```

#### Test 7.2: Gen app API
- [ ] Network tab: Request URL đúng
- [ ] Method: POST
- [ ] Payload đúng format
- [ ] Response có `run_id`

#### Test 7.3: Error responses
- [ ] 404: Service not found
- [ ] 500: Server error
- [ ] Network error: No connection
- [ ] Timeout errors

### 8. Browser Compatibility

#### Test 8.1: Chrome
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

#### Test 8.2: Firefox
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

#### Test 8.3: Safari
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### 9. Responsive Design

#### Test 9.1: Mobile (< 640px)
- [ ] Grid: 1 column
- [ ] Modal full width
- [ ] Buttons stack vertically
- [ ] Text readable

#### Test 9.2: Tablet (640px - 1024px)
- [ ] Grid: 2 columns
- [ ] Modal centered
- [ ] Good spacing

#### Test 9.3: Desktop (> 1024px)
- [ ] Grid: 3-4 columns
- [ ] Full features visible
- [ ] Optimal spacing

### 10. Performance

#### Test 10.1: Load time
- [ ] Page loads < 2s
- [ ] API calls < 1s
- [ ] No unnecessary re-renders

#### Test 10.2: Large datasets
- [ ] Test với 50+ apps
- [ ] Scroll smooth
- [ ] No lag

#### Test 10.3: Memory
- [ ] No memory leaks
- [ ] Cleanup on unmount

## 🔍 Debug Checklist

### Console Logs to Check
```javascript
[useGenApps] Raw response: {...}
[useGenApps] Found items array: X apps
View details for app: {...}
```

### Network Requests to Verify
```
GET /api/service/adaptive_model_to_app/generated_app/list?project_id=xxx
POST /api/service/adaptive_model_to_app/pipeline/run
```

### Common Errors & Solutions

#### Error: Apps không hiển thị
- [ ] Check response format
- [ ] Check projectId
- [ ] Check backend running

#### Error: CORS
- [ ] Check backend CORS config
- [ ] Check gateway routing

#### Error: 404
- [ ] Check service running: `curl http://localhost:8000/v1/api/health`
- [ ] Check gateway routing

## 📊 Acceptance Criteria

- [ ] User có thể xem danh sách apps của project
- [ ] User có thể chọn deploy và gen app mới
- [ ] User có thể mở app đã deploy
- [ ] Status của apps hiển thị chính xác
- [ ] Error handling đúng
- [ ] UI responsive và đẹp
- [ ] Dark mode hoạt động tốt
- [ ] No console errors
- [ ] Performance tốt

## ✅ Sign-off

- [ ] Developer tested: ___________
- [ ] Code review passed: ___________
- [ ] QA tested: ___________
- [ ] Product approved: ___________

**Date:** ___________
**Notes:** ___________
