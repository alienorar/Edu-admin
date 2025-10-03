import {
  FaSignal,
  FaUserShield,
} from "react-icons/fa"
import { FaUserGear, FaUser } from "react-icons/fa6"
import {
  AdminPage,
  Role,
LessonStatistics,
GroupList,
Synchronization,
Employee,
TutorStatistics,
TutorProtocol,
} from "@modules"
import { FiSlack } from "react-icons/fi"

export const routesConfig = [
  {
    label: "Admin va ruxsatlar",
    icon: <FaUser style={{ fontSize: "22px" }} />,
    showInSidebar: true,
    permissions: ["ADMIN_ROLE_MENU", "ADMIN_USER_MENU"],
    children: [
      {
        path: "admin-permissions",
        icon: <FaUserGear style={{ fontSize: "22px" }} />,
        label: "Rol va ruxsatlar",
        element: <Role />,
        permissions: ["ADMIN_ROLE_MENU"],
        showInSidebar: true,
      },
      {
        path: "admin-page",
        icon: <FaUserShield style={{ fontSize: "22px" }} />,
        label: "Admin User",
        element: <AdminPage />,
        permissions: ["ADMIN_USER_MENU"],
        showInSidebar: true,
      },
      {
        path: "property",
        icon: <FaUserShield style={{ fontSize: "22px" }} />,
        label: "Property",
        element: <GroupList/>,
        permissions: ["ADMIN_USER_MENU"],
        showInSidebar: true,
      },
      {
        path: "employee",
        icon: <FaUserShield style={{ fontSize: "22px" }} />,
        label: "Employee",
        element: <Employee/>,
        permissions: ["ADMIN_USER_MENU"],
        showInSidebar: true,
      },
    ],
  },

  
  {
    label: "Statistikalar",
    icon: <FaSignal style={{ fontSize: "22px" }} />,
    showInSidebar: true,
    permissions: ["GROUP_STATISTICS_MENU", "STUDENT_STATISTICS_MENU"],
    children: [
      {
        path: "speciality-statistics",
        label: "Darslar",
        icon: <FiSlack style={{ fontSize: "22px" }} />,
        element: <LessonStatistics/>,
        permissions: ["SPECIALITY_FORM_STATISTICS_PAGEABLE"],
        showInSidebar: true,
      },
      {
        path: "tutor-statistics",
        label: "Tutor statistikalari",
        icon: <FiSlack style={{ fontSize: "22px" }} />,
        element: <TutorStatistics/>,
        permissions: ["SPECIALITY_FORM_STATISTICS_PAGEABLE"],
        showInSidebar: true,
      },
     
    ],
  },
     {
        path: "synchronization",
        label: "Sinxronizatsiya",
        icon: <FiSlack style={{ fontSize: "22px" }} />,
        element: <Synchronization/>,
        permissions: ["SPECIALITY_FORM_STATISTICS_PAGEABLE"],
        showInSidebar: true,
      },
     {
        path: "protocol",
        label: "Protokol",
        icon: <FiSlack style={{ fontSize: "22px" }} />,
        element: <TutorProtocol/>,
        permissions: ["SPECIALITY_FORM_STATISTICS_PAGEABLE"],
        showInSidebar: true,
      },
]
