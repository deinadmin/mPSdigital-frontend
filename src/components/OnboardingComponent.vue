<template>
  <el-dialog title="Willkommen zu mPSdigital!" :visible="showOnboarding" :show-close="false" @close="handleClose">
    <el-steps style="margin-bottom: 20px" align-center :active="step" finish-status="success">
      <el-step title="Schritt 1" description="Aktualisiere dein Passwort"></el-step>
      <el-step title="Schritt 2" description="Gruppe erstellen/beitreten"></el-step>
      <el-step title="Schritt 3" description="Fertig! Viel Spaß!"></el-step>
    </el-steps>
    <div v-if="step === 0">
      <el-alert :closable="false" type="warning">Warnung: Dein Account hat momentan ein unsicheres Standard-Passwort!</el-alert>
      <p>Bitte ändere dein Standard-Passwort zu einem sicheren Passwort:</p>
      <el-input v-model="newPassword" placeholder="Passwort" type="password" show-password></el-input>
      <el-input v-model="newPasswordRepeat"  style="margin-top: 10px" placeholder="Passwort wiederholen" type="password" show-password></el-input>
      <el-button :loading="defaultPasswordChangeLoading" @click="updatePassword" style="margin-top: 10px; margin-left: auto; margin-right: 0" type="primary">Passwort aktualisieren</el-button>
    </div>
    <div v-if="step === 1">
      <p>Hat ein Mitglied deiner Gruppe schon eine Gruppe erstellt? Falls ja, kannst du dieser hier beitreten.</p>
      <el-alert type="warning" :closable="false">Sprecht euch so ab, dass pro Gruppe nur eine Person die Gruppe erstellt!</el-alert>
      <div id="onboarding-choose">
        <div @click="goToCreateGroup">
          <i class="fa-regular fa-circle-plus"></i>
          <h2>Gruppe erstellen</h2>
          <p>Erstellt eine neue Gruppe, der die anderen Mitschüler beitreten können.</p>
        </div>
        <div @click="goToJoinGroup">
          <i class="fa-solid fa-right-to-bracket"></i>
          <h2>Gruppe beitreten</h2>
          <p>Tritt einer Gruppe bei, die ein anderes <br>Mitglied deiner Gruppe bereits erstellt hat.</p>
        </div>
      </div>
    </div>
    <el-dialog top="20vh" width="40%" append-to-body title="Gruppe erstellen" :visible.sync="showCreateGroup">
      <p style="margin-top: -20px">Gib deiner Gruppe einen Namen:</p>
      <el-input v-model="newGroup.name" placeholder="Iglu bauen am Nordpol"></el-input>
      <p>Ist dein Projekt im Rahmen der mPS-Stunden oder der Herausforderung?</p>
      <el-select style="width: 100%" v-model="newGroup.type" placeholder="mPS / Herausforderung">
        <el-option label="mPS" value="mPS"></el-option>
        <el-option label="Herausforderung" value="Herausforderung"></el-option>
      </el-select>
      <br>
      <el-button @click="createGroup()" :disabled="newGroup.type === '' || newGroup.name === ''" icon="fa-solid fa-plus" style="margin-top: 10px; padding-left: 12px; padding-right: 12px" type="success"> Gruppe erstellen</el-button>
    </el-dialog>
    <el-dialog top="30vh" width="40%" append-to-body title="Gruppe beitreten" :visible.sync="showJoinGroup">
      <p style="margin-top: -20px">Suche nach dem Namen deiner Gruppe:</p>
      <el-autocomplete
          :disabled="loadedGroups===false"
          v-model="groupSearch"
          style="width: 100%; margin-bottom: 10px"
          value-key="name"
          :fetch-suggestions="querySearchForGroup"
          placeholder="Iglu bauen am Südpol"
          @select="handleSelectGroup"
      ></el-autocomplete>
      <el-alert :closable="false">Tipp: Frage deine Mitschüler nach dem genauen Namen eurer Gruppe.</el-alert>
      <el-button @click="joinGroup" style="margin-top: 10px" type="primary" :disabled="selectedGroup===null">Gruppe beitreten</el-button>
    </el-dialog>
    <div v-if="step===3">
      <h1 style="text-align: center; font-size: 45px">Alle Schritte erledigt! Viel Spaß!</h1>
      <el-button @click="handleClose" type="success">Schließen</el-button>
    </div>
  </el-dialog>
</template>

<script>


import axios from "axios";

