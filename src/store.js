import { loadScript, loadStyle } from './modules/modularni-urad-admin-components/script_service.js'
import getMenuItems from './menuItems.js'
const KEY = window.location.hostname + window.location.pathname + '_modurad_user_'
const savedUser = localStorage.getItem(KEY)
const isVector = (url) => url.match(/.*.svg$/)

export default function (router, cfg) {
  //
  const store = new Vuex.Store({
    state: {
      user: savedUser && JSON.parse(savedUser),
      loginReqired: false,
      cfg,
      router
    },
    getters: {
      userLogged: state => {
        return state.user !== null
      },
      UID: state => (state.user ? state.user.id : null),
      isMember: state => group => {
        try {
          return state.user.groups.indexOf(group) >= 0
        } catch (_) {
          return false
        }
      },
      menuItems: getMenuItems,
      hasMultipleLoginEPs: state => {
        const eps = cfg.login.endpoints
        return _.isArray(eps) && eps.length > 1
      },
      mediaUrl: (state) => (media, params = null) => {
        const murl = media.match(/^https?:\/\//) ? media : `${cfg.cdn}/${media}`
        if (isVector(murl) || (!params && !murl.match(/^https?:\/\//))) {
          // je to vektor, nebo nechci modifier
          return murl
        }
        return `${cfg.cdnapi}/resize/?url=${encodeURIComponent(murl)}&${params}`
      }
    },
    mutations: {
      profile: (state, profile) => {
        localStorage.setItem(KEY, JSON.stringify(profile))
        state.user = profile
      },
      showLogin: (state) => {
        state.loginReqired = true
      },
      hideLogin: (state) => {
        state.loginReqired = false
      }
    },
    actions: {
      toast: function (ctx, opts) {
        Vue.$toast.open(opts)
      },
      changepwd: async function (ctx, opts) {
        const newPwd = prompt('zadejte nové heslo')
        if (!newPwd) return
        await this.dispatch('send', {
          url: `${ctx.state.cfg.consts.ORGAPI}/userman/chpasswd/${this.state.user.id}`,
          method: 'put',
          data: { password: newPwd }
        })
        this.dispatch('toast', { message: 'heslo změněno' })
      },
      login: async function (ctx, opts) {
        try {
          const eps = cfg.login.endpoints
          const url = this.getters.hasMultipleLoginEPs 
            ? opts.endpoint 
            : _.isArray(eps) ? eps[0].value : eps
          const data = _.pick(opts, 'username', 'password')
          const loginReq = await axios.post(url + '?token=1', data)
          const profile = loginReq.data
          this.commit('profile', profile)
          this.commit('hideLogin')
          return loginReq.data
        } catch (e) {
          const message = e.response.data
          this.dispatch('toast', { message, type: 'error' })
        }
      },
      logout: async function (ctx, opts) {
        try {
          await axios.post(cfg.login.logout)
          this.commit('profile', null)
          router.push('/')
        } catch (e) {
          const message = e.response.data
          this.dispatch('toast', { message, type: 'error' })
        }
      },
      send: function (ctx, opts) {
        this.state.user.token && Object.assign(opts, {
          headers: { 'Authorization': `Bearer ${this.state.user.token}`}
        })
        opts.url = opts.url.replace(/\/\//g, '/').replace(':/', '://') // remove //
        return axios(opts)
      },
      init: async function (ctx, opts) {
        try {
          const res = await axios.get(`${API}/profile`)
          this.commit('profile', res.data.user)
        } catch (_) {}
      },
      handleError: function (ctx, opts) {
      },
      loadScript: function (ctx, src) {
        return loadScript(src)
      },
      loadStyle: function (ctx, src) {
        return loadStyle(src)
      }
    }
  })

  axios.interceptors.response.use(
    function (response) { return response },
    function (error) {
      switch (error.response.status) {
        case 401:
          store.dispatch('logout')
          return store.dispatch('toast', {
            message: 'Přihlášení vypršelo',
            type: 'success'
          })
        default:
          throw error
      }
    })

  return store
}
