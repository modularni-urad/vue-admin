import EditList from './pages/list.js'
import { formCfg, prepareFileFormData } from './fileForm.js'

const FileActions = {
  props: ['data', 'doEdit'],
  computed: {
    isImage: function () {
      return this.$props.data.item.ctype.indexOf('image') >= 0
    },
    src: function () {
      const data = this.$props.data
      return 'http://test.vxk.cz/cdn/file/' + data.item.id + '/' + data.item.filename
    }
  },
  template: `
  <div>
    <img v-if="isImage" style="display: inline-block; width: 100px;" :src="src" />
    <b-button size="sm" variant="primary" @click="doEdit(data.item)">
      <i class="fas fa-edit"></i> upravit
    </b-button>
  </div>
  `
}
Vue.component('FileActions', FileActions)

export default {
  props: ['cfg'],
  methods: { prepareFileFormData },
  computed: {
    config: function() {
      return {
        label: 'soubory',
        url: 'http://test.vxk.cz/cdn/',
        conf: formCfg
      }
    }
  },
  components: { EditList },
  template: `
    <EditList :cfg="config"  
      :prepareData="prepareFileFormData" 
      actionsComponent="FileActions" />
  `
}