/* global axios, API, _ */

import PageEditor from './page.js'
import ComponentEditor from './component.js'

export default {
  data: () => {
    return {
      ready: false,
      pages: null,
      edited: null,
      curr: null,
      loading: false,
      sidebar: false
    }
  },
  props: ['url', 'conf'],
  async created () {
    const res = await axios.get(this.$props.url + 'routes.json')
    this.$data.pages = res.data
    this.$data.ready = true
  },
  computed: {
    treeData: function () {
      const data = {}
      return _.map(this.$data.pages, i => {
        const parts = i.path.split('/')
        return {
          id: i.path,
          name: i.path,
          file: i.data
        }
      })
      
      //"children": 
    }
  },
  methods: {
    myProvider (ctx) {
      const params = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        sort: ctx.sortBy ? `${ctx.sortBy}:${ctx.sortDesc ? 'desc' : 'asc'}` : 'id:asc'
      }
      let data = null
      return axios.get(this.$props.url, { params })
        .then(res => {
          this.totalRows = res.data.pagination.total
            ? res.data.pagination.total
            : this.totalRows
          data = res.data.data
          return data
        })
        .catch(err => {
          const message = err.response.data
          this.$store.dispatch('toast', { message, type: 'error' })
          return []
        })
    },
    add: function () {
      this.$data.curr = null
      this.$bvModal.show('modal-add')
    },
    nodeSelect: async function (node) {
      this.$data.sidebar = false
      this.$data.loading = true
      const dataReq = await axios.get(this.$props.url + node.data.file)
      this.$data.curr = jsyaml.load(dataReq.data)
      this.$data.loading = false
    },
    componentSelect: function (node) {
      this.$data.edited = node.data
    }
  },
  components: {
    'b-tree-view': bootstrapVueTreeview.bTreeView,
    PageEditor,
    ComponentEditor
  },
  template: `
  <div>
    <b-sidebar v-model="sidebar" title="Stránky" shadow backdrop>
      <b-tree-view showIcons
        :renameNodeOnDblClick="false" 
        :contextMenuItems="false"
        :data="treeData"
        @nodeSelect="nodeSelect"
      />
    </b-sidebar>
    
    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
    <b-button @click="sidebar = true">Seznam stránek</b-button>
    <hr />
    <div class="row">
      <div class="col-4">
        <PageEditor v-if="curr" :data="curr" :nodeSelect="componentSelect" />
      </div>
      <div class="col-8">
        <ComponentEditor v-if="edited" :data="edited" />
      </div>
  </div>
  `
}
