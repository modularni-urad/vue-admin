/* global Vue, VueRouter */
axios.defaults.withCredentials = true
import './vuecustoms.js'
import Store from './store.js'

import AppMenu from './components/menu.js'
import Dashboard from './components/pages/dashboard.js'
import Page from './components/page.js'
import LoginScreen from './components/auth/login.js'

export default async function init (mountpoint, settingsURL) {
  const req = await axios(settingsURL)
  const settings = jsyaml.load(req.data)

  const webRoutes = _.map(settings.routes, i => {
    return { path: i.path, component: Page, props: i }
  })

  const router = new VueRouter({
    routes: _.union(webRoutes, [
      { path: '/', component: Dashboard, name: 'home' },
    ])
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