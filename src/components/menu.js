const serviceRoutes = ['/', '/login']

export default {
  computed: {
    menuItems: function () {
      const r = _.filter(this.$router.options.routes, i => {
        return _.indexOf(serviceRoutes, i.path) < 0
      })
      return r
    }
  },
  props: [],
  methods: {
    label: function (i) {
      return _.get(i, ['cfg', 'label'], i.name)
    }
  },
  template: `
<nav class="navbar navbar-expand-md navbar-dark bg-dark">
  <a class="navbar-brand" href="#"><i class="fas fa-home"></i></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarsExampleDefault">

    <ul class="navbar-nav mr-auto">
      <li class="nav-item" v-for="(i, idx) in menuItems" :key="idx">
        <router-link class="nav-link" :to="i.path">{{ label(i.props) }}</router-link>
      </li>
    </ul>

    <form class="form-inline my-2 my-lg-0">
      <button v-if="$store.getters.userLogged" class="btn btn-warning"
        v-on:click="$store.dispatch('logout')">
        Odhlásit {{$store.state.user.email}}
      </button>
      <b-button v-else @click="$store.commit('showLogin')">
        Přihlásit
      </b-button>
    </form>

</nav>
  `
}
