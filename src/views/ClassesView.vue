<template>
  <div class="left-indent-view">
    <h1>Klassen
      <el-tooltip placement="bottom" content="Klasse erstellen">
        <i @click="createClass" style="cursor: pointer" class="el-icon-circle-plus"></i>
      </el-tooltip>
    </h1>
    <p style="margin-top: -14px">Hier hast du eine Übersicht über die eingerichteten Klassen.</p>
    <el-table
        :data="forms"
        stripe
        border
        @row-click="goToGroup"
        style="width: 100%">
      <el-table-column
          prop="name"
          sortable
          label="Name">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'GroupsView',
  data() {
    return {
      forms: [],
    }
  },
  props: {
    ip: String
  },
  methods: {
    createClass() {
      this.$prompt('Bitte gib die Bezeichnung der Klasse ein:', 'Klasse erstellen', {
        confirmButtonText: 'Erstellen',
        cancelButtonText: 'Abbrechen',
      }).then(({value}) => {
        console.log(value);
        axios.post(this.ip + "form", {name: value}, {withCredentials: true}).then(() => {
          this.$message.success("Klasse erfolgreich erstellt.")

        }).catch(() => {
          this.$message.error("Fehler beim Erstellen der Klasse.")
        });
      }).catch(() => {
        console.log("abgegbrochen")
      });
    },
    goToGroup(event) {
      this.$router.push("/group/" + event.id)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE', {year: 'numeric', month: 'long', day: 'numeric'})
    },
  },
  async created() {
    try {
      const response = await axios.get(this.ip + "forms/", {withCredentials: true});

      if (response.status === 200) {

        this.forms = response.data
      }

    } catch {
      this.$message.error("An error occured.");
    }
  }
}
</script>

<style scoped>

</style>