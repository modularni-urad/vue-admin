import WebEditor from './webeditor/index.js'
import EntityList from './pages/list.js'
import Login from './pages/auth/login.js'

export default {
  props: ['component', 'cfg'],
  components: {
    WebEditor, EntityList, Login
  },
  template: `
  <div class="myClass">
    <component :is="component" :cfg="cfg">
    </component>
  </div>
  `
}