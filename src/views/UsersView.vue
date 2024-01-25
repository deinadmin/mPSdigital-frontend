<template>
  <div class="home">
    <h1>Benutzerverwaltung</h1>
    <p style="margin-top: -14px">Hier kannst du Benutzer erstellen und verwalten.</p>
    <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%">
      <el-table-column
          prop="prename"
          label="Vorname"
          sortable
          width="200">
      </el-table-column>
      <el-table-column
          prop="name"
          label="Nachname"
          sortable
          width="200">
      </el-table-column>
      <el-table-column
          prop="group"
          sortable
          label="Gruppe"
          width="350">
      </el-table-column>
      <el-table-column
          prop="status"
          label="Status"
          sortable
          width="150">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="Operations"
          width="200">
        <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small">
          ✅ Genehmigen
        </el-button>
        <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small">
          ❌ Ablehnen
        </el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'UsersView',
}
</script>
