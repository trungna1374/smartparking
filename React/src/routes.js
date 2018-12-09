import DefaultLayout from './containers/DefaultLayout';
import UserDetail from './views/People/UserDetail';
import UserUpdate from './views/People/UserUpdate';
import StaffUpdate from './views/People/StaffUpdate';
import UserRegister from './views/People/UserRegister';
import Staff from './views/People/Staff';
import UserRegisterAdd from './views/People/UserRegisterAdd';
import StaffAdd from './views/People/StaffAdd';
import ParkLocation from './views/Map/ParkLocation';
import LiveStreamIn from './views/LiveStream/LiveStreamIn';
import LiveStreamOut from './views/LiveStream/LiveStreamOut';

import UpdateOwner from './views/People/UpdateOwner';
import UpdateProfileOwner from './views/People/UpdateProfileOwner';
import UpdateProfileUser from './views/People/UpdateProfileUser';
import Statistics from './views/Statistics/Statistics';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const admin = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/userregister', exact: true, name: 'User Register', component: UserRegister },
  { path: '/staff', exact: true, name: 'Staff', component: Staff },
  { path: '/userregister/userdetail/:id', exact: true, name: 'User Detailt', component: UserDetail },
  { path: '/userregister/userupdate/:id', exact: true, name: 'User Update', component: UserUpdate },
  { path: '/staff/staffupdate/:id', exact: true, name: 'Staff Update', component: StaffUpdate },
  { path: '/userregister/useradd', exact: true, name: 'User Add', component: UserRegisterAdd },
  { path: '/staff/staffadd', exact: true, name: 'Staff Add', component: StaffAdd },
  { path: '/map', exact: true, name: 'Map', component: ParkLocation },
  { path: '/livestream/livestreamin', exact: true, name: 'Livestream Gate In', component: LiveStreamIn },
  { path: '/livestream/livestreamout', exact: true, name: 'Livestream Gate Out', component: LiveStreamOut },
  { path: '/updatepassword', exact: true, name: 'Update Password', component: UpdateOwner },
  { path: '/updateprofileStaff/:id', exact: true, name: 'Update Profile', component: UpdateProfileOwner },
  { path: '/statistics', exact: true, name: 'Statistics', component: Statistics },
  { path: '/updateprofileUser/:id', exact: true, name: 'Update Profile', component: UpdateProfileUser },
];

const user = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/map', exact: true, name: 'Map', component: ParkLocation },
  { path: '/updatepassword', exact: true, name: 'Update Password', component: UpdateOwner },
  { path: '/updateprofile/:id', exact: true, name: 'Update Profile', component: UpdateProfileUser },
];

const officer = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/userregister', exact: true, name: 'User Register', component: UserRegister },
  { path: '/userregister/userdetail/:id', exact: true, name: 'User Detailt', component: UserDetail },
  { path: '/userregister/userupdate/:id', exact: true, name: 'User Update', component: UserUpdate },
  { path: '/userregister/useradd', exact: true, name: 'User Add', component: UserRegisterAdd },
  { path: '/map', exact: true, name: 'Map', component: ParkLocation },
  { path: '/updatepassword', exact: true, name: 'Update Password', component: UpdateOwner },
  { path: '/updateprofile/:id', exact: true, name: 'Update Profile', component: UpdateProfileOwner },
  { path: '/statistics', exact: true, name: 'Statistics', component: Statistics },
]

const security = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/map', exact: true, name: 'Map', component: ParkLocation },
  { path: '/livestream/livestreamin', exact: true, name: 'Livestream Gate In', component: LiveStreamIn },
  { path: '/livestream/livestreamout', exact: true, name: 'Livestream Gate Out', component: LiveStreamOut },
  { path: '/updatepassword', exact: true, name: 'Update Password', component: UpdateOwner },
  { path: '/updateprofile/:id', exact: true, name: 'Update Profile', component: UpdateProfileOwner },
]

const guest = [
    { path: '/', exact: true, name: 'Home', component: DefaultLayout },
    { path: '/map', exact: true, name: 'Map', component: ParkLocation },
]


export  {guest}
export  {admin}
export  {user}
export  {security}
export  {officer}


