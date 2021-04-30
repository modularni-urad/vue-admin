import storageBrowser from './browser.js'
import storageUploader from './uploader.js'

export default {
  data: () => {
    return {
      visible: false
    }
  },
  props: ['config', 'disabled', 'data'],
  methods: {
    search: function () {
      this.$data.visible = true
    },
    onSelect: function (modalid, url) {
      this.$bvModal.hide(modalid)
      this.$props.data[this.$props.config.name] = url
    }
  },
  components: { storageBrowser, storageUploader },
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
    <storageBrowser 
      :onSelect="onSelect.bind(this, 'modal-search')"
      :config="config" />
  </b-modal>
  <b-modal id="modal-upload" title="Nahrát do úložiště" hide-footer>
    <storageUploader 
      :onSelect="onSelect.bind(this, 'modal-upload')"
      :config="config" />
  </b-modal>

</validation-provider>
  `
}