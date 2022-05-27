const serviceRoutes = ['/', '/login']

function getLabel (i) {
  return _.get(i, ['cfg', 'label'], i.name)
}

export default function (state) {

  const items = {}
  
  function _canIAcces(routeConfig) {
    if (!routeConfig.accessGroups) return true
    const required = routeConfig.accessGroups.split(',')
    const i = _.intersection(required, state.user.groups)
    return i.length > 0
  }
  function add(cfg, item = null) {
    item = item || { label: getLabel(cfg), to: { name: cfg.name } }
    if (cfg.group) {
      _.has(items, cfg.group)
        ? items[cfg.group].children.push(item)
        : items[cfg.group] = { label: cfg.group, children: [ item ] }
    } else {
      items[cfg.path] = item
    }
  }  
  
  _.each(state.cfg.routes, i => {
    if (_canIAcces(i.cfg)) {
      add(i) 
    }
  })

  state.cfg.menuCreators.map(i => {
    const { fn, cfg } = i
    const c = fn.bind(cfg)(state.user, cfg)
    c && (c.length ? c.map(i => add(cfg, i)) : add(cfg, c))
  })
  return _.values(items)
}