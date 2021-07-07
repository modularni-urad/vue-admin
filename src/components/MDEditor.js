
export default {
  computed: {
    options: function () {
      return {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        mode: 'gfm',
        theme: 'monokai',
        readOnly: this.$props.disabled || false,
        viewportMargin: 5
      }
    },
    cm: function () {
      return this.$refs.cm.codemirror
    }
  },
  props: ['config', 'disabled', 'data'],
  components: {
    codemirror: VueCodemirror.codemirror
  },
  template: `
  <validation-provider v-bind:rules="config.rules" v-slot="{ errors }">
    <b-form-group
      :state="errors.length === 0"
      :label="config.label"
      :invalid-feedback="errors[0]"
    >
      <codemirror ref="cm" :value="data[config.name]"
      @input="v => data[config.name] = v" :options="options" />
    </b-form-group>
  </validation-provider>
  `
}