import WebEditor from '../modules/bbb-web-editor/index.js'
import EntityList from '../modules/modularni-urad-admin-components/entity/list.js'
import { initConfig } from '../modules/modularni-urad-admin-components/entity/utils.js'
import FileManager from './storage/manager.js'

// configuraci nahravat az tady a podle typu componentu a kesovat
// TODO: tohle presunout do modularni-urad-admin-components/entity/list.js
const _confs = {}
async function loadConfig(cfg) {
  await initConfig(cfg)
  _confs[cfg.url] = cfg
}

function initEntityList (self) {
  const _set = () => {
    self.loaded = true
  }
  if (!self.cfg.url in _confs) {
    _set()
  } else {
    loadConfig(self.cfg).then(_set)
  }
}

export default {
  data: () => {
    return {
      loaded: false
    }
  },
  props: ['component', 'cfg', 'query'],
  created () {
    if (this.component && this.component === 'EntityList') initEntityList(this)
    else this.loaded = true
  },
  components: {
    WebEditor, EntityList, FileManager
  },
  template: `
  <div v-if="loaded" class="myClass">
    <component :is="component" :cfg="cfg" :query="query">
    </component>
  </div>
  `
}