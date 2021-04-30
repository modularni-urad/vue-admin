import { loadAsBase64 } from './fileForm.js'
import formComponents from '../../../bootstrap-vue-dynamic-form/index.js'
import ImageList from './imagelist.js'

export default {
  data: () => {
    return {
      files: [],
      uploadedfiles: [],
      filter: {
        tags: ''
      },
      uploading: false,
      uploaded: false
    }
  },
  props: ['config', 'onSelect'],
  computed: {
    formconfig: function () {
      return {
        name: 'tags',
        options: this.$props.config.tag_url,
        attrmap: { value: "value", text: "value" }
      }      
    }
  },
  components: _.extend(formComponents, { ImageList }),
  methods: {
    upload: async function (file) {
      this.$data.uploading = true
      const self = this
      const defatulTags = this.$props.config.default_tags ?
        `,${self.$props.config.default_tags}` : ''

      async function _upload (f) {
        let data = { 
          nazev: f.name, 
          tags: self.$data.filter.tags + defatulTags, 
          file: _.pick(f, 'type', 'name', 'size')
        }
        const url = self.$props.config.fileindex_url
        const res = await self.$store.dispatch('send', { method: 'post', url, data })
        const content = await loadAsBase64(f)
        await self.$store.dispatch('send', { 
          method: 'post', 
          url: `${self.$props.config.storage_url}/${res.data.id}/${res.data.filename}`,
          data: { content }
        })
        self.$store.dispatch('toast', { message: `${f.name}: uložen` })
        self.$data.uploadedfiles.push(res.data)
        self.$data.files.splice(_.indexOf(self.$data.files, f), 1)
      }
      await Promise.all(_.map(this.$data.files, _upload))    
      this.$data.uploading = false
      this.$data.uploaded = true
    }
  },
  template: `
  <div>
    <dyn-taginput :config="formconfig" :data="filter" />
    <b-form-file v-if="files.length === 0 && !uploaded" multiple v-model="files"
        placeholder="Choose a file or drop it here..." />
    <div v-else>
      <p v-for="f, idx in files" :key="idx">
        {{ f.name }}, velikost: {{ f.size }}
      </p>
      <i v-if="uploading" class="fas fa-spinner fa-spin"></i>
      <b-button v-else-if="!uploaded" @click="upload" :disabled="!filter.tags">
        Start
      </b-button>
    </div>
    <div v-if="uploadedfiles.length" class="d-flex flex-row">
      <ImageList  :onSelect="onSelect" 
                  :storage_url="config.storage_url" 
                  :images="uploadedfiles" />
    </div>
  </div>
  `
}