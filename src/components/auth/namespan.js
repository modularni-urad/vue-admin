const _loaded = {}
const _promises = {}

function load (id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: { id: 42, jmeno: 'Vaclav Klecanda' } })
    }, 1000)
  })
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
      const p = _promises[this.uid] || load(this.uid)
      p.then(res => {
        Object.assign(this.$data, { item: res.data, loaded: true })
        delete _promises[this.uid]
      })
    }
  },
  template: `
    <span v-if="loaded">{{ item.jmeno }}</span>
    <i v-else class="fas fa-spinner fa-spin"></i>
  `
}