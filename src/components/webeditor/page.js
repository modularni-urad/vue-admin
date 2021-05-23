/* global axios, API, _ */
import ComponentEditor from './component.js'
import MyTreeView from './treeView.js'
import formconfigManager from './formconfigs.js'

export default {
  data: () => {
    return {
      data: null,
      ready: false,
      edited: null
    }
  },
  props: ['cfg'],
  async created () {
    this.$data.formconfigManager = formconfigManager(this.$props.cfg.dataUrl)
    const pageUrl = this.$props.cfg.dataUrl + this.$router.currentRoute.query.id
    const dataReq = await axios.get(pageUrl)
    const data = jsyaml.load(dataReq.data)
    function iterateChildren (path, children) {
      return _.map(children, (i, idx) => {
        if (i.component === 'composition') {
          i.children = iterateChildren(`${path}.${idx}.children`, i.children)
        }
        i.id = `${path}.${idx}`
        i.collapsed = false // open by default
        return i
      })
    }
    this.$data.data = iterateChildren('children', data.children)
    this.$data.ready = true
  },
  methods: {
    componentEdit: async function (node) {
      try {
        this.$data.formConfig = await this.getFormconfig(node.data.component)
        this.$data.edited = node.data
      } catch (e) {
        const m = 'tento komponent není editovatelný'
        this.$store.dispatch('toast', { message: m, type: 'error' })
      }
    },
    toggle: function (node) {
      node.collapsed = !node.collapsed
    }
  },
  components: {
    'b-tree-view': MyTreeView, ComponentEditor
  },
  template: `
  <div class="row">
    <div class="col-12">
      <b-breadcrumb>
        <b-breadcrumb-item to="/web">Stránky</b-breadcrumb-item>
        <b-breadcrumb-item active>{{ $router.currentRoute.query.id }}</b-breadcrumb-item>
      </b-breadcrumb>
    </div>

    <div v-if="ready" class="col-4">
      <h2>{{ data.title }}</h2>
      <p>{{ data.desc }}</p>
      <h4>Komponenty</h4>
      <b-tree-view 
        :sett="{labelProp: 'component', variant: 'component'}" 
        :data="data"
        :events="{toggle, componentEdit}" />
    </div>

    <div class="col-8">
      <ComponentEditor v-if="edited" 
        :apiUrl="cfg.apiUrl" 
        :formConfig="formConfig" 
        :data="edited" 
        :page="selectedPage" />
    </div>

  </div>
  `
}
