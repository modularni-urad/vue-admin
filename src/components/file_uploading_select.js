import storageBrowser from './storage_browser.js'
import { prepareFileFormData } from './fileForm.js'

export default {
  data: () => {
    return {
      visible: false,
      uploading: false
    }
  },
  props: ['config', 'disabled', 'data'],
  methods: {
    search: function () {
      this.$data.visible = true
    },
    onFileSelected: async function (file) {
      this.$data.uploading = true
      try {
        const title = this.$props.data[this.$props.config.upload_titleattr]
        let data = { 
          nazev: `${title} - ${this.$props.config.upload_title || 'title'}`, 
          tags: this.$props.config.upload_tags, 
          file
        }
        data = await prepareFileFormData(data)
        url = this.$props.config.upload_url
        await this.$store.dispatch('send', { method: 'post', url, data })
        this.$store.dispatch('toast', { message: 'uloženo' })
        this.$bvModal.hide('modal-upload')
        this.$props.data[this.$props.config.name] = 
          `${this.$props.config.upload_url}file/${req.data.id}/${req.data.filename}`
      } catch(err) {
        alert(err)
      }      
      this.$data.uploading = false
    },
    onSelect: function (url) {
      this.$bvModal.hide('modal-search')
      this.$props.data[this.$props.config.name] = url
    }
  },
  components: { storageBrowser },
  template: `
<validation-provider v-bind:rules="config.rules" v-slot="{ errors }">
  <b-form-group
    :state="errors.length === 0"
    :label="config.label"
    :invalid-feedback="errors[0]"
  >
    <div class="input-group">      
      <b-form-input
        :type="config.inputtype || 'text'"
        :value="data[config.name]"
        @input="v => data[config.name] = v"
        :state="errors.length === 0"
        :disabled="disabled">
      </b-form-input>
      <div class="input-group-prepend">
        <b-button variant="primary" v-b-modal.modal-search>
          <i class="fas fa-search"></i>
        </b-button>
        <b-button variant="secondary" v-b-modal.modal-upload>
          <i class="fas fa-upload"></i>
        </b-button>
      </div>
    </div>
  </b-form-group>

  <b-modal size="lg" id="modal-search" title="Vyhledat v úložišti">
    <storageBrowser :onSelect="onSelect"
      :url="config.search_url" 
      :tagurl="config.tag_url" />
  </b-modal>
  <b-modal id="modal-upload" title="Nahrát do úložiště" hide-footer>
    <b-form-file @input="onFileSelected" 
      placeholder="Choose a file or drop it here..." :disabled="uploading" />
    <i v-if="uploading" class="fas fa-spinner fa-spin"></i>
  </b-modal>

</validation-provider>
  `
}