export default {
  data: () => {
    return {
      items: []      
    }
  },
  created () {
    if (this.$store.state.cfg.notifyer_mock) {
      this.items = this.$store.state.cfg.notifyer_mock
      return
    }
    this.load()
    setInterval(this.load, 10000)
  },
  methods: {
    load: async function () {
      const url = this.$store.state.cfg.notifyer_api || '/api/notifyer/'
      try {
        const res = await axios.get(url)
        this.$data.items = res.data
      } catch (_) {}
    },
    onClick: function (i) {
      const url = this.$store.state.cfg.notifyer_api || '/api/notifyer/'
      const idx = _.findIndex(this.$data.items, { id: i.id })
      this.items.splice(idx, 1)
      axios.put(`${url}/${i.id}`).catch(err => console.error(err))
      this.$router.push({ name: i.type, params: { id: i.data }})
    }
  },
  template: `
  <b-dropdown v-if="items.length > 0">
    <template #button-content>
      <i class="fas fa-bell"></i> <b-badge variant="light">{{ items.length }}</b-badge>
    </template>
    <b-dropdown-item v-for="i,idx in items" :key="idx" @click="onClick(i)">
      {{ i.content }}
    </b-dropdown-item>
  </b-dropdown>
  `
}
