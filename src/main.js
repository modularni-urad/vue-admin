/* global Vue, VueRouter */
axios.defaults.withCredentials = true
import App from './components/App.js'
import './vuecustoms.js'
import Store from './store.js'

import Login from './components/pages/auth/login.js'
import Dashboard from './components/pages/dashboard.js'
import Page from './components/page.js'
import FileEditList from './components/file_edit_list.js'

export default async function init (mountpoint, settingsURL) {
  const req = await axios(settingsURL)
  const data = jsyaml.load(req.data)

  const webRoutes = _.map(data.routes, i => {
    return { path: i.path, component: Page, props: i }
  })

  const router = new VueRouter({
    routes: _.union(webRoutes, [
      { path: '/login', component: Login },
      { path: '/', component: Dashboard, name: 'home' },
      { path: '/files', component: FileEditList, name: 'files' }
    ])
  })

  const store = Store(router)

  new Vue({
    router,
    store,
    template: App.template
  }).$mount(mountpoint)
}