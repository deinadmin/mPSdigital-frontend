<template>
  <div>
    <div v-if="loaded">
      <h1>Gruppen » <i>{{ group.name }}</i></h1>
      <p style="margin-top: -14px">Hier findest Informationen über die Gruppe {{ group.name }} und kannst diese verwalten.</p>
      <div style="display: flex">
        <el-card class="box-card" style="margin-top: 20px; width: 45%">
          <div slot="header" class="clearfix">
            <span><b>Informationen</b></span>
            <el-button v-if="changed" @click="updateGroup" style="float: right; padding: 3px 0; color: red;" type="text" icon="fa-solid fa-floppy-disk"> Ungesicherte Änderungen speichern</el-button>
          </div>
          <div>
            <p style="margin-top: 0"><b>Gruppenname:</b></p>
            <el-input @input="checkChanged" v-model="group.name" placeholder="Iglu bauen in Ägypten" style="width: 100%" />
            <p><b>Art der Gruppe:</b></p>
            <el-select @input="checkChanged" style="width: 100%" v-model="group.type" placeholder="mPS / Herausforderung">
              <el-option label="mPS" value="mPS"></el-option>
              <el-option label="Herausforderung" value="Herausforderung"></el-option>
            </el-select>
            <p><b>Start:</b> {{ formatDate(group.startDate) }}</p>
            <p><b>Ende:</b><el-date-picker
                v-if="group.endDate === null"
                v-model="group.endDate"
                type="date"
                @input="checkChanged"
                style="margin-left: 10px"
                placeholder="Ende festlegen">
            </el-date-picker>
            <span v-else> {{ formatDate(group.endDate) }} <el-button size="mini" @click="() => {group.endDate = null; this.checkChanged()}">Ende zurücksetzen</el-button></span>
            </p>
            <p><b>Link zur Pinnwand:</b></p>
            <el-input @input="checkChanged" type="success" v-model="group.pinboard" placeholder="https://example.com" style="width: 100%"></el-input>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px; margin-left: 20px; width: 45%">
          <div slot="header" class="clearfix">
            <span><b>Mitglieder</b></span>
          </div>
          <div>
            <p @click="$router.push('/users/' + member)" v-bind:key="member" v-for="member in group.members" style="cursor: pointer"><i style="margin-right: 5px" class="fa-solid fa-arrow-up-right-from-square"></i> <b>{{ member }}</b></p>
          </div>
        </el-card>
      </div>

    </div>
    <div v-else>
      <h1>Laden....</h1>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'TeacherGroupView',
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
  props: {
    ip: String
  },
  async created() {
    try {
      const response = await axios.get(this.ip + "group/" + this.$route.params.id, {withCredentials: true});

      if (response.status === 200) {
        this.loaded = true
        console.log(response.data)
        this.group = response.data
        this.oldGroup = response.data
        console.log(JSON.stringify(this.group))
      }
    } catch (error) {
      if (error.response.status === 401) {
        this.loggedIn = false
      } else {
        this.$message.error("An error occurred: " + error.message);
      }
    }
  },
  methods: {
    checkChanged() {
      this.changed = JSON.stringify(this.group) === JSON.stringify(this.oldGroup);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    async updateGroup() {
      try {
        const response = await axios.patch(this.ip + "group/" + this.$route.params.id, this.group, {withCredentials: true});

        if (response.status === 200) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Gruppe aktualisiert.',
            type: 'success',
            duration: 1000,
            showClose: false
          });
          this.oldGroup = this.group
          this.changed = false
        }

      } catch (error) {
        if (error.response.status === 401) {
          this.loggedIn = false
        } else {
          this.$message.error("An error occurred: " + error.message);
        }
      }
    }
  }
}
</script>

<style scoped>

</style>