<template>
  <div style="padding: 0; margin: 0">
    <nav v-if="loaded && loggedIn">
      <el-menu
          router
          style="height: 100%; position: relative"
          :default-active="this.$router.currentRoute.name">
        <el-menu-item>
          <i class="menu-icon fa-solid fa-user"></i>
          <span>{{ user.username }}</span>
        </el-menu-item>
        <hr style="margin: 0; padding: 0; opacity: .2">
        <el-menu-item route="/" index="home">
          <i class="menu-icon fa-solid fa-house"></i>
          <span>Home</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'teacher' || user.role === 'admin'" route="/users" index="users">
          <i class="menu-icon fa-solid fa-head-side-gear"></i>
          <span>Benutzerverwaltung</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'teacher' || user.role === 'admin'" route="/groups" index="groups">
          <i class="menu-icon fa-solid fa-people-group"></i>
          <span>Gruppen</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'teacher' || user.role === 'admin'" route="/classes" index="classes">
          <i class="menu-icon fa-duotone fa-screen-users"></i>
          <span>Klassen</span>
        </el-menu-item>
        <el-menu-item v-else route="/my-group" index="my-group">
          <i class="menu-icon fa-solid fa-people-group"></i>
          <span>Meine Gruppe</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'teacher' || user.role === 'admin'" route="/requests" index="requests">
          <i class="menu-icon fa-solid fa-message-exclamation"></i>
          <span>Anträge</span>
        </el-menu-item>
        <el-menu-item v-else route="/my-requests" index="my-requests">
          <i class="menu-icon fa-solid fa-message-exclamation"></i>
          <span>Meine Anträge</span>
        </el-menu-item>
        <el-menu-item v-if="user.role === 'student'" route="/pinwall" index="pinwall">
          <i class="menu-icon fa-solid fa-map-pin"></i>
          <span>Meine Pinnwand</span>
        </el-menu-item>
        <el-button @click="logOut" style="border-radius: 0; width: 100%; bottom: 0; position: absolute" type="danger">Logout<i style="margin-left: 8px" class="fa-solid fa-arrow-right-from-bracket"></i></el-button>
      </el-menu>
    </nav>
    <div id="app">
      <router-view :user="user" :ip="ip" @logOut="logOut()" v-if="loggedIn && loaded"/>
    </div>
    <OnboardingComponent :ip="ip" v-if="loaded && loggedIn" :user="user" @closeOnboarding="closeOnboarding" :show-onboarding="showOnboarding" />
    <LoginView :ip="ip" ref="loginView" @logIn="logIn($event)" v-if="!loggedIn && loaded" />
    <!-- <el-button type="warning" v-if="!loggedIn" @click="loggedIn = true" style="position: fixed; left: 10px; bottom: 10px">Set state "loggedIn" to true</el-button> -->
    <div v-if="!loaded" style="position: fixed; left: 0; right: 0; top: 300px" v-loading="!loaded"
         element-loading-text="mPSdigital wird geladen..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">

    </div>

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
  margin-left: 300px;
}
nav {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
}
.menu-icon {
  margin-right: 10px;
}
.left-indent-view {
  margin-left: 20px;
}

</style>
<script>

import axios from "axios";
axios.defaults.withCredentials = true
import LoginView from "@/views/LoginView.vue";
import OnboardingComponent from "@/components/OnboardingComponent.vue";

export default {
  name: 'App',
  components: {OnboardingComponent, LoginView},
  data() {
    return {
      loaded: false,
      loggedIn: false,
      ip: "http://localhost:3001/api/",
      user: {
        username: "",
        role: "",
        hasGroup: false,
        changedPassword: false
      },
      showOnboarding: false
    }
  },
  async created() {
    await this.getUserInfo()
  },
  methods: {
    async getUserInfo() {

      try {
        const response = await axios.get(this.ip + "account/", {withCredentials: true});

        if (response.status === 200) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Du bist eingeloggt.',
            type: 'success',
            duration: 1000,
            showClose: false
          });
          if(typeof response.data.group === "undefined" && response.data.role === "student") this.showOnboarding = true
          if(response.data.changedPassword === false && response.data.role === "student") this.showOnboarding = true

          this.loggedIn = true
          this.user=response.data
          console.log(this.user)
          this.loaded=true

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
    closeOnboarding() {
      this.showOnboarding = false
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