<template>
  <div class="home left-indent-view">
    <h1>Benutzerverwaltung
      <el-tooltip placement="bottom" content="Benutzer erstellen">
        <i @click="showCreateUserDialog=true" style="cursor: pointer" class="el-icon-circle-plus"></i>
      </el-tooltip>
    </h1>
    <p style="margin-top: -14px">Hier kannst du Benutzer erstellen und verwalten.</p>
    <el-table
        :data="users"
        stripe
        border
        @row-click="goToUser"
        style="width: 100%">
      <el-table-column
          prop="username"
          label="Benutzername"
          sortable>
      </el-table-column>
      <el-table-column
          prop="role"
          sortable
          label="Rolle">
      </el-table-column>
    </el-table>
    <el-dialog width="30%" title="Einen Benutzer erstellen" :visible.sync="showCreateUserDialog">
      <el-form :model="createUserForm">
        <el-form-item label="Benutzername:">
          <el-input v-model="createUserForm.username" placeholder="vorname.nachname" autocomplete="off"></el-input>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="Rolle:" style="margin-right: 5px">
            <el-select v-model="createUserForm.role" placeholder="Rolle des Benutzers">
              <el-option label="Schüler" value="student"></el-option>
              <el-option label="Lehrer" value="teacher"></el-option>
              <el-option label="Admin" value="admin"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Klasse:" v-if="createUserForm.role === 'student'">
            <el-autocomplete
                :disabled="loadedClasses===false"
                value-key="name"
                :fetch-suggestions="querySearchForGroup"
                placeholder="Klasse"
                v-model="classValue"
                @select="handleSelectClass"
                @change="selectedClass = ''"
            ></el-autocomplete>
          </el-form-item>
        </div>
        <el-alert :closable="false" type="info">Der Account wird mit einem Einmal-Passwort versehen, welches äquivalent zu dem Benutzernamen ist.</el-alert>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showCreateUserDialog = false">Abbrechen</el-button>
    <el-button :loading="loading" type="primary" @click="createUser">{{ createUserForm.username === "" ? "Benutzer erstellen" : 'Benutzer "' + createUserForm.username + '" erstellen'}}</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";


export default {
  name: 'UsersView',
  data() {
    return {
      showCreateUserDialog: false,
      createUserForm: {
        username: "",
        role: ""
      },
      loading: false,
      users: [],
      classes: [],
      loadedClasses: false,
      selectedClass: "",
      classValue: ""
    }
  },
  async created() {
    await this.loadUsers()
    await this.loadClasses()
  },
  props: {
    ip: String
  },
  methods: {
    handleSelectClass(item) {
      this.selectedClass = item
    },
    async loadClasses() {
      try {
        const response = await axios.get(this.ip + "form/", {withCredentials: true});

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
    goToUser(event) {
      this.$router.push("/users/" + event.username)
    },
    async loadUsers() {
      try {

        const response = await axios.get(this.ip + "user/", {withCredentials: true});

        if (response.status === 200) {

          console.log(response.data)
          this.users = response.data
        }

      } catch (error) {
        if (error.response.status === 401) {
          this.$message.error("unauthorized!")
        } else {
          this.$message.error("An error occurred: " + error.message);
        }
      }
    },
    async createUser() {
      this.loading = true

      if(this.createUserForm.username === "" || this.createUserForm.role === "" || (this.createUserForm.role === "student" && this.selectedClass === "")) {
        this.$message.error("Alle Felder müssen ausgefüllt sein!")
        this.loading = false
        return
      }
      console.log(this.createUserForm)
      try {
        const response = await axios.post(this.ip + 'user/' + this.createUserForm.username,this.createUserForm.role === 'student' ? {
          role: this.createUserForm.role,
          form: this.selectedClass.id
        } : {
          role: this.createUserForm.role
        }, {withCredentials: true});

        console.log(response)
        if (response.status === 201) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Der Benutzer wurde erstellt.',
            type: 'success',
            duration: 1000,
            showClose: false
          });
          await this.loadUsers()
          this.loading = false
          this.showCreateUserDialog = false

          this.createUserForm = {
            username: "",
            role: ""
          }


        }else {
          this.$message.error("Ups! Da ist wohl etwas schief gelaufen...")
        }

      } catch (error) {
        if(error.response.status === 403) {
          this.$message.error("Du hast nicht die Berechtigung dies zu tun!")
          this.loading = false
        }
        if(error.response.status === 409) {
          this.$message.error('Es existiert bereits ein Benutzer mit dem Namen "' + this.createUserForm.username + '"!')
          this.loading = false
        }
        if (error.response.status === 401) {
          this.$message.error("Ups! Da ist wohl etwas schief gelaufen...")
          this.loading = false

        } else {
          console.log("An error occurred: ", error.message);
          this.loading = false

        }
      }
    }
  }
}
</script>