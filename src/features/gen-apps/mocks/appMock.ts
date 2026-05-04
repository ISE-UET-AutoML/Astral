import agriTemplate from "../../../../template/agri.html?raw";
import fraudTemplate from "../../../../template/fraud.html?raw";
import medTemplate from "../../../../template/med.html?raw";
import satelliteTemplate from "../../../../template/satellite.html?raw";

export const USE_GEN_APP_MOCKS =
  import.meta.env.VITE_USE_GEN_APP_MOCKS === "true";

const mockTemplateApps = [
  {
    id: "6f2b5c7e-60f9-4b8b-9d79-7bdb0ec5f8a1",
    name: "FinGuard",
    description: "Real-time fraud detection dashboard for transaction review.",
    project_id: "8fd84ad5-8d32-42b8-8ff8-7874dfc50f68",
    model_id: 42,
    task_type: "TABULAR_CLASSIFICATION",
    instance_id: "36013980",
    host: "127.0.0.1",
    ports: {
      frontend: 5174,
      backend: 8001,
    },
    status: "deployed",
    created_at: "2026-05-02T08:15:00.000Z",
    updated_at: "2026-05-02T10:45:00.000Z",
    metadata: {
      framework: "html",
      template: "fraud.html",
      model_name: "Transaction Fraud Detector",
      problem_type: "binary",
      input_format: "CSV or JSON transaction file",
      labels: ["legitimate", "fraud"],
    },
  },
  {
    id: "9f426952-2fa4-47c9-9b94-8f2cc6b48e35",
    name: "AgriScan",
    description: "Crop health and disease detection app for leaf imagery.",
    project_id: "8fd84ad5-8d32-42b8-8ff8-7874dfc50f68",
    model_id: 43,
    task_type: "IMAGE_CLASSIFICATION",
    instance_id: "36013981",
    host: "127.0.0.1",
    ports: {
      frontend: 5175,
      backend: 8002,
    },
    status: "deployed",
    created_at: "2026-05-02T11:20:00.000Z",
    updated_at: "2026-05-02T11:28:00.000Z",
    metadata: {
      framework: "html",
      template: "agri.html",
      model_name: "Crop Disease Classifier",
      problem_type: "multiclass",
      input_format: "Leaf image",
      labels: ["healthy", "early blight", "leaf spot", "rust"],
    },
  },
  {
    id: "e4ad4894-9fa5-4390-a4ef-9c6a2df311ce",
    name: "MedAI",
    description: "Ambulance X-ray triage interface for emergency review.",
    project_id: "8fd84ad5-8d32-42b8-8ff8-7874dfc50f68",
    model_id: 44,
    task_type: "IMAGE_CLASSIFICATION",
    instance_id: "36013982",
    host: "127.0.0.1",
    ports: {
      frontend: 5176,
      backend: 8003,
    },
    status: "deployed",
    created_at: "2026-05-02T12:05:00.000Z",
    updated_at: "2026-05-02T12:18:00.000Z",
    metadata: {
      framework: "html",
      template: "med.html",
      model_name: "Emergency X-Ray Triage",
      problem_type: "multiclass",
      input_format: "X-ray image or DICOM",
      labels: ["normal", "urgent", "critical"],
    },
  },
  {
    id: "31c8c991-cf8f-44ac-b0eb-7e1a7a7474a6",
    name: "TerraView",
    description: "Satellite environmental intelligence app for scene analysis.",
    project_id: "8fd84ad5-8d32-42b8-8ff8-7874dfc50f68",
    model_id: 45,
    task_type: "IMAGE_CLASSIFICATION",
    instance_id: "36013983",
    host: "127.0.0.1",
    ports: {
      frontend: 5177,
      backend: 8004,
    },
    status: "deployed",
    created_at: "2026-05-02T13:30:00.000Z",
    updated_at: "2026-05-02T13:42:00.000Z",
    metadata: {
      framework: "html",
      template: "satellite.html",
      model_name: "Satellite Scene Analyzer",
      problem_type: "multiclass",
      input_format: "Satellite image",
      labels: ["vegetation", "water", "urban", "fire risk"],
    },
  },
];

export const mockGeneratedApp = mockTemplateApps[0];

export const mockGeneratedAppsById = Object.fromEntries(
  mockTemplateApps.map((app) => [app.id, app]),
);

export const mockGeneratedAppsList = {
  total: mockTemplateApps.length,
  items: mockTemplateApps,
};

