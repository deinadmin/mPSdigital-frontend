<template>
  <div class="home">
    <div>
      <h1>Login » mPSdigital</h1>
      <el-card shadow="always" style="text-align: left">
        <p style="margin-top: 0">Email-Adresse:</p>
        <el-input size="medium" prefix-icon="el-icon-user-solid" placeholder="name.nachname" v-model="email"><template slot="append">@mps-ki.de</template></el-input>
        <p>Passwort:</p>
        <el-input show-password size="medium" type="password" prefix-icon="el-icon-lock" placeholder="●●●●●●●●●●" v-model="password"></el-input>
        <br>
        <el-button :loading="loading" @click="logIn" type="primary" style="width: 100%; margin-top: 15px" size="small">Login</el-button>
        <p style="text-align: center; margin-bottom: 0">Du brauchst Hilfe? <el-button plain style="margin-left: 5px" size="mini" type="primary" @click="openLeitfaden">Klick hier!</el-button></p>
      </el-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'LoginView',
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      verified: false,
    }
  },
  props: {
    ip: String
  },
  created() {
    let that = this
    document.addEventListener("keydown", (e) => {
      if(e.keyCode === 13) {
        that.logIn()
      }
    })
  },
  methods: {
    openLeitfaden() {
      window.open('https://click.craft.me/mpsdigital/leitfaden','_blank');
    },
    logIn() {
      if(this.email === '' || this.password === '') {
        return this.$message.error("Bitte achte darauf, dass jedes Feld ausgefüllt ist!")
      }
      this.email =  this.email.replace("@mps-ki.de", "")
      console.log(this.email)

      this.loading = true;
      let that = this
      that.$emit('logIn', { username: that.email, password: that.password })
    },
    resetForm() {
      this.loading = false
      this.password = ""
    }
  }
}
</script>

<style scoped>

.home {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0;
  margin: 0;
}

.home div {
  max-width: 600px;
}

</style>