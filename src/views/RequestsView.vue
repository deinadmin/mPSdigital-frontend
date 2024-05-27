<template>
  <div class="left-indent-view">
    <h1>Anträge</h1>
    <p style="margin-top: -14px">Hier kannst du alle Anträge sehen, filtern, ordnen und genehmigen bzw. ablehnen.</p>
    <el-table
        :data="requests"
        stripe
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="ID"
          width="50">
      </el-table-column>
      <el-table-column
          prop="description"
          label="Titel"
          width="250"
      >
      </el-table-column>
      <el-table-column
          prop="group.name"
          label="Gruppe">
      </el-table-column>
      <el-table-column
          label="Datum"
          sortable
          width="150">
        <template slot-scope="scope">
          {{ formatDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="Status"
          :filters="[{text: 'ABGELEHNT', value: 'ABGELEHNT'}, {text: 'GENEHMIGT', value: 'GENEHMIGT'}, {text: 'AUSSTEHEND', value: 'AUSSTEHEND'}]"
          :filter-method="filterHandler"
          width="150">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="Operationen"
          width="300">
        <template slot-scope="scope">
          <el-button
              @click.native.prevent="goToPin(scope.$index, requests)"
              type="text"
              size="small">
            📌 Zur Pinnwand
          </el-button>
          <el-button
              @click.native.prevent="updateRequest(scope.row, true)"
              type="text"
              size="small">
            ✅ Genehmigen
          </el-button>
          <el-button
              @click.native.prevent="updateRequest(scope.row, false)"
              type="text"
              size="small">
            ❌ Ablehnen
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'RequestsView',
  props: {
    ip: String
  },
  async created() {
    await this.loadRequests()
  },
  data() {
    return {
      requests: [],
    }
  },
  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    async loadRequests() {
      try {
        const response = await axios.get(this.ip + "excursions/", {withCredentials: true});
        console.log(response)
        if (response.status === 200) {

          this.requests = response.data
        }

      } catch {
        this.$message.error("An error occured.");
      }
    },
    async updateRequest(data, status) {
      if(data.status === (status ? "accepted" : "denied")) return this.$message.error("Dieser Antrag wurde bereits " + (status ? "genehmigt" : "abgelehnt") + "!")

      this.$confirm('Möchtest du den Antrag wirklich ' + (status ? "genehmigen" : "ablehnen") + '?', 'Warning', {
        confirmButtonText: 'Ja, ' + (status ? "genehmigen" : "ablehnen") + '!',
        cancelButtonText: 'Abbrechen',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await axios.patch(this.ip + "excursion/" + data.id, {state: status ? "accepted" : "denied"}, {withCredentials: true});

          if (response.status !== 200) {
            this.$message.error("Es ist ein Fehler aufgetreten.");
          } else {
            await this.loadRequests()
            this.$message.success('Der Antrag der Gruppe "' + data.group.name + '" wurde ' + (status ? "genehmigt" : "abgelehnt") + '!');
          }

        } catch (e) {
          this.$message.error("Es ist ein Fehler aufgetreten.");
        }
      }).catch(() => {
        console.log("Abgebrochen")
      });






    },
    async goToPin(index, data) {
      this.$notify({
        title: "Bitte warten...",
        message: 'Die Pinnwand wird geöffnet!',
        type: 'info',
        duration: 3000,
        showClose: false
      });

      let groupId = data[index].group.id


      const response = await axios.get(this.ip + "group/" + groupId, {withCredentials: true});

      if (response.status === 200) {

        console.log(response.data)
        window.open(response.data.pinboard, '_blank')
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
    },

  }
}
</script>

<style scoped>

</style>