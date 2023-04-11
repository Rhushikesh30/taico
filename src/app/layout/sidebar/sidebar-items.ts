import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Dashboard',
    moduleName: 'dashboard',
    icon: 'edit',
    class: 'menu-toggle',
    groupTitle: false,
    submenu: [
      {
        path: '/dashboard/main',
        title: 'Api Logs',
        moduleName: 'dashboard',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        submenu: []
      },
    ]
  },
  {
    path: 'Flat-file',
    title: 'Manage Flat File',
    moduleName: 'Flat-file',
    icon: 'file',
    class: 'menu-toggle',
    groupTitle: false,
    submenu: [
      {
        path: '/Flat-file/download-flat-file',
        title: 'Download Flat File',
        moduleName: 'Flat-file',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        submenu: []
      },
      {
        path: '/Flat-file/upload-flat-file',
        title: 'Upload and send',
        moduleName: 'Flat-file',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        submenu: []
      },
    ]
  }
];
