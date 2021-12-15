export default {
  data() {
    return {
      query: '',
      users: []
    }
  },
  props: ['config', 'disabled'],
  methods: {
    lookupUser: function() {
      // in practice this action should be debounced
      if (this.query.length === 0) return
      const searchURL = this.config.user_search_url || this.$store.state.cfg.user_search_url
      const url = searchURL.replace('{{QUERY}}', this.query)
      fetch(url)
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.users = data
        })
    },
    select: function (value) {
      this.$emit('input', value)
    },
    serialize: function (item) {
      return `${item.name} (${item.username})`
    }
  },
  components: { 'vue-typeahead-bootstrap': VueTypeaheadBootstrap },
  template: `    
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
  `
}