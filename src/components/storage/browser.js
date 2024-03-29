import ImageList from './imagelist.js'
export default {
  data: () => {
    return {
      found: [],
      formconfig: {
        name: 'tags',
        options: null,
        attrmap: { value: "value", text: "value" }
      },
      filter: {
        tags: ''
      },
      loading: true
    }
  },
  props: ['config', 'data', 'onSelect'],
  async created () {
    this.$data.formconfig.options = this.$props.config.tag_url
    this.load()
  },
  watch: {
    'filter.tags': function (val) {
      this.load()
    }
  },
  methods: {
    load: async function () {
      this.$data.loading = true
      const filter = {
        ctype: { like: 'image%' }
      }
      if (this.$data.filter.tags) {
        filter.and = _.map(this.$data.filter.tags.split(','), i => {
          return { tags: { like: "%" + i + "%" } }
        })
      }
      const res = await axios.get(this.$props.config.fileindex_url, { params: {
        filter: JSON.stringify(filter),
        fields: 'filename,nazev'
      }})
      this.$data.found = res.data
      this.$data.loading = false
    }
  },
  components: { ImageList },
  template: `
  <div>
    <dyn-taginput :config="formconfig" :data="filter" />
    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
    <div v-else class="d-flex flex-row">
      <ImageList  :onSelect="onSelect" 
                  :storage_url="config.storage_url" 
                  :images="found" />
    </div>
  </div>
  `
}