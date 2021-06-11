export default {
  data: function () {
    return {
      submitting: false,
      formdata: '',
      options: {        
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: "monokai"
      },
      origData: null
    }
  },
  async created () {
    const url = `${this.$props.cfg.dataUrl}_service/layouts/${this.$props.file}`
    const res = await axios(url)
    this.$data.formdata = res.data
  },
  computed: {
    cm: function () {
      return this.$refs.cm.codemirror
    }
  },
  props: ['file', 'cfg'],
  methods: {
    handleSubmit: async function () {
      this.$data.submitting = true
      try {
        const apiUrl = `${this.$props.cfg.apiUrl}file`
        await this.$store.dispatch('send', { 
          method: 'PUT', 
          url: `${apiUrl}?file=_service/layouts/${this.$props.file}`, 
          data: { content: this.$data.formdata }
        })
        this.$store.dispatch('toast', { message: 'uloženo' })
      } catch (err) {
        const message = err.response.data
        this.$store.dispatch('toast', { message, type: 'error' })
      } finally {
        this.$data.submitting = false
      }
    }
  },
  components: {
    codemirror: VueCodemirror.codemirror
  },
  template: `
  <form @submit.prevent="handleSubmit">
    
    <codemirror ref="cm" v-model="formdata" :options="options" />

    <b-button type="submit" :disabled="submitting">
      Uložit
    </b-button>
    <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
  </form>
  `
}
