/* global Vue, VueToast */

Vue.use(VueToast, {
  // One of options
  position: 'top-right'
})

export default {
  template: `
<div>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <div>
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Domů</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/web">Web</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/posts">Clanky</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/events">Události</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ts_places">Místa</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/files">Soubory</router-link>
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

  <div class="container-notused mx-auto p-1">
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</div>
  `
}
