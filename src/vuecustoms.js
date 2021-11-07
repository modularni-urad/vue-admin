/* global Vue, _, moment, VueBootstrapTypeahead, VueMarkdown,
  VeeValidateRules, VeeValidate, VueToast */
import MDEditor from './components/MDEditor.js'

// dynamic form
import DynComponents from './modules/bootstrap-vue-dynamic-form/index.js'
import { 
  WITHOUT_DIACRITICS_VALIDATOR_NAME, WITHOUT_DIACRITICS_VALIDATOR 
} from './modules/bootstrap-vue-dynamic-form/components/file.js'

for (let i in DynComponents) {
  Vue.component(i, DynComponents[i])
}

// admin components
import ListView from './modules/modularni-urad-admin-components/entity/list.js'
import ItemForm from './modules/modularni-urad-admin-components/entity/form.js'
import DetailModal from './modules/modularni-urad-admin-components/entity/detail.js'

Vue.component('ACListView', ListView)
Vue.component('ACDynamicForm', ItemForm)
Vue.component('ACDetailModal', DetailModal)

import UserSelect from './components/input/userselect.js'
Vue.component('user-select', UserSelect)

import FullWidthMDEditor from './components/input/fullwidth-md-editor.js'
Vue.component('fullwidth-md-editor', FullWidthMDEditor)

import NameSpan from './components/auth/namespan.js'
Vue.component('NameSpan', NameSpan)

Vue.use(VueToast, { position: 'top-right' })

Vue.filter('formatDate', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY')
  }
})

Vue.filter('longDate', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
})

Vue.filter('date', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY')
  }
})

Vue.filter('datetime', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
})

import FileUploadingSelect from './components/storage/file_uploading_select.js'
Vue.component('FileUploadingSelect', FileUploadingSelect)

Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)
Vue.use(VueMarkdown)

Vue.component('ValidationProvider', VeeValidate.ValidationProvider)
Vue.component('ValidationObserver', VeeValidate.ValidationObserver)

VeeValidate.extend('required', VeeValidateRules.required)
VeeValidate.extend(WITHOUT_DIACRITICS_VALIDATOR_NAME, WITHOUT_DIACRITICS_VALIDATOR)

Vue.component('MDEditor', MDEditor)