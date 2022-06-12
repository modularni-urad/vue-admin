export default {
  // data: () => {
  //   return {
  //     found: [],
  //     formconfig: {
  //       name: 'tags',
  //       options: null,
  //       attrmap: { value: "value", text: "value" }
  //     },
  //     filter: {
  //       tags: ''
  //     },
  //     loading: true
  //   }
  // },
  props: ['storage_url', 'images', 'onSelect'],
  // async created () {
  //   this.$data.formconfig.options = this.$props.tagurl
  //   const filter = {
  //     ctype: { like: 'image%' }
  //   }
  //   const res = await axios.get(this.$props.url, { params: {
  //     filter: JSON.stringify(filter),
  //     fields: 'id,filename,nazev'
  //   }})
  //   this.$data.found = res.data
  //   this.$data.loading = false
  // },
  methods: {
    imgURLSmall: function (i) {
      return this.$store.getters.mediaUrl(i.filename, 'w=150')
    }
  },
  template: `
  <div>
    <img class="img-thumbnail img-fluid" v-for="i in images" 
      :src="imgURLSmall(i)" :alt="i.nazev" 
      style="width: 8em;"
      @click="onSelect(i.filename)" />
  </div>
  `
}