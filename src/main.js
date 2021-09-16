/* global Vue, VueRouter */
axios.defaults.withCredentials = true
import './vuecustoms.js'
import Store from './store.js'

import AppMenu from './components/menu.js'
import Dashboard from './components/pages/dashboard.js'
import Page from './components/page.js'
import LoginScreen from './components/auth/login.js'
import { initConfig } from './modules/modularni-urad-admin-components/entity/utils.js'

import { 
  setupRoutes as setupJednaniRoutes,
  createMenu as createJednaniMenu
} from './modules/jednani/index.js'

import {
  setupRoutes as setupTaskmanRoutes,
  createMenu as createTaskMenu
} from './modules/taskman/index.js'

export default async function init (mountpoint, settingsURL) {
  const req = await axios(settingsURL)
  const settings = jsyaml.load(req.data)
  settings.menuCreators = settings.newAdmin 
    ? [createJednaniMenu, createTaskMenu]
    : []

  const webRoutes = _.map(settings.routes, i => {
    return { name: i.name, path: i.path, component: Page, props: i }
  })

  const router = new VueRouter({
    routes: _.union(webRoutes, [
        { path: '/', component: Dashboard, name: 'home' },
      ],
      await setupJednaniRoutes('/', { url: settings.jednani_api }, initConfig),
      await setupTaskmanRoutes('/taskman', { url: settings.taskman_api }, initConfig)
    )
  })

  const store = Store(router, settings)

  new Vue({
    router,
    store,
    components: { AppMenu, LoginScreen },
    template: `
    <div>
      <AppMenu />
      <div class="container-notused mx-auto p-1">
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <b-modal v-model="$store.state.loginReqired" title="Přihlásit" hide-footer>
        <LoginScreen />
      </b-modal>
    </div>
`
  }).$mount(mountpoint)
}