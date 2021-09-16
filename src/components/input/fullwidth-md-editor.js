export default {
  data: () => {
    return {
      text: ''
    }
  },
  props: ['config', 'disabled', 'data'],
  methods: {
    onOk: function () {
      this.data[this.config.name] = this.text
    },
    onShow: function () {
      this.text = this.data[this.config.name] || ''
    }
  },
  template: `
<validation-provider v-bind:rules="config.rules" v-slot="{ errors }">
  <b-form-group
    :state="errors.length === 0"
    :label="config.label"
    :invalid-feedback="errors[0]"
  >
    <b-button size="sm" v-b-modal.modal-1 :disabled="disabled">
      <i class="fas fa-edit"></i> upravit
    </b-button>
  </b-form-group>

  <b-modal id="modal-1" size="xl" @ok="onOk" @show="onShow" title="důvodová zpráva">
  
    <b-form-textarea rows="20" v-model="text" />

  </b-modal>

</validation-provider>
  `
}
