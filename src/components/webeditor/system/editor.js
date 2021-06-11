/* global axios, API, _, moment */
import LayoutEditor from './editors/layout.js'
import StyleEditor from './editors/style.js'
import ComponentEditor from './editors/component.js'
const componentMap = {
  'l': LayoutEditor,
  's': StyleEditor,
  'c': ComponentEditor
}

export default {
  computed: {
    editComponent: function () {
      const idx = this.$props.data[0]
      return componentMap[idx]
    },
    file: function () {
      return this.$props.data.substring(3)
    }
  },
  props: ['data', 'cfg'],
  template: `
  <div class="row">
    <div class="col-12">
      <b-breadcrumb>
        <b-breadcrumb-item to="/web">Stránky</b-breadcrumb-item>
        <b-breadcrumb-item active>{{ $router.currentRoute.query }}</b-breadcrumb-item>
      </b-breadcrumb>
    </div>
      
    <div class="col-12">
      <component :is="editComponent" :file="file" :cfg="cfg" />
    </div>
  </div>
  `
}
