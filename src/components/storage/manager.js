import EditList from '../pages/list.js'
import { prepareFileFormData } from './fileForm.js'

const FileActions = {
  props: ['data', 'doEdit'],
  computed: {
    isImage: function () {
      return this.$props.data.item.ctype.indexOf('image') >= 0
    }
  },
  template: `
  <div>
    <img v-if="isImage" style="display: inline-block;" 
      :src="$store.getters.mediaUrl(data.item, 'w=150')" 
    />
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
  components: { EditList },
  template: `
    <EditList :cfg="cfg"  
      :prepareData="prepareFileFormData" 
      actionsComponent="FileActions" />
  `
}