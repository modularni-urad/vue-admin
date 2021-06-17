const formConfig = [
  {
    name: 'username',
    component: 'dyn-input',
    label: "uživatelské jméno",
    rules: 'required'
  },
  {
    name: 'password',
    component: 'dyn-input',
    inputtype: 'password',
    label: "heslo",
    rules: 'required'
  }
]

export default {
  data: () => {
    return {
      formdata: {
        username: '',
        password: '',
        endpoint: null
      },
      error: null,
      errcount: 0,
      submitting: false,
      config: formConfig
    }
  },
  created () {
    const endpoints = this.$store.state.cfg.login.endpoints
    const add = this.$store.getters.hasMultipleLoginEPs && this.$data.config.length === 2 
    add && this.$data.config.push({
      name: "endpoint",
      component: "dyn-select",
      options: endpoints,
      label: 'uživatelský kmen'
    })
    this.$data.formdata.endpoint = endpoints[0].value
  },
  methods: {
    login: async function () {
      try {
        this.$data.error = null
        this.$data.submitting = true
        await this.$store.dispatch('login', this.$data.formdata)
      } catch (err) {
        this.$data.error = err.response.data
        this.$data.errcount++
      } finally {
        this.$data.submitting = false
      }
    }
  },
  template: `
  <ValidationObserver v-slot="{ invalid }">
    <form @submit.prevent="login">

      <component v-for="c in config" :key="c.name"
        :is="c.component" :config="c" :data="formdata">
      </component>

      <b-button type="submit" class="mt-3" :disabled="invalid || submitting">
        Odeslat
      </b-button>

      <div v-if="error" class="alert alert-danger" role="alert">
        Neplatné přihlašovací údaje
      </div>

      <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
    </form>
  </ValidationObserver>
  `,
  template2: `
<form>
  <div class="input-group mb-3">
    <div class="input-group-append">
      <span class="input-group-text"><i class="fas fa-user"></i></span>
      </div>
      <input type="text" name="" class="form-control"
        v-model='record.username' placeholder="Email/Telefon">
    </div>

  <div class="input-group mb-2">
    <div class="input-group-append">
    <span class="input-group-text"><i class="fas fa-key"></i></span>
    </div>
    <input type="password" name="pwd" class="form-control"
      v-model='record.password' placeholder="Heslo">
  </div>

  <div clas="danger" v-if="error">
    Nesprávné přihlašovací údaje!
    <router-link v-if="errcount > 0" to="/newpwd">
      Zapomenuté heslo?
    </router-link>
  </div>

  <div class="d-flex justify-content-center mt-3 login_container">
    <button type="button" name="button" class="btn btn-primary" v-on:click="login"
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      Přihlásit se
    </button>
    <div>
      <i class="fas fa-spinner fa-spin" v-if="working"></i>
    </div>
  </div>
</form>
  `
}
