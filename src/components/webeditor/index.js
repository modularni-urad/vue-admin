/* global axios, API, _ */
import PageEditor from './page.js'
import { newPageConfig } from './formconfigs.js'
import ItemForm from '../entity/form.js'
import { buildTreeData } from './utils.js'
import MyTreeView from './treeView.js'
import SysBrowser from './system/browser.js'
import SysEditor from './system/editor.js'

export default {
  data: () => {
    return {
      ready: false,
      sysItem: null,
      pages: null,
      curr: null,
      loading: false,
      treeData: null
    }
  },
  props: ['cfg'],
  async created () {
    const route = this.$router.currentRoute
    if (route.query.sysItem) {
      this.$data.sysItem = route.query.sysItem
      return
    }
    if (route.query.id) {
      this.$data.curr = route.query.id
      return
    }
    const res = await axios.get(this.$props.cfg.routesUrl)
    this.$data.pages = res.data
    this.$data.treeData = buildTreeData (this.$data.pages)
    this.$data.ready = true
  },
  computed: {
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
    deletePage: function (node) {
    },
    onAddedPage: async function (page) {
      if (page) {
        const req = {
          method: 'POST',
          url: this.$props.cfg.apiUrl,
          data: page
        }
        try {
          const res = await this.$store.dispatch('send', req)
          this.$store.dispatch('toast', { message: 'uloženo' })
          const newPage = { data: `${page.path}.yaml`, path: `/${page.path}` }
          this.$router.push({ path: this.$router.currentRoute.path, query: { id: newPage.data } })
        } catch (err) {
          const message = err.response.data
          this.$store.dispatch('toast', { message, type: 'error' })
        }
      }
      this.$bvModal.hide('modal-add')
    },
    editPage: async function (node) {
      this.$router.push({ path: this.$router.currentRoute.path, query: { id: node.file } })
    },
    editSysItem: function (file, typ) {
      this.$router.push({ path: this.$router.currentRoute.path, query: { 
        sysItem: `${typ}__${file}` 
      } })
    },
    toggle: function (node) {
      node.collapsed = !node.collapsed
    }
  },
  components: {
    'b-tree-view': MyTreeView,
    PageEditor,
    'item-form': ItemForm,
    SysBrowser, 
    SysEditor
  },
  template: `
<PageEditor v-if="curr" :data="curr" :cfg="cfg" />
<SysEditor v-else-if="sysItem" :data="sysItem" :cfg="cfg" />
<div v-else>
  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
  <b-button v-b-modal.modal-sys>Systemové komponenty</b-button>
  <b-tree-view v-if="ready" class="m-2"
    :data="treeData" :sett="{}"
    :events="{toggle, editPage, deletePage, addPage}"
  />
  <b-modal v-if="ready" size="xl" id="modal-add" title="Upravit" hide-footer>
    <item-form :config="addFormConfig" :onSubmit="onAddedPage">
    </item-form>
  </b-modal>
  <b-modal size="xl" id="modal-sys" title="Sytemove soubory" hide-footer>
    <SysBrowser :cfg="cfg" :onSelect="editSysItem">
  </b-modal>
</div>
  `
}
