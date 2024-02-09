<template>
  <div style="padding: 0; margin: 0">
    <nav v-if="loaded && loggedIn">
      <el-menu
          router
          style="height: 100%; position: relative"
          :default-active="this.$router.currentRoute.name">
        <el-menu-item index="account">
          <i class="el-icon-user"></i>
          <span>{{ user.username }}</span>
        </el-menu-item>
        <hr style="margin: 0; padding: 0;">
        <el-menu-item route="/" index="home">
          <i class="el-icon-s-home"></i>
          <span>Home</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'teacher' || user.role === 'admin'" route="/users" index="users">
          <i class="el-icon-set-up"></i>
          <span>Benutzerverwaltung</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'teacher' || user.role === 'admin'" route="/groups" index="groups">
          <i class="el-icon-user-solid"></i>
          <span>Gruppen</span>
        </el-menu-item>
        <el-menu-item v-else route="/my-group" index="my-group">
          <i class="el-icon-user-solid"></i>
          <span>Meine Gruppe</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'teacher' || user.role === 'admin'" route="/requests" index="requests">
          <i class="el-icon-s-order"></i>
          <span>Anträge</span>
        </el-menu-item>
        <el-menu-item v-else route="/my-requests" index="my-requests">
          <i class="el-icon-s-order"></i>
          <span>Meine Anträge</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'student'" route="/pinwall" index="pinwall">
          <i class="el-icon-coordinate"></i>
          <span>Meine Pinnwand</span>
        </el-menu-item>
        <el-button @click="logOut" icon="el-icon-caret-left" style="border-radius: 0; width: 100%; bottom: 0; position: absolute" type="danger">Logout</el-button>
      </el-menu>
    </nav>
    <div id="app">
      <router-view ip="ip" @logOut="logOut()" v-if="loggedIn && loaded"/>
    </div>
    <LoginView ref="loginView" @logIn="logIn($event)" v-if="!loggedIn && loaded" />
    <!-- <el-button type="warning" v-if="!loggedIn" @click="loggedIn = true" style="position: fixed; left: 10px; bottom: 10px">Set state "loggedIn" to true</el-button> -->
    <el-button type="primary" v-if="loggedIn" @click="getRequest" style="position: fixed; right: 10px; bottom: 10px">GET request to "/"</el-button>
    <div v-if="!loaded" style="position: fixed; left: 0; right: 0; top: 300px" v-loading="!loaded"
         element-loading-text="mPSdigital wird geladen..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">

    </div>
    <el-dialog
        :close-on-click-modal="false"
        :show-close="false"
        title="Wichtig!"
        :close-on-press-escape="false"
        :visible.sync="showDefaultPasswordChangeDialog"
        width="30%">
      <el-alert :closable="false" type="warning">Warnung: Dein Account hat momentan ein unsicheres Standard-Passwort!</el-alert>
      <p>Bitte ändere dein Standard-Passwort zu einem sicheren Passwort:</p>
      <el-input v-model="newPassword" placeholder="Passwort" type="password" show-password></el-input>
      <el-input v-model="newPasswordRepeat"  style="margin-top: 10px" placeholder="Passwort wiederholen" type="password" show-password></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="() => {showDefaultPasswordChangeDialog = false; this.$notify({title: 'Warnung!', message: 'Es wird dringend empfohlen, das Standard-Passwort in ein sicheres zu ändern.', type: 'warning'})}">Später</el-button>
    <el-button :loading="defaultPasswordChangeLoading" type="primary" @click="updatePassword">Passwort sichern</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<style>
* {
  user-select: none;
}
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}
#app {
  margin-left: 320px;
}
nav {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
}


</style>
<script>

import axios from "axios";
axios.defaults.withCredentials = true
import LoginView from "@/views/LoginView.vue";

