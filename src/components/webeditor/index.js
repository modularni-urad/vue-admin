/* global axios, API, _ */

import PageEditor from './page.js'
import ComponentEditor from './component.js'
import formconfigManager, { newPageConfig } from './formconfigs.js'
import ItemForm from '../pages/form.js'

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
  props: ['cfg'],
  async created () {
    this.getFormconfig = formconfigManager(this.$props.cfg.url)
    const res = await axios.get(this.$props.cfg.url + 'routes.json')
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
    },
    addFormConfig: function () {
      const parentOptions = _.map(_.sortBy(this.$data.pages, 'path'), i => {
        return { text: i.path, value: i.data }
      })
      return newPageConfig(parentOptions)
    }
  },
  methods: {
    addPage: function () {
      this.$bvModal.show('modal-add')
    },
    onAddedPage: async function (page) {
      if (page) {
        const req = {
          method: 'POST',
          url: this.$props.cfg.url,
          data: page
        }
        try {
          const res = await this.$store.dispatch('send', req)
          this.$store.dispatch('toast', { message: 'uloženo' })
          const newPage = { data: `${page.path}.yaml`, path: `/${page.path}` }
          this.$data.pages.push(newPage)
          this.$data.selectedPage = newPage
          this.$data.curr = jsyaml.load(res.data.content)
          this.$data.edited = null
        } catch (err) {
          const message = err.response.data
          this.$store.dispatch('toast', { message, type: 'error' })
        }
      }
      this.$bvModal.hide('modal-add')
    },
    nodeSelect: async function (node, selected) {
      if (selected) {
        this.$data.sidebar = false
        this.$data.loading = true
        this.$data.selectedPage = node.data
        const dataReq = await axios.get(this.$props.cfg.url + node.data.file)
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
        this.$data.editedComponentID = node._uid
        try {
          this.$data.formConfig = await this.getFormconfig(node.data.component)
          this.$data.edited = node.data
        } catch (e) {
          const m = 'tento komponent není editovatelný'
          this.$store.dispatch('toast', { message: m, type: 'error' })
        }
      } else if (node._uid === this.$data.editedComponentID) {
        this.edited = null
      }
    }
  },
  components: {
    'b-tree-view': bootstrapVueTreeview.bTreeView,
    PageEditor,
    ComponentEditor,
    'item-form': ItemForm
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
      <b-button class="m-4" @click="addPage">Přidat stránku</b-button>
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
          :apiurl="cfg.url" 
          :formConfig="formConfig" 
          :data="edited" 
          :page="selectedPage" />
      </div>
    </div>

    <b-modal v-if="ready" size="xl" id="modal-add" title="Upravit" hide-footer>
      <item-form :config="addFormConfig" :onSubmit="onAddedPage">
      </item-form>
    </b-modal>
  </div>
  `
}
