const guestnav = {
  items: [
    {
      name:'Map',
      url:'/map',
      icon:'icon-map'
    },
  ] 
}

const usernav = {
  items: [
    {
      name:'Map',
      url:'/map',
      icon:'icon-map'
    }
  ] 
}

const staffnav = {
  items: [
    {
      name:'Map',
      url:'/map',
      icon:'icon-map'
    },
    {
      name: 'People',
      url: '/People',
      icon: 'icon-people',
      children: [
        {
          name: 'User Register',
          url: '/userregister',
          icon: 'icon-bell',
        }
      ],
    },
    {
      name:'Live Stream',
      url:'/livestream',
      icon:'icon-map'
    },
  ] 
}

const adminnav = {
  items: [
    {
      name:'Map',
      url:'/map',
      icon:'icon-map'
    },
    {
      name: 'People',
      url: '/People',
      icon: 'icon-people',
      children: [
        {
          name: 'User Register',
          url: '/userregister',
          icon: 'icon-bell',
        },
        {
          name: 'Staff',
          url: '/staff',
          icon: 'icon-bell',
        },
      ],
    },
    {
      name:'Live Stream',
      url:'/livestream',
      icon:'icon-map'
    },
  ] 
}

export  {guestnav}
export {usernav}
export {staffnav}
export {adminnav};

