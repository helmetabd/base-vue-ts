export default function menu() {
  return [
    {
      name: 'user',
      display_name: 'User',
      icon: 'ri-account-circle-line',
      route: null,
      module: 'user',
      auth_level_min: 2,
      admin_required: true,
      caret: true,
      childs: [
        {
          name: 'user.index',
          display_name: 'User',
          icon: null,
          route: 'user.index',
          module: 'user.users',
          auth_level_min: 3,
          admin_required: false,
          caret: false
        },
      ]
    },
    {
      type: 'system',
      name: 'settings',
      display_name: 'Settings',
      icon: 'ri-settings-5-line',
      route: 'settings',
      module: 'settings',
      auth_level_min: 1,
      admin_required: false,
      caret: false
    }
  ]
}
