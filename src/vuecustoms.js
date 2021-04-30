/* global Vue, _, moment, VueBootstrapTypeahead, VueMarkdown,
  VeeValidateRules, VeeValidate, VueToast */

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

import FileUploadingSelect from './components/storage/file_uploading_select.js'
Vue.component('FileUploadingSelect', FileUploadingSelect)

Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)
Vue.use(VueMarkdown)

Vue.component('ValidationProvider', VeeValidate.ValidationProvider)
Vue.component('ValidationObserver', VeeValidate.ValidationObserver)

VeeValidate.extend('required', VeeValidateRules.required)
