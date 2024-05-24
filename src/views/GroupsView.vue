<template>
  <div class="left-indent-view">
    <h1>Gruppen</h1>
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
          prop="startDate"
          label="Start"
          sortable
          width="250">
      </el-table-column>
      <el-table-column
          prop="endDate"
          label="Ende"
          sortable
          width="250">
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
      groups: []
    }
  },
  props: {
    ip: String
  },
  methods: {
    goToGroup(event) {
      this.$router.push("/group/" + event.id)
    },
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