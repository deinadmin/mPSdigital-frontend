<template>
  <div>
    <div v-if="loaded">
      <iframe frameborder='0' :src='pinwall' style='margin:0; margin-left: 0;padding:0; padding-right: -20px;  width:100%;height:100vh;'></iframe>
    </div>
    <div v-else>
      <div v-if="!loaded" style="position: fixed; left: 300px; right: 0; top: 300px" v-loading="!loaded"
           element-loading-text="Pinnwand wird geladen..."
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
//https://opsh.lernnetz.de/pl/d2bbcd10083a28debefdd48e5858e5c8?frame=1
export default {
  name: 'PinWallView',
  props: {
    ip: String,
    user: Object
  },
  data() {
    return {
      loaded: false,
      pinwall: ""
    }
  },
  async created() {
    console.log("Loading PinWall...")
    const response = await axios.get(this.ip + "group/" + this.user.group, {withCredentials: true});

    if (response.status === 200) {

      console.log(response.data)
      this.pinwall = response.data.pinboard
      setTimeout(() => {
        this.loaded = true
      }, 800)
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>