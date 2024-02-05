<template>
  <div style="padding: 0; margin: 0">
    <nav v-if="loaded && loggedIn">
      <el-menu

          router
          style="height: 100%; position: relative"
          :default-active="this.$router.currentRoute.name">
        <el-menu-item index="account">
          <i class="el-icon-user"></i>
          <span>{{ username }}</span>
        </el-menu-item>
        <hr style="margin: 0; padding: 0;">
        <el-menu-item route="/" index="home">
          <i class="el-icon-s-home"></i>
          <span>Home</span>
        </el-menu-item>
        <el-menu-item route="/users" index="users">
          <i class="el-icon-set-up"></i>
          <span>Benutzerverwaltung</span>
        </el-menu-item>
        <el-menu-item route="/groups" index="groups">
          <i class="el-icon-user-solid"></i>
          <span>Gruppen</span>
        </el-menu-item>
        <el-menu-item route="/requests" index="requests">
          <i class="el-icon-s-order"></i>
          <span>Anträge</span>
        </el-menu-item>
        <el-menu-item route="/pinwall" index="pinwall">
          <i class="el-icon-coordinate"></i>
          <span>Pinnwand</span>
        </el-menu-item>
        <el-button @click="logOut" icon="el-icon-caret-left" style="border-radius: 0; width: 100%; bottom: 0; position: absolute" type="danger">Logout</el-button>
      </el-menu>
    </nav>
    <div id="app">
      <router-view @logOut="logOut()" v-if="loggedIn"/>
    </div>
    <LoginView ref="loginView" @logIn="logIn($event)" v-if="!loggedIn" />
    <el-button type="warning" v-if="!loggedIn" @click="loggedIn = true" style="position: fixed; left: 10px; bottom: 10px">Set state "loggedIn" to true</el-button>
    <el-button type="primary" v-if="loggedIn" @click="getRequest" style="position: fixed; right: 10px; bottom: 10px">GET request to "/"</el-button>

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
import LoginView from "@/views/LoginView.vue";

export default {
  name: 'App',
  components: {LoginView},
  data() {
    return {
      loaded: false,
      loggedIn: false,
      username: ""
    }
  },
  created() {
    this.loaded=true
  },
  methods: {
    logOut() {
      this.loggedIn = false
    },
    async getRequest() {
      try {
        const response = await axios.get('http://172.29.1.231:3001/', {withCredentials: true});

        if (response.status === 200) {
          this.$message.success("Du bist eingeloggt!");

          this.loggedIn = true
          const sessionCookie = response.headers['Set-Cookie'];
          console.log("Session Cookie: ", sessionCookie);


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

      try {
        const response = await axios.post('http://172.29.1.231:3001/login/', {
          username: event.username,
          password: event.password
        }, {withCredentials: true});

        if (response.status === 200) {
          this.$message.success("Du wurdest eingeloggt!");

          console.log(response)

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