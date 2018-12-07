import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';
import People from './views/People/UserRegister';
import UserDetail from './views/People/UserDetail';
import UserUpdate from './views/People/UserUpdate';
import StaffUpdate from './views/People/StaffUpdate';
import UserRegister from './views/People/UserRegister';
import Staff from './views/People/Staff';
import UserRegisterAdd from './views/People/UserRegisterAdd';
import StaffAdd from './views/People/StaffAdd';
import ParkLocation from './views/Map/ParkLocation';
import LiveStream from './views/LiveStream/LiveStream';

import UpdateOwner from './views/People/UpdateOwner';
import UpdateProfileOwner from './views/People/UpdateProfileOwner';
import UpdateProfileUser from './views/People/UpdateProfileUser';

function Loading() {
  return <div>Loading...</div>;
}

const Breadcrumbs = Loadable({
  loader: () => import('./views/Base/Breadcrumbs'),
  loading: Loading,
});

const Cards = Loadable({
  loader: () => import('./views/Base/Cards'),
  loading: Loading,
});

const Carousels = Loadable({
  loader: () => import('./views/Base/Carousels'),
  loading: Loading,
});

const Collapses = Loadable({
  loader: () => import('./views/Base/Collapses'),
  loading: Loading,
});

const Dropdowns = Loadable({
  loader: () => import('./views/Base/Dropdowns'),
  loading: Loading,
});

const Forms = Loadable({
  loader: () => import('./views/Base/Forms'),
  loading: Loading,
});

const Jumbotrons = Loadable({
  loader: () => import('./views/Base/Jumbotrons'),
  loading: Loading,
});

const ListGroups = Loadable({
  loader: () => import('./views/Base/ListGroups'),
  loading: Loading,
});

const Navbars = Loadable({
  loader: () => import('./views/Base/Navbars'),
  loading: Loading,
});

const Navs = Loadable({
  loader: () => import('./views/Base/Navs'),
  loading: Loading,
});

const Paginations = Loadable({
  loader: () => import('./views/Base/Paginations'),
  loading: Loading,
});

const Popovers = Loadable({
  loader: () => import('./views/Base/Popovers'),
  loading: Loading,
});

const ProgressBar = Loadable({
  loader: () => import('./views/Base/ProgressBar'),
  loading: Loading,
});

const Switches = Loadable({
  loader: () => import('./views/Base/Switches'),
  loading: Loading,
});

const Tables = Loadable({
  loader: () => import('./views/Base/Tables'),
  loading: Loading,
});

const Tabs = Loadable({
  loader: () => import('./views/Base/Tabs'),
  loading: Loading,
});

const Tooltips = Loadable({
  loader: () => import('./views/Base/Tooltips'),
  loading: Loading,
});

const BrandButtons = Loadable({
  loader: () => import('./views/Buttons/BrandButtons'),
  loading: Loading,
});

const ButtonDropdowns = Loadable({
  loader: () => import('./views/Buttons/ButtonDropdowns'),
  loading: Loading,
});

const ButtonGroups = Loadable({
  loader: () => import('./views/Buttons/ButtonGroups'),
  loading: Loading,
});

const Buttons = Loadable({
  loader: () => import('./views/Buttons/Buttons'),
  loading: Loading,
});

const Charts = Loadable({
  loader: () => import('./views/Charts'),
  loading: Loading,
});

const Dashboard = Loadable({
  loader: () => import('./views/Dashboard'),
  loading: Loading,
});

const CoreUIIcons = Loadable({
  loader: () => import('./views/Icons/CoreUIIcons'),
  loading: Loading,
});

const Flags = Loadable({
  loader: () => import('./views/Icons/Flags'),
  loading: Loading,
});

const FontAwesome = Loadable({
  loader: () => import('./views/Icons/FontAwesome'),
  loading: Loading,
});

const SimpleLineIcons = Loadable({
  loader: () => import('./views/Icons/SimpleLineIcons'),
  loading: Loading,
});

const Alerts = Loadable({
  loader: () => import('./views/Notifications/Alerts'),
  loading: Loading,
});

const Badges = Loadable({
  loader: () => import('./views/Notifications/Badges'),
  loading: Loading,
});

const Modals = Loadable({
  loader: () => import('./views/Notifications/Modals'),
  loading: Loading,
});

const Colors = Loadable({
  loader: () => import('./views/Theme/Colors'),
  loading: Loading,
});

const Typography = Loadable({
  loader: () => import('./views/Theme/Typography'),
  loading: Loading,
});

const Widgets = Loadable({
  loader: () => import('./views/Widgets/Widgets'),
  loading: Loading,
});

const Users = Loadable({
  loader: () => import('./views/Users/Users'),
  loading: Loading,
});

const User = Loadable({
  loader: () => import('./views/Users/User'),
  loading: Loading,
});



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const admin = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/userregister', exact: true, name: 'User Register', component: UserRegister },
  { path: '/staff', exact: true, name: 'Staff', component: Staff },
  { path: '/userregister/userdetail/:id', exact: true, name: 'User Detail', component: UserDetail },
  { path: '/userregister/userupdate/:id', exact: true, name: 'User Update', component: UserUpdate },
  { path: '/staff/staffupdate/:id', exact: true, name: 'Staff Update', component: StaffUpdate },
  { path: '/userregister/useradd', exact: true, name: 'User Add', component: UserRegisterAdd },
  { path: '/staff/staffadd', exact: true, name: 'Staff Add', component: StaffAdd },
  { path: '/map', exact: true, name: 'Map', component: ParkLocation },
  { path: '/livestream', exact: true, name: 'Live Stream', component: LiveStream },
  { path: '/updatepassword', exact: true, name: 'Update Password', component: UpdateOwner },
  { path: '/updateprofile', exact: true, name: 'Update Profile', component: UpdateProfileOwner },
];

const user = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/map', exact: true, name: 'Map', component: ParkLocation },
  { path: '/updatepassword', exact: true, name: 'Update Password', component: UpdateOwner },
  { path: '/updateprofile', exact: true, name: 'Update Profile', component: UpdateProfileUser },
];

const staff = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/userregister', exact: true, name: 'User Register', component: UserRegister },
  { path: '/userregister/userdetail/:id', exact: true, name: 'User Detail', component: UserDetail },
  { path: '/userregister/userupdate/:id', exact: true, name: 'User Update', component: UserUpdate },
  { path: '/userregister/useradd', exact: true, name: 'User Add', component: UserRegisterAdd },
  { path: '/map', exact: true, name: 'Map', component: ParkLocation },
  { path: '/livestream', exact: true, name: 'Live Stream', component: LiveStream },
  { path: '/updatepassword', exact: true, name: 'Update Password', component: UpdateOwner },
  { path: '/updateprofile', exact: true, name: 'Update Profile', component: UpdateProfileOwner },

]

const guest = [
    { path: '/', exact: true, name: 'Home', component: DefaultLayout },
    { path: '/map', exact: true, name: 'Map', component: ParkLocation },
]


export  {guest}
export  {admin}
export  {user}
export  {staff}


