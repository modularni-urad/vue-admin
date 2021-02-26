/* global axios, API, _ */
import ItemForm from './form.js'
import template from './list.html.js'

function formatDate (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
}

export default {
  data: () => {
    return {
      items: [],
      formconfig: null,
      ready: false,
      isBusy: false,
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      curr: null,
      currDetail: null,
      item: {}
    }
  },
  props: ['entity', 'label'],
  async created () {
    // console.log(this.$store.getters.UID);
    const res = await axios.get(`${API}/_${this.$props.entity}/config.json`)
    this.$data.formconfig = res.data.attrs
    this.$data.ready = true
  },
  computed: {
    fields: function () {
      let fields = _.filter(this.$data.formconfig, i => {
        return !_.isUndefined(i.fieldcomponent)
      })
      fields = _.map(fields, i => {
        const f = {
          key: i.name,
          label: i.label,
          sortable: true
        }
        if (i.type === 'date') {
          f.formatter = formatDate
        }
        return f
      })
      fields.unshift({ key: 'id', label: '#ID', sortable: true })
      fields.push({ key: 'actions', label: '' })
      return fields
    }
  },
  methods: {
    myProvider (ctx) {
      const params = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        sort: ctx.sortBy ? `${ctx.sortBy}:${ctx.sortDesc ? 'desc' : 'asc'}` : 'id:asc'
      }
      let data = null
      return axios.get(`${API}/${this.$props.entity}`, { params })
        .then(res => {
          this.totalRows = res.data.pagination.total
            ? res.data.pagination.total
            : this.totalRows
          data = res.data.data
          return data
        })
        .catch(err => {
          const message = err.response.data
          this.$store.dispatch('toast', { message, type: 'error' })
          return []
        })
    },
    setPageSize: function (newSize) {
      this.perPage = newSize
    },
    add: function () {
      this.$data.curr = null
      this.$bvModal.show('modal-add')
    },
    edit: function (item) {
      this.$data.curr = item
      this.$bvModal.show('modal-add')
    },
    onSubmit: async function (item) {
      if (!item) return this.$bvModal.hide('modal-add')
      try {
        const cfg = { headers: { 'Authorization': 'Bearer fjsdlkfjsl' }}
        const res = this.curr
          ? await axios.put(`${API}/${this.$props.entity}/${this.curr.id}`, item, cfg)
          : await axios.post(`${API}/${this.$props.entity}`, item, cfg)
        this.curr
          ? Object.assign(this.curr, res.data)
          : this.$refs.table.refresh()
        this.$bvModal.hide('modal-add')
      } catch (err) {
        console.log(err)
      }
    }
  },
  components: {
    'item-form': ItemForm
  },
  template
}
