<template>
  <div>
    <h1>Anträge</h1>
    <p style="margin-top: -14px">Hier kannst du alle Anträge sehen, filtern, ordnen und genehmigen bzw. ablehnen.</p>
    <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="ID"
          width="50">
      </el-table-column>
      <el-table-column
          prop="title"
          label="Titel">
      </el-table-column>
      <el-table-column
          prop="group"
          label="Gruppe"
          width="300">
      </el-table-column>
      <el-table-column
          label="Datum"
          width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
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
              @click.native.prevent="goToPin(scope.$index, tableData)"
              type="text"
              size="small">
            📌 Zur Pinnwand
          </el-button>
          <el-button
              @click.native.prevent="approveRequest(scope.row)"
              type="text"
              size="small">
            ✅ Genehmigen
          </el-button>
          <el-button
              @click.native.prevent="$emit('logOut')"
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
export default {
  name: 'RequestsView',
  created() {
    this.$router.s
  },
  data() {
    return {
      tableData: [{
        status: 'ABGELEHNT',
        group: 'Baumhaus bauen mit echtem Holz',
        title: 'Bäume fällen im Schwarzwald ohne Genehmigung',
        date: "2024-01-03",
        id: 0
      }, {
        status: 'ABGELEHNT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 1
      }, {
        status: 'GENEHMIGT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 2
      }, {
        status: 'GENEHMIGT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 3
      }, {
        status: 'AUSSTEHEND',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 4
      }, {
        status: 'AUSSTEHEND',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 5
      }, {
        status: 'GENEHMIGT',
        group: 'Hotdogs selber herstellen',
        title: 'Ausflug zur Würstchenfabrik in Würzburg',
        date: "2024-01-03",
        id: 6
      }, {
        status: 'ABGELEHNT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 1
      }, {
        status: 'GENEHMIGT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 2
      }, {
        status: 'GENEHMIGT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 3
      }, {
        status: 'AUSSTEHEND',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 4
      }, {
        status: 'ABGELEHNT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 1
      }, {
        status: 'GENEHMIGT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 2
      }, {
        status: 'GENEHMIGT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 3
      }, {
        status: 'AUSSTEHEND',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 4
      }, {
        status: 'ABGELEHNT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 1
      }, {
        status: 'GENEHMIGT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 2
      }, {
        status: 'GENEHMIGT',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 3
      }, {
        status: 'AUSSTEHEND',
        group: 'Petersburg entdecken',
        title: 'No. 189, Grove St, Los Angeles',
        date: "2024-01-03",
        id: 4
      }]
    }
  },
  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    approveRequest(data) {
      if(data.status === "GENEHMIGT") return this.$message.error("Dieser Antrag wurde bereits genehmigt!")
      this.$message.success('Der Antrag der Gruppe "' + data.group + '" wurde genehmigt!')
    }
  }
}
</script>

<style scoped>

</style>