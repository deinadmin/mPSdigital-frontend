<template>
  <div class="home left-indent-view">
    <h1>Home</h1>
    <p style="margin-top: -14px">Willkommen, {{ user.username }}!</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr ">
      <el-card style="margin-right: 18px" class="box-card">
        <div slot="header" class="clearfix">
          <span>Anwesenheitsliste <b>Heute, {{ formatDate(new Date()) }}</b></span>
        </div>
        <el-table
            :data="users"
border
            style="width: 100%"
            :row-class-name="getRowClass">
          <el-table-column
              prop="name"
              label="Name">
          </el-table-column>
          <el-table-column
              prop="atSchool"
              label="Status">
          </el-table-column>
        </el-table>
      </el-card>
      <el-card style="margin-right: 18px" class="box-card">
        <div slot="header" class="clearfix">
          <span>Deine Informationen</span>
        </div>
        <p><b>Benutzername:</b></p>
        <el-input style="user-select: none;" readonly :value="user.username"></el-input>
        <p><b>Rolle:</b></p>
        <el-input style="user-select: none;" readonly :value="user.role"></el-input>
        <p><b>Passwort geändert:</b></p>
        <el-input style="user-select: none;" readonly :value="user.changedPassword ? 'Ja' : 'Nein'"></el-input>
      </el-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  props: {
    ip: String,
    user: Object
  },
  data() {
    return {
      users: [{name: "Max Mustermann", atSchool: true}, {name: "Erika Mustermann", atSchool: false}, {name: "Hans Peter", atSchool: true}]
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    getRowClass({row}) {
      return row.atSchool ? 'success-row' : 'error-row'
    }
  }
}
</script>

<style>
.el-table .success-row {
  background-color: #e6ffda !important; /* Light green for present */
}

.el-table .error-row {
  background-color: #ffd9d9 !important; /* Light red for absent */
}
</style>