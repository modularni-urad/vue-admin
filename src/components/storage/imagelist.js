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
    imgURL: function (i) {
      return `${i.id}/${i.filename}`
    },
    imgURLSmall: function (i) {
      return `${this.$props.storage_url}${i.id}/${i.filename}?w=200`
    }
  },
  template: `
  <div>
    <img class="img-thumbnail img-fluid" v-for="i in images" 
      :src="imgURLSmall(i)" :alt="i.nazev" 
      style="width: 8em;"
      @click="onSelect(imgURL(i))" />
  </div>
  `
}