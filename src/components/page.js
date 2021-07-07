import WebEditor from '../modules/bbb-web-editor/index.js'
import EntityList from './entity/list.js'
import FileManager from './storage/manager.js'

export default {
  props: ['component', 'cfg'],
  components: {
    WebEditor, EntityList, FileManager
  },
  template: `
  <div class="myClass">
    <component :is="component" :cfg="cfg">
    </component>
  </div>
  `
}