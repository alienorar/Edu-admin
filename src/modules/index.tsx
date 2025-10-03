import loadable from '@loadable/component'
import { Loading } from '@components';
import SignIn from './auth/pages/admin'
import General from './auth/pages/general'
import Tutor from './auth/pages/tutor'

const AdminPanel = loadable(() => import('./super-admin-panel'), {
  fallback: <Loading />
});
const AdminPage = loadable(() => import('./admin/pages'), {
  fallback: <Loading />
});
const Role = loadable(() => import('./role/pages'), {
  fallback: <Loading />
});
const Employee = loadable(() => import('./employee/pages'), {
  fallback: <Loading />
});
const FaceControl = loadable(() => import('./face-control/pages'), {
  fallback: <Loading />
});

const GroupList = loadable(() => import('./group-list/pages'), {
  fallback: <Loading />
});

const LessonStatistics = loadable(() => import('./lesson-statistics/pages'), {
  fallback: <Loading />
});

const Xazna = loadable(() => import('./xazna/pages'), {
  fallback: <Loading />
});
const Abiturient = loadable(() => import('./abiturient/pages'), {
  fallback: <Loading />
});

const Synchronization = loadable(() => import('./synchronize/pages'), {
  fallback: <Loading />
});


// ====================TUTOR PANEL ==================

const TutorStatistics = loadable(() => import('./tutor-panel/statistics/pages'), {
  fallback: <Loading />
});

const TutorProtocol = loadable(() => import('./tutor-panel/protocol/pages'), {
  fallback: <Loading />
});

const NotFound = loadable(() => import('./not-found'), {
  fallback: <Loading />
});

const AccessDenied = loadable(() => import('./access-denied'), {
  fallback: <Loading />
});
export {
  General,
  SignIn,
  Tutor,
  AdminPanel,
  AdminPage,
  Role,
  Employee,
  FaceControl,
  GroupList,
  LessonStatistics,
  TutorStatistics,
  TutorProtocol,
  Xazna,
  Synchronization,
  Abiturient,
  NotFound,
  AccessDenied
}