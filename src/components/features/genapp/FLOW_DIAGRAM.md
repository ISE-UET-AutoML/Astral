# GenApp Flow Diagrams

## 📊 Data Flow - Fetch Apps

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                             │
│  User navigates to /app/project/{projectId}/my-apps            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT MOUNT                               │
│  ProjectGenApp component loads                                   │
│  const { id: projectId } = useParams()                          │
│  const { apps, loading, error } = useGenApps(projectId)        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     HOOK EXECUTION                               │
│  useGenApps.js                                                   │
│  - useEffect triggers fetchApps()                               │
│  - setLoading(true)                                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API CALL                                    │
│  getGenAppsList(projectId)                                      │
│  GET /api/service/adaptive_model_to_app/generated_app/list     │
│  params: { project_id: "uuid" }                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GATEWAY ROUTING                               │
│  Gateway receives request                                        │
│  Forwards to: http://localhost:8000/v1/api/generated_app/list  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                BACKEND SERVICE (FastAPI)                         │
│  @router.get("/list", response_model=GeneratedAppList)         │
│  - Query database with project_id filter                        │
│  - Return { items: [...], total: number }                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RESPONSE PARSING                               │
│  Hook receives response                                          │
│  if (data?.items) { setApps(data.items) }                      │
│  Console: "[useGenApps] Found items array: X apps"             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT RENDER                              │
│  apps.map((app) => <AppCard app={app} />)                       │
│  Display grid of AppCard components                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Gen App Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                             │
│  User clicks "Gen App" button                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MODAL OPENS                                 │
│  setIsFormOpen(true)                                            │
│  Shows:                                                          │
│  - Deploy dropdown (selectedDeployId)                           │
│  - App name input (appName)                                     │
│  - Task type (read-only, from project)                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER FILLS FORM                               │
│  - Select deploy (auto-fills app name)                          │
│  - Edit app name if needed                                      │
│  - See task type (auto-determined)                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   USER CLICKS CONFIRM                            │
│  handleConfirmGenApp() triggered                                │
│  - Validation: selectedDeployId must exist                      │
│  - setGenLoading(true)                                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API CALL                                    │
│  genApp({                                                        │
│    deployId: selectedDeployId,                                  │
│    projectId: projectId,                                        │
│    name: appName,                                               │
│    taskType: resolveTaskType()                                  │
│  })                                                              │
│                                                                  │
│  POST /api/service/adaptive_model_to_app/pipeline/run          │
│  Payload: {                                                      │
│    task: "image_classification",                                │
│    name: "My App",                                              │
│    project_id: "uuid",                                          │
│    deploy_id: "123",                                            │
│    requirements: "",                                            │
│    skip_rent: false,                                            │
│    instance_id: null,                                           │
│    skip_deploy: false                                           │
│  }                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                BACKEND PIPELINE START                            │
│  Pipeline receives request                                       │
│  Creates run_id                                                 │
│  Returns: { run_id, status: "pending", message: "..." }        │
│  Background task starts:                                         │
│    1. Rent GPU (if not skip_rent)                              │
│    2. Generate code (parallel with rent)                        │
│    3. Deploy to Vast.ai (after both complete)                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SUCCESS HANDLING                               │
│  - message.success('Gen app successfully')                      │
│  - refetch() - reload apps list                                 │
│  - setIsFormOpen(false) - close modal                          │
│  - setAppName('') - reset form                                 │
│  - setGenLoading(false)                                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    UI UPDATES                                    │
│  - Modal closes                                                  │
│  - Apps list reloads                                            │
│  - New app appears with status "pending"                        │
│  - User can see status updates by refreshing                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Component Tree

```
ProjectGenApp (index.jsx)
├── Header Section
│   ├── AppIcon
│   ├── Title: "My Apps"
│   └── Counter: "{apps.length} app generated"
│
├── Gen App Card
│   ├── CardHeader: "Gen App"
│   ├── CardContent
│   │   ├── Deploy Dropdown (CustomSelect)
│   │   └── Gen App Button
│   └── Logic: fetchDeploys(), resolveTaskType()
│
├── Apps List
│   ├── Loading State
│   │   └── Card with "Loading..."
│   ├── Error State
│   │   └── Error Card (red)
│   ├── Empty State
│   │   ├── EmptyIcon
│   │   └── "You haven't generated any apps yet"
│   └── Apps Grid
│       └── apps.map(app =>
│           AppCard (AppCard.jsx)
│           ├── CardHeader
│           │   ├── Icon (task type)
│           │   ├── Title (app name)
│           │   └── StatusBadge
│           ├── CardContent
│           │   ├── Task Type
│           │   ├── Deploy ID
│           │   ├── Created Date
│           │   ├── Instance Info (if exists)
│           │   ├── Error Message (if exists)
│           │   └── Actions
│           │       ├── Open App Button
│           │       └── Details Button
│           └── Styling: hover effects, transitions
│       )
│
└── Modal (Gen App Configuration)
    ├── Modal Header: "Gen App Configuration"
    ├── Modal Body
    │   ├── Deploy Dropdown
    │   ├── App Name Input
    │   └── Task Type (read-only)
    └── Modal Footer
        ├── Cancel Button
        └── Confirm Button
            └── onClick: handleConfirmGenApp()
```

