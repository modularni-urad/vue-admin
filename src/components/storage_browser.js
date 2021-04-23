import formComponents from '../../bootstrap-vue-dynamic-form/index.js'

export default {
  data: () => {
    return {
      found: [],
      formconfig: {
        name: 'tags',
        options: null,
        attrmap: { value: "id", text: "title" }
      },
      filter: {
        tags: ''
      },
      loading: true
    }
  },
  props: ['url', 'tagurl', 'data', 'onSelect'],
  async created () {
    this.$data.formconfig.options = this.$props.tagurl
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
  components: formComponents,
  template: `
  <div>
    <dyn-taginput :config="formconfig" :data="filter" />
    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
    <div v-else class="d-flex flex-row">
      <img class="img-thumbnail img-fluid" v-for="i in found" 
        :src="imgURL(i)" :alt="i.nazev" 
        style="width: 8em;"
        @click="onSelect(imgURL(i))" />
    </div>
  </div>
  `
}