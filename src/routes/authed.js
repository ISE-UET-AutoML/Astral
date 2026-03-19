import { PATHS } from 'src/constants/paths'

import Profile from 'src/pages/profile'
import Settings from 'src/pages/settings'
import RequireAuth from 'src/layouts/RequireAuth'
import DefaultLayout from 'src/layouts/DefaultLayout'

import Projects from 'src/pages/projects'
import ProjectTasks from 'src/pages/project/tasks'
import ProjectLayout from 'src/layouts/ProjectLayout'
import ProjectDeploy from 'src/pages/project/deploy'
import ProjectModels from 'src/pages/project/models'
import ProjectBuild from 'src/pages/project/build/build'
import ProjectSettings from 'src/pages/project/settings'
import ProjectExperiments from 'src/pages/project/experiments'
import ProjectGenApp from 'src/pages/project/genapp'
import EditAppPage from 'src/pages/editapp'

import Buckets from 'src/pages/buckets'

import Datasets from 'src/pages/datasets'
import DatasetLayout from 'src/layouts/DatasetLayout'
import DatasetView from 'src/pages/dataset/DatasetView'

import LabelProjects from 'src/pages/labels'
import LabelView from 'src/pages/label/LabelView'

import UploadData from 'src/pages/project/build/uploadData'
import SelectInstance from 'src/pages/project/build/selectInstance'
import SelectTargetColMulti from 'src/pages/project/build/selectTargetColMulti'
import SelectTargetCol from 'src/pages/project/build/selectTargetCol'
import Training from 'src/pages/project/build/training'
import TrainResult from 'src/pages/project/build/trainResult'
import DeployView from 'src/pages/project/build/deployView'
import DeployedModelView from 'src/pages/project/deploy/deployedModelView'
import DeploySettingUpView from 'src/pages/project/deploy/deploySettingUpView'
import ModelView from 'src/pages/project/models/modelView'
import ProjectInfo from 'src/pages/project/build/info'
import RecentPredictionsPage from 'src/pages/project/models/RecentPredictionsPage'

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
                                                    overflow: 'auto',
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
