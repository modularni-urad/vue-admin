export default {
  data: () => {
    return {
      found: [],
      loading: true
    }
  },
  props: ['url', 'data', 'onSelect'],
  async created () {
    const filter = {
      ctype: { like: 'image%' }
    }
    const res = await axios.get(this.$props.url, { params: {
      filter: JSON.stringify(filter),
      fields: 'id,filename,nazev'
    }})
    this.$data.found = res.data
    this.$data.loading = false
  },
  methods: {
    imgURL: function (i) {
      return `${this.$props.url}file/${i.id}/${i.filename}`
    }
  },
  template: `
  <div>
    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
    <div v-else class="d-flex flex-row">
      <img v-for="i in found" 
        :src="imgURL(i)" :alt="i.nazev" 
        style="width: 8em;"
        @click="onSelect(imgURL(i))" />
    </div>
  </div>
  `
}