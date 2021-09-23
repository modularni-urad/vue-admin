export default {
  data: () => {
    return {
      items: [{ title: 'pokus 1' }]
    }
  },
  created () {
    const self = this
    setInterval(() => {
      self.items.push({ title: `pokus ${self.items.length + 1}` })
    }, 40000)
  },
  props: ['component', 'cfg'],
  template: `
  <b-dropdown>
    <template #button-content>
      <i class="fas fa-bell"></i> <b-badge variant="light">{{ items.length }}</b-badge>
    </template>
    <b-dropdown-item v-for="i,idx in items" :key="idx" href="#">
      {{ i.title }}
    </b-dropdown-item>
  </b-dropdown>
  `
}
