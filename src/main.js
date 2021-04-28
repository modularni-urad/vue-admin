/* global Vue, VueRouter */
axios.defaults.withCredentials = true
import './vuecustoms.js'
import Store from './store.js'

import AppMenu from './components/menu.js'
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
      { path: '/', component: Dashboard, name: 'home' },
      // { path: '/files', component: FileEditList, name: 'files' }
    ])
  })

  const store = Store(router)

  new Vue({
    router,
    store,
    components: { AppMenu },
    template: `
    <div>
      <AppMenu />
      <div class="container-notused mx-auto p-1">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
`
  }).$mount(mountpoint)
}