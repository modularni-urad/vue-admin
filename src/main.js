/* global Vue, VueRouter */
import App from './components/App.js'
import './vuecustoms.js'
import Store from './store.js'

import Login from './components/pages/auth/login.js'

import Dashboard from './components/pages/dashboard.js'
import EditList from './components/pages/list.js'

const EventList = {
  components: { EditList },
  template: '<EditList entity="events" label="Události" />'
}
const PostList = {
  components: { EditList },
  template: '<EditList entity="posts" label="Článečky" />'
}

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: Dashboard, name: 'home' },
    { path: '/events', component: EventList, name: 'event_list' },
    { path: '/posts', component: PostList, name: 'post_list' }
  ]
})

const store = Store(router)

new Vue({
  router,
  store,
  template: App.template
}).$mount('#app')
