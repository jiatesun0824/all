import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    routes: [{
            path: '/onlineSensation',
            name: 'onlineSensation',
            component: () =>
                import ('@/pages/online-sensation')
        },
        {
            path: '/personalPublicity',
            name: 'personalPublicity',
            component: () =>
                import ('@/pages/personal-publicity')
        },
        {
            path: '/cutPrice',
            name: 'cutPrice',
            component: () =>
                import ('@/pages/cutPrice')
        },
        {
          path: '/festivalActivity',
          name: 'festivalActivity',
          component: () =>
            import ('@/pages/festival-activity')
        },
        {
          path: '/inviteFriend',
          name: 'inviteFriend',
          component: () =>
            import ('@/pages/invite-friend')
        },
        {
              path: '/nydact',
              name: 'nydact',
              component: () =>
                  import ('@/pages/nydact')
        }
    ]
})
