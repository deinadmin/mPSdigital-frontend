<template>
  <div class="left-indent-view">
    <h1>Gruppen
      <el-popover
          placement="bottom"
          title="Filter"
          width="300"
          trigger="click">
        <hr style="height: 0.1px; opacity: .1">
        <p>Gib die Klasse an, nach der du filtern möchtest:</p>
        <el-input clearable v-model="filter_class" placeholder="8b">
          <el-button :disabled="false" @click="filterGroups" type="success" slot="append">Filtern</el-button>
        </el-input>
        <el-button slot="reference" type="primary" icon="fa-sharp fa-solid fa-filter"> Nach Klasse filtern</el-button>
      </el-popover>


    </h1>
    <p style="margin-top: -14px">Hier hast du eine Übersicht über die einzelnen Schülergruppen.</p>
    <el-table
        :data="groups"
        stripe
        border
        @row-click="goToGroup"
        style="width: 100%">
      <el-table-column
          prop="id"
          label="Nummer"
      width="100">
      </el-table-column>
      <el-table-column
          prop="name"
          label="Name">
      </el-table-column>
      <el-table-column
          prop="projectType"
          label="Art des Projektes"
          sortable
          width="250">
      </el-table-column>
      <el-table-column
          label="Start"
          sortable
          width="250">
        <template slot-scope="scope">
          {{ formatDate(scope.row.startDate) }}
        </template>
      </el-table-column>
      <el-table-column
          label="Ende"
          sortable
          width="250">
        <template slot-scope="scope">
          {{ scope.row.endDate === null ? "noch offen" : formatDate(scope.row.endDate) }}
        </template>
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
      groups: [],
      filter_class: ""
    }
  },
  props: {
    ip: String
  },
  methods: {
    goToGroup(event) {
      this.$router.push("/group/" + event.id)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    async filterGroups() {
      this.$message.info("Gruppen werden nach Klasse " + this.filter_class + " gefiltert.");
      await console.log("Filtering groups by class " + this.filter_class)

      try {
        const response = await axios.get(this.ip + "groups?form=" + this.filter_class, {withCredentials: true});

        if (response.status === 200) {

          this.groups = response.data.groups
        }

      } catch {
        this.$message.error("An error occured.");
      }

    }
  },
  async created() {
    try {
      const response = await axios.get(this.ip + "groups/", {withCredentials: true});

      if (response.status === 200) {

        this.groups = response.data.groups
        console.log(response.data.groups)
      }

    } catch {
        this.$message.error("An error occured.");
    }
  }
}
</script>

<style scoped>

</style>