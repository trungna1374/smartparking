const guestnav = {
  items: [
    {
      name: 'Map',
      url: '/map',
      icon: 'icon-map'
    },
  ]
}

const usernav = {
  items: [
    {
      name: 'Map',
      url: '/map',
      icon: 'icon-map'
    }
  ]
}

const officernav = {
  items: [
    {
      name: 'Map',
      url: '/map',
      icon: 'icon-map'
    },
    {
      name: 'People',
      url: '/People',
      icon: 'icon-people',
      children: [
        {
          name: 'User Register',
          url: '/userregister',
          icon: 'icon-user',
        }
      ],
    },
  ]
}

const securitynav = {
  items: [
    {
      name: 'Map',
      url: '/map',
      icon: 'icon-map'
    },
    {
      name: 'Livestream',
      url: '/livestream',
      icon: 'cui-monitor',
      children: [
        {
          name: 'Livestream Gate in',
          url: '/livestream/livestreamin',
          icon: 'cui-monitor',
        },
        {
          name: 'Livestream Gate out',
          url: '/livestream/livestreamout',
          icon: 'cui-monitor',
        },
      ],
    },
  ]
}

const adminnav = {
  items: [
    {
      name: 'Map',
      url: '/map',
      icon: 'icon-map'
    },
    {
      name: 'People',
      url: '/People',
      icon: 'icon-people',
      children: [
        {
          name: 'User Register',
          url: '/userregister',
          icon: 'icon-user',
        },
        {
          name: 'Staff',
          url: '/staff',
          icon: 'icon-user',
        },
      ],
    },
    {
      name: 'Livestream',
      url: '/livestream',
      icon: 'cui-monitor',
      children: [
        {
          name: 'Livestream Gate in',
          url: '/livestream/livestreamin',
          icon: 'cui-monitor',
        },
        {
          name: 'Livestream Gate out',
          url: '/livestream/livestreamout',
          icon: 'cui-monitor',
        },
      ],
    },
    {
      name: 'Statistics',
      url: '/statistics',
      icon: 'icon-graph'
    },
  ]
}

export { guestnav }
export { usernav }
export { officernav }
export { securitynav }
export { adminnav }

