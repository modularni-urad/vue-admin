import WebEditor from './webeditor/index.js'
import EntityList from './pages/list.js'

export default {
  props: ['component', 'cfg'],
  components: {
    WebEditor, EntityList
  },
  template: `
  <div class="myClass">
    <component :is="component" :cfg="cfg">
    </component>
  </div>
  `
}