<template>
  <div>
    <h1>Meine Gruppe</h1>
    <p style="margin-top: -14px">Hier hast du eine Übersicht über deine Gruppe.</p>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'MyGroupView',
  props: {
    ip: String,
    user: Object
  },
  async created() {
    console.log("Loading your group...")

    const response = await axios.get(this.ip + "group/" + this.user.group, {withCredentials: true});

    if (response.status === 200) {

      console.log(response.data)
      this.users = response.data.users
    }
  },
}
</script>

<style scoped>

</style>