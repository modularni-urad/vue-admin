/* global Vue, VueRouter */
// axios.defaults.withCredentials = true
import './vuecustoms.js'
import Store from './store.js'

import AppMenu from './components/menu.js'
import Dashboard from './components/pages/dashboard.js'
import LoginScreen from './components/auth/login.js'
import EntityList from './modules/modularni-urad-admin-components/entity/list.js'
import { initConfig } from './modules/modularni-urad-admin-components/entity/utils.js'

export default async function init (mountpoint, settingsURL) {
  const req = await axios(settingsURL)
  const settings = jsyaml.load(req.data)
  const routes = []
  settings.menuCreators = []

  const apps = await Promise.all(_.map(settings.apps, async appcfg => {
    const mod = await import(appcfg.module)
    await mod.setupRoutes(routes, appcfg.path, appcfg, initConfig)
    settings.menuCreators.push(mod.createMenu)
  }))
  const entities = await Promise.all(_.map(settings.routes, async i => {
    await initConfig(i.cfg)
    routes.push({ 
      name: i.name, 
      path: i.path, 
      component: EntityList, 
      props: route => {
        return { query: route.query, cfg: i.cfg }
      }
    })
  }))

  const router = new VueRouter({
    routes: _.union(routes, [
        { path: '/', component: Dashboard, name: 'home' },
      ]
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
      <div class="container-fluid">
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <b-modal v-model="$store.state.loginReqired" title="Přihlásit" hide-footer>
        <LoginScreen />
      </b-modal>
    </div>
`
  }).$mount(mountpoint)
}