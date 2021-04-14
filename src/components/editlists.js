import EditList from './pages/list.js'
import { formCfg, prepareFileFormData } from './fileForm.js'

export const EventList = {
  components: { EditList },
  template: `
    <EditList label="Události" 
      url="${API}/events/" conf="${API}/_events/config.json" />`
}
export const PostList = {
  components: { EditList },
  template: `
    <EditList label="Článečky"
      url="${API}/posts/" conf="${API}/_posts/config.json" />`
}
export const TSPlaceList = {
  components: { EditList },
  template: `
    <EditList label="Místa"
      url="${API}/ts_places/" conf="${API}/_ts_places/config.json" />`
}

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

export const FileList = {
  data: () => { return { formCfg } },
  methods: { prepareFileFormData },
  components: { EditList },
  template: `
    <EditList label="Soubory" url="http://test.vxk.cz/cdn/" 
      :conf="formCfg" :prepareData="prepareFileFormData" 
      actionsComponent="FileActions" />
  `
}