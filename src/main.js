/* global Vue, VueRouter */
import App from './components/App.js'
import './vuecustoms.js'
import Store from './store.js'

import Login from './components/pages/auth/login.js'

import Dashboard from './components/pages/dashboard.js'
import EditList from './components/pages/list.js'
import { formCfg, prepareFileFormData } from './components/fileForm.js'

const EventList = {
  components: { EditList },
  template: `
    <EditList label="Události" 
      url="${API}/events/" conf="${API}/_events/config.json" />`
}
const PostList = {
  components: { EditList },
  template: `
    <EditList label="Článečky"
      url="${API}/posts/" conf="${API}/_posts/config.json" />`
}
const FileList = {
  data: () => { return { formCfg } },
  methods: { prepareFileFormData },
  components: { EditList },
  template: `<EditList label="Soubory" url="http://test.vxk.cz/cdn/" 
      :conf="formCfg" :prepareData="prepareFileFormData" />`
}

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: Dashboard, name: 'home' },
    { path: '/events', component: EventList, name: 'event_list' },
    { path: '/posts', component: PostList, name: 'post_list' },
    { path: '/files', component: FileList, name: 'file_list' }
  ]
})

const store = Store(router)

new Vue({
  router,
  store,
  template: App.template
}).$mount('#app')
