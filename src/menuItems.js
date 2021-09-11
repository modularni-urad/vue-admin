const serviceRoutes = ['/', '/login']

function getLabel (i) {
  return _.get(i, ['cfg', 'label'], i.name)
}

export default function (state) {
  
  function _canIAcces(routeConfig) {
    if (!routeConfig.accessGroups) return true
    const required = routeConfig.accessGroups.split(',')
    const i = _.intersection(required, state.user.groups)
    return i.length > 0
  }
  
  const r = _.reduce(state.cfg.routes, (acc, i) => {
    if (_canIAcces(i.cfg)) {
      acc.push({ label: getLabel(i), to: { name: i.name } })
    }
    return acc
  }, [])

  state.cfg.menuCreators.map(i => {
    const c = i(state.user)
    c && r.push(c)
  })
  return r
}