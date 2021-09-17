const _loaded = {}
const _promises = {}

function load (uid, cfg) {
  return axios.get(`${cfg.user_info_url}/${uid}`)
}

export default {
  data: () => {
    return {
      loaded: false,
      item: null
    }
  },
  props: ['uid', 'cfg'],
  created () {
    this.loaded = this.uid in _loaded
    this.item = _loaded[this.uid] ? _loaded[this.uid] : null
    if (!(this.uid in _loaded)) {
      const p = _promises[this.uid] || load(this.uid, this.$store.state.cfg)
      p.then(res => {
        Object.assign(this.$data, { item: res.data, loaded: true })
        delete _promises[this.uid]
      })
    }
  },
  template: `
    <span v-if="this.uid && loaded">{{ item.name }}</span>
    <i v-else-if="this.uid" class="fas fa-spinner fa-spin"></i>
  `
}