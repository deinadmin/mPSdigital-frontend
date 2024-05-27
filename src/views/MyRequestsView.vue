<template>
  <div class="left-indent-view">
    <h1>Meine Anträge
      <el-tooltip placement="bottom" content="Einen Antrag stellen">
        <i @click="showCreateRequestDialog=true" style="cursor: pointer" class="el-icon-circle-plus"></i>
      </el-tooltip>
    </h1>
    <p style="margin-top: -14px">Hier kannst du deine Anträge sehen.</p>
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
          label="Titel">
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
          :filters="[{text: 'ABGELEHNT', value: 'denied'}, {text: 'GENEHMIGT', value: 'accepted'}, {text: 'AUSSTEHEND', value: 'pending'}]"
          :filter-method="filterHandler"
          width="150">
      </el-table-column>
    </el-table>
    <el-dialog width="30%" title="Einen Antrag stellen" :visible.sync="showCreateRequestDialog">
      <el-form :model="createRequestForm">
        <el-form-item label="Beschreibung:">
          <el-input v-model="createRequestForm.description" placeholder="Ausflug zum Nordpol" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Datum:">
          <el-date-picker
              v-model="createRequestForm.date"
              type="date"
              style="margin-left: 10px"
              placeholder="Datum festlegen">
          </el-date-picker>
        </el-form-item>
        <el-alert :closable="false" type="info">Deine Lehrer werden über deinen Antrag informiert und können diesen genehmigen/ablehnen.</el-alert>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showCreateRequestDialog = false">Abbrechen</el-button>
    <el-button :loading="loading" type="primary" @click="createRequest">Erstellen</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'MyRequestsView',
  props: {
    ip: String,
    user: Object
  },
  async created() {
    await this.loadRequests()
  },
  data() {
    return {
      loading: false,
      requests: [],
      showCreateRequestDialog: false,
      createRequestForm: {
        description: "",
        group: this.user.group,
        date: "",
      }
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
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
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    async createRequest() {
      this.loading = true
      try {
        const response = await axios.post(this.ip + "excursion/", this.createRequestForm, {withCredentials: true});
        console.log(response)
        if (response.status === 201) {
          this.$notify({
            title: "Alles in Ordnung!",
            message: 'Dein Antrag wurde gestellt!',
            type: 'success',
            duration: 3000,
            showClose: false
          });
          await this.loadRequests()
          this.showCreateRequestDialog = false
          this.loading = false
        } else {
          this.loading = false
          this.$notify({
            title: "Ups!",
            message: 'Das hat nicht geklappt!',
            type: 'error',
            duration: 3000,
            showClose: false
          });
        }

      } catch(e) {
        this.loading = false
        this.$notify({
          title: "Ups!",
          message: 'Das hat nicht geklappt!',
          type: 'error',
          duration: 3000,
          showClose: false
        });
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>

</style>