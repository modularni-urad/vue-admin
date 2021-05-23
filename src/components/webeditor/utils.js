
export function buildTreeData (pages) {

  function _insert2Tree (node, subtree, path) {
    const existing = _.find(subtree, i => i.foldername === path[0])
    if (existing && path.length > 1) {
      existing.children = existing.children || []
      _insert2Tree(node, existing.children, _.rest(path))
    } else {
      subtree.push({
        id: node.path,
        name: path[0],
        file: node.data,
        foldername: path[0],
        collapsed: true
      })
    }
  }

  const sorted = _.sortBy(pages, 'path')
  const tree = [{ 
    id: '/', file: 'index.yaml', name: '/ - titulka', foldername: '', collapsed: false 
  }]
  _.map(_.rest(sorted), i => {
    const parts = i.path.split('/')
    _insert2Tree(i, tree, parts)
  })
  return tree
}