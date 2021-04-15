/* global axios, API, _ */
import ItemForm from '../pages/form.js'

export default {
  data: () => {
    return {
      ready: false,
      formconfig: null
    }
  },
  created () {
    this.$data.formconfig = [
      {"name":"status","component":"dyn-select",
      "options":[{"value":"y","text":"Ano"},{"value":"n","text":"Ne"}],
      "label":"Publikováno","rules":"required","fieldcomponent":true},
      
      {"name":"title","type":"string","component":"dyn-input",
      "label":"Nazev","rules":"required","fieldcomponent":true
    }
    ]
  },
  props: ['data'],
  methods: {
    add: function () {
      this.$data.curr = null
      this.$bvModal.show('modal-add')
    },
    onSubmit: async function (item) {
      if (!item) return this.$bvModal.hide('modal-add')
      try {
        const cfg = { headers: { 'Authorization': 'Bearer fjsdlkfjsl' }}
        item = this.$props.prepareData ? await this.$props.prepareData(item) : item
        const res = this.curr
          ? await axios.put(`${this.$props.url}${this.curr.id}`, item, cfg)
          : await axios.post(this.$props.url, item, cfg)
        this.curr
          ? Object.assign(this.curr, res.data)
          : this.$refs.table.refresh()
        this.$bvModal.hide('modal-add')
      } catch (err) {
        console.log(err)
      }
    }
  },
  components: { ItemForm },
  template: `
  <div>
    <h2>{{ data.component }} (<small>{{ data.id }}</small>)</h2>
    <ItemForm :config="formconfig" :onSubmit="onSubmit" :item="data" />
  </div>
  `
}
