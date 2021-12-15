import UserSearch from './usersearch.js'

export default {
  data() {
    return {
      query: '',
      users: []
    }
  },
  props: ['config', 'disabled', 'data'],
  methods: {    
    select: function ($event) {
      const { data, config } = this.$props
      data[config.name] = $event.id
    }
  },
  components: { UserSearch },
  template: `
<validation-provider v-bind:rules="config.rules" v-slot="{ errors }">
  <b-form-group
    :state="errors.length === 0"
    :label="config.label"
    :invalid-feedback="errors[0]"
  >
    
    <UserSearch :config="config" :disabled="disabled" @input="select" />
    <NameSpan v-if="data[config.name]" :uid="data[config.name]" :cfg="config" />

  </b-form-group>
</validation-provider>
  `
}