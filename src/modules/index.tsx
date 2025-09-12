import loadable from '@loadable/component'
import { Loading } from '@components';
import SignIn from './auth/pages/sign-in'

const AdminPanel = loadable(() => import('./super-admin-panel'), {
  fallback: <Loading />
});
const AdminPage = loadable(() => import('./admin/pages'), {
  fallback: <Loading />
});
const Role = loadable(() => import('./role/pages'), {
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


const NotFound = loadable(() => import('./not-found'), {
  fallback: <Loading />
});

const AccessDenied = loadable(() => import('./access-denied'), {
  fallback: <Loading />
});
export {
  SignIn,
  AdminPanel,
  AdminPage,
  Role,
  GroupList,
  LessonStatistics,
  Xazna,
  Abiturient,
  NotFound,
  AccessDenied
}