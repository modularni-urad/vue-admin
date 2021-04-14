/* global Vue, VueRouter */
import App from './components/App.js'
import './vuecustoms.js'
import Store from './store.js'

import Login from './components/pages/auth/login.js'
import FileUploadingSelect from './components/file_uploading_select.js'
Vue.component('FileUploadingSelect', FileUploadingSelect)
// import cardpreviews from './components/previews.js'
// Vue.component('cardpreviews', cardpreviews)

import Dashboard from './components/pages/dashboard.js'
import { EventList, PostList, FileList, TSPlaceList } from './components/editlists.js'

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: Dashboard, name: 'home' },
    { path: '/events', component: EventList, name: 'event_list' },
    { path: '/posts', component: PostList, name: 'post_list' },
    { path: '/files', component: FileList, name: 'file_list' },
    { path: '/ts_places', component: TSPlaceList, name: 'ts_place_list' }
  ]
})

const store = Store(router)

new Vue({
  router,
  store,
  template: App.template
}).$mount('#app')
