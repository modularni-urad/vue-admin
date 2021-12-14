export default {
  data() {
    return {
      query: '',
      users: []
    }
  },
  props: ['config', 'disabled', 'data', 'onUserSelect'],
  methods: {
    lookupUser: function() {
      // in practice this action should be debounced
      const url = this.config.user_search_url.replace('{{QUERY}}', this.query)
      fetch(url)
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.users = data
        })
    },
    select: function ($event) {
      if (this.onUserSelect) this.onUserSelect($event)
      else {
        const { data, config } = this.$props
        data[config.name] = $event.id
      }
    },
    serialize: function (item) {
      return `${item.name} (${item.username})`
    }
  },
  components: { 'vue-typeahead-bootstrap': VueTypeaheadBootstrap },
  template: `
<validation-provider v-bind:rules="config.rules" v-slot="{ errors }">
  <b-form-group
    :state="errors.length === 0"
    :label="config.label"
    :invalid-feedback="errors[0]"
  >
    
    <vue-typeahead-bootstrap
      v-model="query"
      :disabled="disabled"
      :ieCloseFix="false"
      :data="users"
      :serializer="serialize"
      @hit="select"
      :placeholder="config.placeholder || 'prohledat uživatele'"
      @input="lookupUser"
      :background-variant-resolver="(user) => ((user.id % 2) == 0) ? 'light':'dark'"
    />
    <NameSpan v-if="data[config.name]" :uid="data[config.name]" :cfg="config" />

  </b-form-group>
</validation-provider>
  `
}