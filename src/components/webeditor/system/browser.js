export default {
  data: () => {
    return {
      components: null,
      layouts: null,
      loading: true
    }
  },
  props: ['cfg', 'onSelect'],
  async created () {
    const conpomentsUrl = this.$props.cfg.apiUrl + 'componentlist'
    const layoutsUrl = this.$props.cfg.apiUrl + 'layoutlist'
    const resps = await Promise.all([
      axios.get(conpomentsUrl),
      axios.get(layoutsUrl)
    ])
    this.$data.components = resps[0].data
    this.$data.layouts = resps[1].data
    this.$data.loading = false
  },
  template: `
  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
  <div v-else class="row">
    <h3>components</h3>
    <ul>
      <li v-for="i, idx in components" @click="onSelect(i, 'c')">{{ i }}</li>
    </ul>
    <h3>layouts</h3>
    <ul>
      <li v-for="i, idx in layouts" @click="onSelect(i, 'l')">{{ i }}</li>
    </ul>
    <li @click="onSelect('custom.scss', 's')">custom.scss</li>
  </div>
  `
}
