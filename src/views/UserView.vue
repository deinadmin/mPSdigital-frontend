<template>
  <div class="left-indent-view">
    <div v-if="loaded">
      <h1>Benutzerverwaltung » <i>{{ $route.params.username }}</i></h1>
      <p style="margin-top: -14px">Hier kannst du den Benutzer "{{ $route.params.username }}" verwalten.</p>
      <el-card style="margin-right: 18px" class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ $route.params.username }}</span>
          <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
        </div>
        <p><b>Benutzername:</b></p>
        <el-input style="user-select: none;" readonly v-model="$route.params.username"></el-input>
        <p><b>Passwort:</b></p>
        <el-input readonly value="************">
          <el-button :loading="passwordResetLoading" type="primary" @click="resetPassword" slot="append">Passwort zurücksetzen</el-button>
        </el-input>
        <div v-if="user.role === 'student'">
          <p><b>Klasse:</b></p>
          <el-autocomplete
              :disabled="loadedClasses===false"
              v-model="classSearch"
              style="width: 100%; margin-bottom: 10px"
              value-key="name"
              :fetch-suggestions="querySearchForGroup"
              placeholder="Noch in keiner Klasse"
              @select="handleSelectClass"
          ></el-autocomplete>
        </div>
      </el-card>

    </div>
    <div v-else>
      <h1>Lade den Benutzer {{ $route.params.username }}...</h1>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserView",
  data() {
    return {
      passwordResetLoading: false,
      loaded: false,
      user: null,
      loadedClasses: false,
      classSearch: "",
      classes: [],
      selectedClass: "",
    }
  },
  props: {
    ip: String
  },
  async created() {
    await this.loadClasses()

    try {
      const response = await axios.get(this.ip + "user/" + this.$route.params.username, {withCredentials: true})

      this.user = response.data
      this.loaded = true


      // TODO: Finish user view after Ben fixed "user" endpoint

      console.log(response.data)

    } catch(e) {
      if(e.response.status === 404) {
        this.$notify({
          title: "Ups!",
          message: 'Dieser Benutzer scheint nicht zu exisiteren.',
          type: 'error',
        });
      } else {
        this.$notify({
          title: "Fehler!",
          message: e.message,
          type: 'error',
        });
      }
    }
  },
  methods: {
    async handleSelectClass(item) {
      this.selectedClass = item

      try {

        const response = await axios.put(this.ip + "form/" + item.name + "/" + this.$route.params.username, {  }, {withCredentials: true})

        if(response.status === 200) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Der Benutzer wurde der Klasse "' + item.name + '" hinzugefügt.',
            type: 'success',
          });
        } else {
          this.$notify({
            title: "Ups!",
            message: 'Da ist wohl etwas schief gelaufen.',
            type: 'error',
          });
        }

      } catch {
        this.$notify({
          title: "Ups!",
          message: 'Da ist wohl etwas schief gelaufen.',
          type: 'error',
        });
      }

    },
    async resetPassword() {
      this.passwordResetLoading = true;
      try {
        const response = await axios.post(this.ip + 'user/' + this.$route.params.username + '/passwordReset/', {}, {withCredentials: true});
        console.log(response)
        if (response.status === 200) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Das Passwort wurde zurückgesetzt.',
            type: 'success',
          });
          this.passwordResetLoading = false

        } else {
          this.$notify({
            title: "Ups!",
            message: 'Da ist wohl etwas schief gelaufen.',
            type: 'error',
          });
        }

      } catch (error) {
        this.passwordResetLoading = false

        if(error.response.status === 403) {
          this.$notify({
            title: "Fehler!",
            message: 'Du hast nicht die Berechtigung dies zu tun.',
            type: 'error',
          });
        }
        if (error.response.status === 404) {
          this.$notify({
            title: "Ups!",
            message: 'Der Benutzer scheint nicht zu existieren.',
            type: 'error',
          });
        }
          console.log("An error occurred: ", error.message);


      }

    },
    async loadClasses() {
      try {
        const response = await axios.get(this.ip + "forms/", {withCredentials: true});

        if (response.status === 200) {

          this.classes = response.data
          this.loadedClasses = true
        }

      } catch {
        this.$message.error("An error occured.");
      }
    },
    querySearchForGroup(queryString, cb) {
      if(this.loadedClasses) {
        var classes = this.classes;
        console.log("Classes: " + classes[0].name)
        if(classes[0] === null) return;
        var results = queryString ? classes.filter(this.createFilter(queryString)) : classes;
        // call callback function to return suggestions
        console.log("Results:")
        console.log(results)
        cb(results);
      } else {
        cb({ name: "Die Gruppen konnten nicht geladen werden." })
      }
    },
    createFilter(queryString) {
      return (classs) => {
        return (classs.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
  },
}
</script>

<style scoped>

</style>