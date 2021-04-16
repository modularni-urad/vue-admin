const _confs = {
  MDText: [
    {
      "name": "content",
      "component": "dyn-textarea",
      "label": "Obsah. V markdownu",
      "rules": 'required'
    }
  ]
}

export default function manager (url) {
  
  async function _getComponent(componentName) {
    const u = `${url}_configs/${componentName}.json`
    const cfgRes = await axios.get(u)
    _confs[componentName] = cfgRes.data
    return cfgRes.data
  }

  return async function getFormconfig(componentName) {
    return (componentName in _confs) 
      ? _confs[componentName]
      : _getComponent(componentName)
  }  
}

export const composition = [
  {
    "name": "class",
    "component": "dyn-input",
    "label": "Classes"
  }
]