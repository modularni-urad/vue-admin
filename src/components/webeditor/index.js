/* global axios, API, _ */

import PageEditor from './page.js'
import ComponentEditor from './component.js'
import formconfigManager from './formconfigs.js'

export default {
  data: () => {
    return {
      ready: false,
      pages: null,
      edited: null,
      formConfig: null,
      selectedPage: null,
      curr: null,
      loading: false,
      sidebar: false
    }
  },
  props: ['url', 'conf'],
  async created () {
    this.getFormconfig = formconfigManager(this.$props.url)
    const res = await axios.get(this.$props.url + 'routes.json')
    this.$data.pages = res.data
    this.$data.ready = true
  },
  computed: {
    treeData: function () {
      
      function _insert2Tree (node, subtree, path) {
        const existing = _.find(subtree, i => i.foldername === path[0])
        if (existing && path.length > 1) {
          existing.children = existing.children || []
          _insert2Tree(node, existing.children, _.rest(path))
        } else {
          subtree.push({
            id: node.path,
            name: path[0],
            file: node.data,
            foldername: path[0]
          })
        }
      }
      const sorted = _.sortBy(this.$data.pages, 'path')
      const tree = [{ id: '/', file: 'index.yaml', name: '/', foldername: '' }]
      _.map(_.rest(sorted), i => {
        const parts = i.path.split('/')
        _insert2Tree(i, tree, parts)
      })
      return tree
    }
  },
  methods: {
    add: function () {
      this.$data.curr = null
      this.$bvModal.show('modal-add')
    },
    nodeSelect: async function (node, selected) {
      if (selected) {
        this.$data.sidebar = false
        this.$data.loading = true
        this.$data.selectedPage = node.data
        const dataReq = await axios.get(this.$props.url + node.data.file)
        this.$data.curr = jsyaml.load(dataReq.data)
        this.$data.edited = null
        this.$data.loading = false
      } else if (node.data === this.selectedPage) {
        this.selectedPage = null
        this.$data.curr = null
      }
    },
    componentSelect: async function (node, selected) {
      if (selected) {
        try {
          this.$data.formConfig = await this.getFormconfig(node.data.component)
          this.$data.edited = node.data
        } catch (e) {
          const m = 'tento komponent není editovatelný'
          this.$store.dispatch('toast', { message: m, type: 'error' })
        }
      } else if (node.data === this.edited) {
        this.edited = null
      }
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
    <b-button @click="sidebar = true"><< Seznam stránek</b-button>
    <hr />
    <div class="row">
      <div class="col-4">
        <PageEditor v-if="curr" :data="curr" :nodeSelect="componentSelect" />
      </div>
      <div class="col-8">
        <ComponentEditor v-if="edited" 
          :apiurl="url" 
          :formConfig="formConfig" 
          :data="edited" 
          :page="selectedPage" />
      </div>
    </div>
  </div>
  `
}
