import { PATHS } from "src/constants/paths";
import Profile from "src/features/profile/pages/profile";
import Settings from "src/features/settings/pages/settings";
import RequireAuth from "src/layouts/RequireAuth";
import DefaultLayout from "src/layouts/DefaultLayout";
import Projects from "src/features/projects/pages/projects";
import ProjectTasks from "src/features/projects/pages/tasks";
import ProjectLayout from "src/layouts/ProjectLayout";
import ProjectDeploy from "src/features/deploy/pages/deploy";
import ProjectModels from "src/features/models/pages/models";
import ProjectBuild from "src/features/project-build/pages/build/build";
import ProjectSettings from "src/features/projects/pages/settings";
import ProjectExperiments from "src/features/project-build/pages/experiments";
import ProjectGenApp from "src/features/gen-apps/pages/genapp";
import EditAppPage from "src/features/gen-apps/pages/editapp";
import Buckets from "src/features/buckets/pages/buckets";
import Datasets from "src/features/datasets/pages/datasets";
import DatasetLayout from "src/layouts/DatasetLayout";
import DatasetView from "src/features/datasets/pages/dataset/DatasetView";
import LabelProjects from "src/features/labels/pages/labels";
import LabelView from "src/features/labels/pages/label/LabelView";
import UploadData from "src/features/project-build/pages/build/uploadData";
import ChooseTrainingMode from "src/features/project-build/pages/build/chooseTrainingMode";
import SelectInstance from "src/features/project-build/pages/build/selectInstance";
import SelectTargetColMulti from "src/features/project-build/pages/build/selectTargetColMulti";
import SelectTargetCol from "src/features/project-build/pages/build/selectTargetCol";
import Training from "src/features/project-build/pages/build/training";
import TrainResult from "src/features/project-build/pages/build/trainResult";
import DeployView from "src/features/project-build/pages/build/deployView";
import DeployedModelView from "src/features/deploy/pages/deploy/deployedModelView";
import DeploySettingUpView from "src/features/deploy/pages/deploy/deploySettingUpView";
import ModelView from "src/features/models/pages/models/modelView";
import ProjectInfo from "src/features/project-build/pages/build/info";
import RecentPredictionsPage from "src/features/models/pages/models/RecentPredictionsPage";

const routes = {
    element: <DefaultLayout />,
    children: [
        {
            path: PATHS.PROFILE,
            element: <Profile />,
        },
        {
            path: PATHS.SETTINGS,
            element: <Settings />,
        },
        {
            path: PATHS.DEFAULT,
            element: <RequireAuth />,
            children: [
                /*-----------------PROJECTS' PATH---------------*/

                {
                    path: PATHS.PROJECTS,
                    element: <Projects />,
                },
                {
                    path: '/app/',
                    children: [
                        {
                            path: 'project/:id',
                            element: <ProjectLayout />,
                            children: [
                                {
                                    path: 'build',
                                    element: <ProjectBuild />,
                                    children: [
                                        {
                                            path: 'info',
                                            element: <ProjectInfo />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'hidden',
                                                    height: 'full',
                                                },
                                            },
                                        },
                                        {
                                            path: 'uploadData',
                                            element: <UploadData />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'hidden',
                                                    height: 'full',
                                                },
                                            },
                                        },
                                        {
                                            path: 'chooseTrainingMode',
                                            element: <ChooseTrainingMode />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'auto',
                                                    height: 'full',
                                                },
                                            },
                                        },
                                        {
                                            path: 'selectTargetColMulti',
                                            element: <SelectTargetColMulti />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'hidden',
                                                    height: 'full',
                                                },
                                            },
                                        },
                                        {
                                            path: 'selectTargetCol',
                                            element: <SelectTargetCol />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'hidden',
                                                    height: 'full',
                                                },
                                            },
                                        },
                                        {
                                            path: 'selectInstance',
                                            element: <SelectInstance />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'hidden',
                                                    height: 'full',
                                                },
                                            },
                                        },
                                        {
                                            path: 'training',
                                            element: <Training />,
                                            handle: {
                                                projectLayout: {
                                                    scrollAt: 'shell',
                                                    overflow: 'visible',
                                                    height: 'auto',
                                                },
                                            },
                                        },
                                        {
                                            path: 'trainResult',
                                            element: <TrainResult />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'auto',
                                                    height: 'full',
                                                },
                                            },
                                        },
                                        {
                                            path: 'deployView',
                                            element: <DeployView />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'hidden',
                                                    height: 'full',
                                                },
                                            },
                                        },
                                        {
                                            path: 'deploySettingUp',
                                            element: <DeploySettingUpView />,
                                            handle: {
                                                projectLayout: {
                                                    overflow: 'hidden',
                                                    height: 'full',
                                                },
                                            },
                                        }
                                    ],
                                },
                                {
                                    path: 'experiments',
                                    element: <ProjectExperiments />,
                                    handle: {
                                        projectLayout: {
                                            overflow: 'hidden',
                                            height: 'full',
                                        },
                                    },
                                },
                                {
                                    path: 'model',
                                    element: <ProjectModels />,
                                    handle: {
                                        projectLayout: {
                                            overflow: 'hidden',
                                            height: 'full',
                                        },
                                    },
                                },
                                {
                                    path: 'model/:modelId',
                                    element: <ModelView />,
                                    handle: {
                                        projectLayout: {
                                            scrollAt: 'shell',
                                            overflow: 'visible',
                                            height: 'auto',
                                        },
                                    },
                                },
                                {
                                    path: 'model/:modelId/retrain',
                                    element: <RecentPredictionsPage />
                                },
                                {
                                    path: 'deploy',
                                    element: <ProjectDeploy />,
                                    handle: {
                                        projectLayout: {
                                            overflow: 'hidden',
                                            height: 'full',
                                        },
                                    },
                                },
                                {
                                    path: 'deploy/:deployId',
                                    element: <DeployedModelView />
                                },
                                {
                                    path: 'my-apps',
                                    element: <ProjectGenApp />,
                                    handle: {
                                        projectLayout: {
                                            overflow: 'hidden',
                                            height: 'full',
                                        },
                                    },
                                },
                                {
                                    path: 'my-apps/:appId/edit',
                                    element: <EditAppPage />,
                                    handle: {
                                        projectLayout: {
                                            overflow: 'hidden',
                                            padding: 'none',
                                            height: 'full',
                                        },
                                    },
                                },
                                {
                                    path: 'tasks',
                                    element: <ProjectTasks />,
                                },
                                {
                                    path: 'settings',
                                    element: <ProjectSettings />,
                                },
                            ],
                        },
                    ],
                },

                /*-----------------BUCKETS' PATH---------------*/

                {
                    path: PATHS.BUCKETS,
                    element: <Buckets />,
                },

                /*-----------------DATASETS' PATH---------------*/
                {
                    path: PATHS.DATASETS,
                    element: <Datasets />,
                },
                {
                    path: '/app/',
                    children: [
                        {
                            path: 'dataset/:id',
                            element: <DatasetLayout />,
                            children: [
                                {
                                    path: 'view',
                                    element: <DatasetView />,
                                },
                            ],
                        },
                    ],
                },

                /*-----------------LABELS' PATH---------------*/
                {
                    path: PATHS.LABELS,
                    element: <LabelProjects />,
                },
                {
                    path: '/app/',
                    children: [
                        {
                            path: 'label-projects/:id',
                            element: <LabelView />,
                        },
                    ],
                },
            ],
        },
    ],
}

export default routes