export default {
  name: "OnboardingComponent",
  data() {
    return {
      step: 0,
      showCreateGroup: false,
      showJoinGroup: false,
      newGroup: {
        name: "",
        type: ""
      },
      groupSearch: "",
      groups: [],
      loadedGroups: false,
      newPassword: "",
      newPasswordRepeat: "",
      defaultPasswordChangeLoading: false,
      selectedGroup: null
    }
  },
  props: {
    showOnboarding: Boolean,
    user: Object,
    ip: String
  },
  created() {
    if(this.user.changedPassword === true) this.step = 1
  },
  methods: {
    handleSelectGroup(item) {
      this.selectedGroup = item
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
      if(!(/^(?=.*[!@#$%^&*?])(?=.{8,})/.test(this.newPassword))) {
        this.$message.error("Dein Passwort sollte mindestens 8 Zeichen lang sein und ein Sonderzeichen enthalten!")
        this.defaultPasswordChangeLoading = false
        return
      }

      try {
        const response = await axios.post(this.ip + 'account/changePassword/', {
          old: this.user.username,
          new: this.newPassword
        }, {withCredentials: true});

        if (response.status === 200) {
          this.$message.success("Dein Passwort wurde erfolgreich geändert!")
          this.step=1;
          this.defaultPasswordChangeLoading = false
        }

      } catch (error) {
        this.$message.error("Fehler.");
      }


    },
    handleClose() {
      if(this.step<3) return
      this.$emit('closeOnboarding')
    },
    goToCreateGroup() {
      this.showCreateGroup = true
    },
    async createGroup() {
      if(this.newGroup.type === '' || this.newGroup.name === '') {
        this.$message.error("Bitte achte darauf, dass beide Felder ausgefüllt sind.")
        return
      }

      this.newGroup = {
        name: this.newGroup.name,
        type: this.newGroup.type,
        startDate: Date()
      }


      try {
        const response = await axios.post(this.ip + "group/", this.newGroup, {withCredentials: true});

        if(response.status === 201) {
          this.$notify({
            title: "Das hat geklappt!",
            message: 'Deine Gruppe wurde erfolgreich erstellt.',
            type: 'success',
            duration: 1000,
            showClose: false
          });
          this.showCreateGroup = false
          this.step=3;
        }

      } catch(e) {
        this.$notify({
          title: "Ups, das hat nicht geklappt!",
          message: e.message,
          type: 'error',
          duration: 1000,
          showClose: false
        });
      }
    },
    async joinGroup() {
      if(this.selectedGroup === null) return
      try {
        const response = await axios.put(this.ip + "group/" + this.selectedGroup.id + "/" + this.user.username, {}, {withCredentials: true});

        if (response.status === 200) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Du bist der Gruppe "' + this.selectedGroup.name + '" beigetreten.',
            type: 'success',
            duration: 1000,
            showClose: false
          });

          this.step=3;
          this.showJoinGroup = false
        }

      } catch (error) {
        if (error.response.status === 401) {
          this.loggedIn = false
        } else {
          this.$message.error("An error occurred: " + error.message);
        }
      }

    },
    async goToJoinGroup() {
      this.showJoinGroup = true
      try {
        const response = await axios.get(this.ip + "groups", {withCredentials: true});

        if (response.status === 200) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Request successful.',
            type: 'success',
            duration: 1000,
            showClose: false
          });


          this.groups = response.data.groups
          console.log(response.data.groups)
          this.loadedGroups = true
        }

      } catch (error) {
        if (error.response.status === 401) {
          this.loggedIn = false
        } else {
          this.$message.error("An error occurred: " + error.message);
        }
      }
    },
    querySearchForGroup(queryString, cb) {
      if(this.loadedGroups) {
        var groups = this.groups;
        console.log("Gruppen: " + groups[0].name)
        var results = queryString ? groups.filter(this.createFilter(queryString)) : groups;
        // call callback function to return suggestions
        console.log("Results:")
        console.log(results)
        cb(results);
      } else {
        cb({ name: "Die Gruppen konnten nicht geladen werden." })
      }
    },
    createFilter(queryString) {
      return (group) => {
        return (group.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
  }
}
</script>

<style scoped>
#onboarding-choose {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
}
#onboarding-choose {
  cursor: pointer;
}
#onboarding-choose div {
  transition: .5s;
}
#onboarding-choose div:hover {
  transform: scale(1.05);
}
#onboarding-choose div:active {
  transform: scale(0.98);
}
#onboarding-choose div p {
  width: 220px;
  font-size: 11px;
}
#onboarding-choose div i {
  font-size: 50px;
}
</style>