## 📦 Data Models

### GeneratedApp (Frontend)
```typescript
interface GeneratedApp {
  id: string | UUID
  name?: string
  status: 'pending' | 'running' | 'generating' | 'generated' | 
          'deploying' | 'deployed' | 'completed' | 'failed'
  task_type: 'image_classification' | 'object_detection' | 'text_classification'
  deploy_id?: string | number
  project_id?: string | UUID
  run_id?: string | UUID
  instance_id?: number
  host?: string
  ports?: {
    frontend?: number
    server?: number
    ssh?: number
    minio?: number
  }
  requirements?: string
  model_api_endpoint?: string
  s3_uri?: string
  version?: number
  created_at: string (ISO datetime)
  error_message?: string
}
```

### API Response: List Apps
```typescript
interface GeneratedAppList {
  items: GeneratedApp[]
  total: number
}
```

### API Request: Gen App
```typescript
interface GenAppRequest {
  task: string                    // Task type
  name: string | null            // App name
  project_id: string | null      // Project ID
  deploy_id: string              // Deploy ID (required)
  requirements: string           // Custom requirements
  skip_rent: boolean            // Skip GPU rental
  instance_id: string | null    // Existing instance
  skip_deploy: boolean          // Skip deployment
}
```

### API Response: Gen App
```typescript
interface PipelineResponse {
  run_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  message: string
  result?: object
  error?: string
  logs?: LogEntry[]
}
```

## 🔄 State Management

```
ProjectGenApp Component State:
┌─────────────────────────────────────────┐
│ projectId (from URL params)             │
│ apps (from useGenApps hook)             │
│ loading (from useGenApps hook)          │
│ error (from useGenApps hook)            │
│ projectInfo (from getProjectById)       │
│ deploys (from getAllDeployedModel)      │
│ selectedDeployId (local state)          │
│ genLoading (local state)                │
│ appName (local state)                   │
│ isFormOpen (local state)                │
└─────────────────────────────────────────┘

useGenApps Hook State:
┌─────────────────────────────────────────┐
│ apps (array of GeneratedApp)            │
│ loading (boolean)                        │
│ error (Error | null)                    │
│ refetch (function)                      │
└─────────────────────────────────────────┘
```

## 🎭 Status Lifecycle

```
Gen App Clicked
      │
      ▼
  [pending] ────────────────────┐
      │                         │
      ▼                         │
  [running] ──────────┐        │
      │                │        │
      ├─→ [generating] │        │
      │        │        │        │
      │        ▼        │        │
      ├─→ [generated]  │        │
      │        │        │        │
      │        ▼        │        │
      └─→ [deploying]  │        │
               │        │        │
               ▼        │        │
          [deployed]    │        │
               │        │        │
               ▼        ▼        ▼
          [completed]  [failed] [failed]

Status Colors:
- pending: Yellow
- running: Blue
- generating: Purple
- generated: Indigo
- deploying: Orange
- deployed: Green
- completed: Green
- failed: Red
```

## 🔍 API Request Flow

```
Frontend Request
      │
      │ axios.get/post
      │ with auth headers
      ▼
┌──────────────────┐
│  Axios Instance  │ (auto adds auth token)
│  interceptors    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   API Gateway    │ (http://localhost:8080)
│  - Auth check    │
│  - Routing       │
└────────┬─────────┘
         │
         │ Forward to service
         ▼
┌──────────────────┐
│  Backend Service │ (http://localhost:8000)
│  FastAPI         │
│  - Route handler │
│  - Business logic│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Database       │ (PostgreSQL)
│  - Query         │
│  - Return data   │
└────────┬─────────┘
         │
         ▼
Response bubbles back up the chain
```

## 🎯 User Journey

```
1. User Story: View Generated Apps
   ┌───────────────────────────────────┐
   │ User opens project                │
   │ Clicks "My Apps" in sidebar       │
   │ Sees list of generated apps       │
   │ Can view status of each app       │
   │ Can open deployed apps            │
   └───────────────────────────────────┘

2. User Story: Generate New App
   ┌───────────────────────────────────┐
   │ User on My Apps page              │
   │ Selects a deployment              │
   │ Clicks "Gen App"                  │
   │ Fills in app name                 │
   │ Reviews task type                 │
   │ Clicks "Confirm"                  │
   │ Waits for pipeline                │
   │ Sees new app in list              │
   └───────────────────────────────────┘

3. User Story: Open Deployed App
   ┌───────────────────────────────────┐
   │ User sees deployed app            │
   │ Status badge shows "deployed"     │
   │ "Open App" button is enabled      │
   │ Clicks "Open App"                 │
   │ New tab opens with app URL        │
   │ User interacts with web app       │
   └───────────────────────────────────┘
```
