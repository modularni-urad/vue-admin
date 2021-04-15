/* global axios, API, _ */
export default {
  data: () => {
    return {
      ready: false,
      data: null,
    }
  },
  props: ['data', 'nodeSelect'],
  computed: {
    treeData: function () {
      function iterateChildren (path, children) {
        return _.map(children, (i, idx) => {
          if (i.component === 'composition') {
            i.children = iterateChildren(`${path}.${idx}.children`, i.children)
          }
          i.id = `${path}.${idx}`
          return i
        })
      }
      const v = iterateChildren('children', this.$props.data.children)
      return v
    }
  },
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
  components: {
    'b-tree-view': bootstrapVueTreeview.bTreeView
  },
  template: `
  <div>
    <b-tree-view showIcons nodesDraggable
      :renameNodeOnDblClick="false"
      nodeLabelProp="component" 
      :contextMenuItems="false"
      :data="treeData"
      @nodeSelect="nodeSelect"
    />
  </div>
  `
}
