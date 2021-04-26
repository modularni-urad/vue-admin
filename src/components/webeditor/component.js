import ItemForm from '../pages/form.js'

export default {
  props: ['data', 'formConfig', 'apiurl', 'page'],
  methods: {
    onSubmit: async function (item) {
      if (!item) return
      const data = _.omit(this.$props.data, ['id', 'component'])
      Object.assign(data, item)
      try {
        await this.$store.dispatch('send', {
          method: 'put',
          url: this.$props.apiurl,
          data: item,
          params: {
            id: this.$props.data.id,
            file: this.$props.page.file
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
  <div>
    <h2>{{ data.component }} (<small>{{ data.id }}</small>)</h2>
    <ItemForm :config="formConfig" :onSubmit="onSubmit" :item="data" />
  </div>
  `
}
