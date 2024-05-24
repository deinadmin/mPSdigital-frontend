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
        <el-input style="user-select: none;" disabled v-model="$route.params.username"></el-input>
        <p><b>Passwort:</b></p>
        <el-input disabled value="************">
          <el-button :loading="passwordResetLoading" type="primary" @click="resetPassword" slot="append">Passwort zurücksetzen</el-button>
        </el-input>
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
      user: null
    }
  },
  props: {
    ip: String
  },
  async created() {
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

    }
  },
}
</script>

<style scoped>

</style>