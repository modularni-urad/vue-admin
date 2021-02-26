/* global axios, API, _, moment */
import formComponents from '../../bootstrap-vue-dynamic-form/index.js'

export default {
  data: () => {
    return {
      formdata: {},
      origData: null
    }
  },
  computed: {
    disabled: function () {
      return this.$props.item && this.$store.getters.UID !== this.$props.item.manager
    }
  },
  created () {
    if (this.$props.item) {
      Object.assign(this.$data.formdata, this.$props.item)
      // this.$data.due = moment(this.$data.due).format('YYYY-MM-DD')
    }
  },
  props: ['item', 'config', 'onSubmit'],
  methods: {
    handleSubmit () {
      this.$props.onSubmit(this.$data.formdata)
    },
    cancel () {
      this.$props.onSubmit() // just call
    }
  },
  components: formComponents,
  template: `
  <ValidationObserver v-slot="{ invalid }">
    <form @submit.prevent="handleSubmit">

      <component v-for="c in $props.config" :key="c.name"
        :is="c.component" :config="c" :data="formdata">
      </component>

      <b-button type="submit" class="mt-3" :disabled="invalid">
        Uložit
      </b-button>
      <b-button class="mt-3" @click="cancel">
        Storno
      </b-button>
    </form>
  </ValidationObserver>
  `
}
