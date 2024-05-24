<template>
  <div class="left-indent-view">
    <h1>Meine Gruppe</h1>
    <p style="margin-top: -14px">Hier hast du eine Übersicht über deine Gruppe.</p>
    <div style="display: flex">
      <el-card class="box-card" style="margin-top: 20px; width: 45%">
        <div slot="header" class="clearfix">
          <span><b>Informationen</b></span>
        </div>
        <div>
          <p style="margin-top: 0"><b>Gruppenname:</b></p>
          <el-input readonly v-model="group.name" placeholder="Iglu bauen in Ägypten" style="width: 100%" />
          <p><b>Art der Gruppe:</b></p>
          <el-input readonly v-model="group.type" placeholder="mPS / Herausforderung" style="width: 100%" />
          <p><b>Start:</b> {{ formatDate(group.startDate) }}</p>
          <p><b>Ende:</b> {{ group.endDate !== null ? formatDate(group.endDate) : "noch offen" }}
          </p></div>
      </el-card>
      <el-card class="box-card" style="margin-top: 20px; margin-left: 20px; width: 45%">
        <div slot="header" class="clearfix">
          <span><b>Mitglieder</b></span>
        </div>
        <div>
          <p v-bind:key="member" v-for="member in group.members"><i style="margin-right: 5px" class="fa-solid fa-user"></i> <b>{{ member }}</b></p>
        </div>
      </el-card>
    </div>
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
  data() {
    return {
      loaded: false,
      group: {
        name: "",
        projectType: "",
        startDate: "",
        endDate: ""
      },
      oldGroup: {
        name: "",
        projectType: "",
        startDate: "",
        endDate: ""
      },
      changed: false
    }
  },
  async created() {
    console.log("Loading your group...")

    const response = await axios.get(this.ip + "group/" + this.user.group, {withCredentials: true});

    if (response.status === 200) {

      console.log(response.data)
      this.group = response.data
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  }
}
</script>

<style scoped>

</style>