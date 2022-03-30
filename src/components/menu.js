import Notifications from './menu/notifications.js'

const MenuItem = {
  props: ['item'],
  template: `
  <li class="nav-item">
    <router-link class="nav-link" :to="item.to">{{ item.label }}</router-link>
  </li>
  `
}

const DropdownMenuItem = {
  data: () => {
    return {
      open: false
    }
  },
  props: ['item'],
  methods: {
    onClick: function (e) {
      this.$data.open = !this.$data.open
    },
    select: function (i) {
      this.$router.push(i.to)
      this.$data.open = false
    }
  },
  template: `
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="javascript:void(0);" @click="onClick">
      {{ item.label }}
    </a>
    <div class="dropdown-menu" style="display: block;" v-if="open">
      <a v-for="i,idx in item.children" :key="idx" 
        href="javascript:void(0);" class="dropdown-item" @click="select(i)">
        {{ i.label }}
      </a>
    </div>
  </li>
  `
}

export default {
  components: { MenuItem, DropdownMenuItem, Notifications },
  template: `
<nav class="navbar navbar-expand-md navbar-dark bg-dark">
  <a class="navbar-brand" href="#"><i class="fas fa-home"></i></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarsExampleDefault">

    <ul v-if="this.$store.getters.userLogged" class="navbar-nav mr-auto">
      <component :is="i.children ? 'DropdownMenuItem' : 'MenuItem'" 
        v-for="(i, idx) in this.$store.getters.menuItems" :key="idx" 
        :item="i" />
    </ul>

    <form class="form-inline my-2 my-lg-0">
      <Notifications v-if="$store.getters.userLogged" />
      <b-dropdown
        v-if="$store.getters.userLogged"
        variant="danger"
        :text="$store.state.user.name"
      >
        <b-dropdown-item @click.prevent="$store.dispatch('changepwd')">
          změnit si heslo
        </b-dropdown-item>
        <b-dropdown-item @click.prevent="$store.dispatch('logout')">
          odhlásit <i class="fas fa-sign-out-alt"></i>
        </b-dropdown-item>
      </b-dropdown>
      <b-button v-else @click="$store.commit('showLogin')">
        přihlásit <i class="fas fa-sign-in-alt"></i>
      </b-button>
    </form>

</nav>
  `
}
