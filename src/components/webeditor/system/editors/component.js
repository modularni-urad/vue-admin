/* global axios, API, _, moment */
import cm_opts from './cm_options.js'

export default {
  data: function () {
    return {
      submitting: false,
      formdata: {
        js: '',
        // template: '',
        config: '',
        style: ''
      },
      testdata: '',  // spis generovat
      options: cm_opts,
      origData: null
    }
  },
  async created () {
    const dataUrl = this.$props.cfg.dataUrl
    const file = this.$props.file.split('.')[0]
    let resp = await axios(`${dataUrl}_service/components/${file}.js`)
    this.$data.formdata.js = resp.data
    try {
      resp = await axios(`${dataUrl}_service/style/components/${file}.scss`)
      this.$data.formdata.style = resp.data
    } catch (_) {}
    try {
      resp = await axios(`${dataUrl}_service/configs/${file}.yaml`)
      this.$data.formdata.config = resp.data
    } catch (_) {}
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
        const file = this.$props.file.split('.')[0]
        await this.$store.dispatch('send', { 
          method: 'PUT', 
          url: `${apiUrl}?file=_service/components/${file}.js`, 
          data: { content: this.$data.formdata.js }
        })
        await this.$store.dispatch('send', { 
          method: 'PUT', 
          url: `${apiUrl}?file=_service/style/components/${file}.scss`, 
          data: { content: this.$data.formdata.style }
        })
        await this.$store.dispatch('send', { 
          method: 'PUT', 
          url: `${apiUrl}?file=_service/configs/${file}.yaml`, 
          data: { content: this.$data.formdata.config }
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
  
  <div class="accordion" role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-1 variant="info">JS</b-button>
      </b-card-header>
      <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
        <codemirror ref="cm" v-model="formdata.js" :options="options.js" />
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-3 variant="info">Style</b-button>
      </b-card-header>
      <b-collapse id="accordion-3" visible accordion="my-accordion" role="tabpanel">
        <codemirror ref="cmstyle" v-model="formdata.style" :options="options.style" />
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-4 variant="info">FormConfig</b-button>
      </b-card-header>
      <b-collapse id="accordion-4" visible accordion="my-accordion" role="tabpanel">
        <codemirror ref="cmconfig" v-model="formdata.config" :options="options.yaml" />
      </b-collapse>
    </b-card>

  </div>

  <b-button type="submit" class="mt-3" :disabled="submitting">
    Uložit
  </b-button>
  <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
</form>
  `
}
