
export default {
  computed: {
    menuItems: function () {
      return _.filter(this.$router.options.routes, i => {
        return _.get(i, ['props', 'menu'], false)
      })
    }
  },
  props: [],
  template: `
<nav class="navbar navbar-expand-md navbar-dark bg-dark">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarsExampleDefault">
    <div>
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" v-for="(i, idx) in menuItems" :key="idx">
          <router-link class="nav-link" :to="i.path">{{ i.props.cfg.label }}</router-link>
        </li>
      </ul>
    </div>
    <button v-if="$store.getters.userLogged" class="btn btn-warning"
      v-on:click="$store.dispatch('logout')">
      Odhlásit {{$store.state.user.email}}
    </button>
    <router-link v-else class="btn btn-primary" to="/login">
      Přihlásit
    </router-link>
  </div>
</nav>
  `
}
