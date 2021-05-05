/* global axios, API, _ */
export default {
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
    }
  },
  components: {
    'b-tree-view': bootstrapVueTreeview.bTreeView
  },
  template: `
  <div>
    <h2>{{ data.title }}</h2>
    <p>{{ data.desc }}</p>
    <hr />
    <h4>Komponenty</h4>
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
