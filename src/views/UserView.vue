<template>
  <div>
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
</template>

<script>
import axios from "axios";

export default {
  name: "UserView",
  data() {
    return {
      passwordResetLoading: false
    }
  },
  methods: {
    async resetPassword() {
      this.passwordResetLoading = true;
      try {
        const response = await axios.post('http://localhost:3001/resetPassword/', {
          username: this.$route.params.username,
        }, {withCredentials: true});
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
          });        }
        if (error.response.status === 401) {
          this.$notify({
            title: "Ups!",
            message: 'Da ist wohl etwas schief gelaufen.',
            type: 'error',
          });
        } else {
          console.log("An error occurred: ", error.message);

        }
      }

    }
  },
}
</script>

<style scoped>

</style>