const mockHistoryByTemplate = {
  "fraud.html": {
    first:
      "Initial fraud-monitoring workspace with transaction upload, risk prediction, live alerts, rules, investigations, and analytics tabs.",
    prompts: [
      "Add a compact upload flow for CSV and JSON transaction files.",
      "Surface high-risk transactions more clearly for analysts.",
      "Add rule tuning and case review context to the side panels.",
    ],
    changes: [
      "Added CSV/JSON upload handling, file metadata, and an awaiting-prediction state.",
      "Added risk scoring copy, alert emphasis, fraud confidence details, and transaction context.",
      "Expanded rules, investigations, and analytics sections with analyst-oriented summaries.",
    ],
  },
  "agri.html": {
    first:
      "Initial crop-health app with leaf image upload, disease diagnosis, treatment guidance, field map, treatment library, and history.",
    prompts: [
      "Make the leaf upload workflow easier for farmers in the field.",
      "Add treatment recommendations after prediction.",
      "Add field-map and history views for repeat inspections.",
    ],
    changes: [
      "Added camera-style upload controls, drag-and-drop states, and sample crop handling.",
      "Added severity, confidence, disease explanation, and treatment recommendation panels.",
      "Added field health grid, treatment library, and inspection history sections.",
    ],
  },
  "med.html": {
    first:
      "Initial ambulance X-ray triage app with image upload, prediction summary, urgency indicators, notes, and clinical review sections.",
    prompts: [
      "Support emergency X-ray image upload and clear triage status.",
      "Improve confidence display for ambulance staff.",
      "Add review notes and clinical context panels.",
    ],
    changes: [
      "Added image/DICOM upload flow, preview area, and initial triage state.",
      "Added confidence, urgency, prediction summary, and status messaging.",
      "Added clinical context, review notes, and supporting triage details.",
    ],
  },
  "satellite.html": {
    first:
      "Initial satellite environmental intelligence app with image upload, scene analysis, environmental metrics, map context, and event history.",
    prompts: [
      "Add satellite image upload with immediate scene feedback.",
      "Highlight environmental change signals after upload.",
      "Add monitoring views for historical events and metrics.",
    ],
    changes: [
      "Added satellite image upload handling, scene preview, and upload metadata.",
      "Added change summary, environmental indicators, and risk/status signals.",
      "Expanded monitoring metrics, map context, and historical event sections.",
    ],
  },
};

const hashString = (value) =>
  [...value].reduce((hash, char) => hash + char.charCodeAt(0), 0);

const addMinutes = (isoDate, minutes) =>
  new Date(new Date(isoDate).getTime() + minutes * 60_000).toISOString();

const getMockApp = (appId) => mockGeneratedAppsById[appId] || mockGeneratedApp;

const getHistory = (appId) => {
  const app = getMockApp(appId);
  return mockHistoryByTemplate[app.metadata.template];
};

export const getMockAppVersionsSummary = (appId) => {
  const app = getMockApp(appId);
  const history = getHistory(app.id);
  const seed = hashString(app.id);
  const versionCount = 2 + (seed % 3);
  const versions = Array.from({ length: versionCount }, (_, index) => {
    const versionNumber = index + 1;
    const changelog =
      versionNumber === 1
        ? history.first
        : history.changes[(versionNumber - 2) % history.changes.length];
    const createdAt = addMinutes(app.created_at, 18 + index * (31 + (seed % 9)));

    return {
      id: `${app.id}-version-${versionNumber}`,
      app_id: app.id,
      version_number: versionNumber,
      changelog,
      status: "DEPLOYED",
      created_at: createdAt,
      deployed_at: addMinutes(createdAt, 7 + ((seed + index) % 6)),
    };
  });

  return {
    current_version: versionCount,
    versions,
  };
};

export const getMockChatMessages = (appId, limit = 200) => {
  const app = getMockApp(appId);
  const history = getHistory(app.id);
  const versions = getMockAppVersionsSummary(app.id).versions;
  const items = versions.flatMap((version, index) => {
    const userMessage =
      index === 0
        ? `Create ${app.name} as an editable generated app.`
        : history.prompts[(index - 1) % history.prompts.length];
    const userCreatedAt = addMinutes(version.created_at, -11);

    return [
      {
        id: `${app.id}-message-${version.version_number}-user`,
        app_id: app.id,
        role: "user",
        content: userMessage,
        created_at: userCreatedAt,
      },
      {
        id: `${app.id}-message-${version.version_number}-assistant`,
        app_id: app.id,
        role: "assistant",
        content: version.changelog,
        version_number: version.version_number,
        created_at: version.created_at,
      },
    ];
  });

  const limitedItems = items.slice(Math.max(items.length - limit, 0));

  return {
    total: items.length,
    items: limitedItems,
  };
};

export const mockAppVersionsSummary = getMockAppVersionsSummary(
  mockGeneratedApp.id,
);

export const mockChatMessages = getMockChatMessages(mockGeneratedApp.id);

export const mockFileTree = {
  type: "dir",
  children: {
    frontend: {
      type: "dir",
      children: {
        "index.html": {
          type: "file",
        },
      },
    },
  },
};

export const mockFilesByPath = {
  [mockTemplateApps[0].id]: {
    "frontend/index.html": fraudTemplate,
  },
  [mockTemplateApps[1].id]: {
    "frontend/index.html": agriTemplate,
  },
  [mockTemplateApps[2].id]: {
    "frontend/index.html": medTemplate,
  },
  [mockTemplateApps[3].id]: {
    "frontend/index.html": satelliteTemplate,
  },
};
