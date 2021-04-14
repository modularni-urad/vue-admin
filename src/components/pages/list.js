/* global axios, API, _ */
import ItemForm from './form.js'
import template from './list.html.js'

function formatDate (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
}

const getOptionsFormatter = (options) => (value) => {
  const o = _.find(options, i => i.value === value)
  return o ? o.text : value
}

const DefaultActions = {
  props: ['data', 'doEdit'],
  template: `
  <b-button size="sm" variant="primary" @click="doEdit(data.item)">
    <i class="fas fa-edit"></i> upravit
  </b-button>
  `
}

export default {
  data: () => {
    return {
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
  props: ['url', 'conf', 'label', 'prepareData', 'actionsComponent'],
  async created () {
    // console.log(this.$store.getters.UID);
    if (_.isString(this.$props.conf)) {
      const res = await axios.get(this.$props.conf)
      this.$data.formconfig = res.data.attrs
    } else {
      this.$data.formconfig = this.$props.conf
    }
    const promises = _.reduce(this.$data.formconfig, (acc, i) => {
      if (i.options && _.isString(i.options)) {
        acc.push(axios.get(i.options).then(res => {
          i.options = i.attrmap ? res.data.map(j => {
            return {
              text: j[i.attrmap.text || 'text'],
              value: j[i.attrmap.value || 'value']
            }
          }) : res.data            
        }))
      }
      return acc
    }, [])
    if (promises.length) await Promise.all(promises)
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
        if (i.options) {
          f.formatter = getOptionsFormatter(i.options)
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
      return axios.get(this.$props.url, { params })
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
  components: {
    'item-form': ItemForm, DefaultActions
  },
  template
}