export default {
  name: 'App',
  components: {LoginView},
  data() {
    return {
      loaded: false,
      loggedIn: false,
      ip: "http://localhost:3001/",
      showDefaultPasswordChangeDialog: false,
      newPassword: "",
      newPasswordRepeat: "",
      user: {
        username: "",
        role: ""
      },
      defaultPasswordChangeLoading: false
    }
  },
  async created() {
    await this.getUserInfo()
  },
  methods: {
    async getUserInfo() {

      try {
        const response = await axios.get(this.ip, {withCredentials: true});

        if (response.status === 200) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Du bist eingeloggt.',
            type: 'success',
            duration: 1000,
            showClose: false
          });

          this.loaded=true

          this.loggedIn = true
          this.user=response.data
          console.log(this.user)
        }

      } catch (error) {
        if (error.response.status === 401) {
          this.loggedIn = false
          this.loaded = true
        } else {
          this.$message.error("An error occurred: " + error.message);
        }
      }
    },
    async updatePassword() {
      this.defaultPasswordChangeLoading = true
      if(this.newPassword === "" || this.newPasswordRepeat === "") {
        this.$message.error("Achte darauf, dass alle Felder ausgefüllt sind!")
        this.defaultPasswordChangeLoading = false
        return
      }
      if(this.newPassword !== this.newPasswordRepeat) {
        this.$message.error("Die Passwörter stimmen nicht überein!")
        this.defaultPasswordChangeLoading = false
        return
      }
      if(!(/^(?=.*[!@#$%^&*])(?=.{8,})/.test(this.newPassword))) {
        this.$message.error("Dein Passwort sollte mindestens 8 Zeichen lang sein und ein Sonderzeichen enthalten!")
        this.defaultPasswordChangeLoading = false
        return
      }

      try {
        const response = await axios.post(this.ip + 'changePassword/', {
          old: this.user.username,
          new: this.newPassword
        }, {withCredentials: true});

        if (response.status === 200) {
          this.$message.success("Dein Passwort wurde erfolgreich geändert!")
          this.showDefaultPasswordChangeDialog = false
          this.defaultPasswordChangeLoading = false
        }

      } catch (error) {
        this.$message.error("Fehler.");
      }


    },
    async logOut() {
      let that = this
      try {
        const response = await axios.get(this.ip + "logout", {withCredentials: true});

        if (response.status === 200) {
          that.$notify({
            title: "Alles in Ordnung!",
            message: 'Du wurdest erfolgreich ausgeloggt.',
            type: 'success',
            duration: 1000,
            showClose: false
          });

          that.loggedIn = false



        }

      } catch (error) {
        if (error.response.status === 401) {
          this.$message.error("Fehler.");
        } else {
          console.log("An error occurred: ", error.message);
        }
      }
    },
    async getRequest() {
      try {
        const response = await axios.get(this.ip, {withCredentials: true});

        if (response.status === 200) {
          this.$message("Du bist eingeloggt!");

          this.loggedIn = true
          console.log(response.data)



        }

      } catch (error) {
        if (error.response.status === 401) {
          this.$message.error("Fehler.");
        } else {
          console.log("An error occurred: ", error.message);
        }
      }
    },
    async logIn(event) {
      if(this.loggedIn) return

      try {
        const response = await axios.post(this.ip + 'login/', {
          username: event.username,
          password: event.password
        }, {withCredentials: true});

        if (response.status === 200) {
          await this.getUserInfo()

          console.log(response.data.mustChangePassword)

          if(response.data.mustChangePassword) {
            this.showDefaultPasswordChangeDialog = true
          }

          this.loggedIn = true
          const sessionCookie = response.headers['set-cookie'];
          console.log("Session Cookie: ", sessionCookie);

        }

      } catch (error) {
        if (error.response.status === 401) {
          this.$message.error("Die Kombination aus Benutzername und Passwort existiert nicht.");
          this.$refs.loginView.resetForm()
        } else {
          console.log("An error occurred: ", error.message);
        }
      }
    }
  }
}

</script>