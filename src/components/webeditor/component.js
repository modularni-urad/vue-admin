import ItemForm from '../entity/form.js'

export default {
  props: ['data', 'formConfig', 'apiUrl', 'pagefile'],
  methods: {
    onSubmit: async function (item) {
      if (!item) return
      const data = _.omit(this.$props.data, ['id', 'component'])
      Object.assign(data, item)
      try {
        await this.$store.dispatch('send', {
          method: 'put',
          url: this.$props.apiUrl,
          data: item,
          params: {
            id: this.$props.data.id,
            file: this.$props.pagefile
          }
        })
        this.$store.dispatch('toast', { message: 'saved' })
      } catch (err) {
        const message = err.response.data
        this.$store.dispatch('toast', { message, type: 'error' })
      }
    }
  },
  components: { ItemForm },
  template: `
  <div :key="data.id">
    <h2>{{ data.component }} (<small>{{ data.id }}</small>)</h2>
    <ItemForm :config="data.formConfig" :onSubmit="onSubmit" :item="data" />
  </div>
  `
}
