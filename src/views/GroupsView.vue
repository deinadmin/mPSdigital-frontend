<template>
  <div>
    <h1>Gruppen</h1>
    <p style="margin-top: -14px">Hier hast du eine Übersicht über die einzelnen Schülergruppen.</p>
    <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="Nummer">
      </el-table-column>
      <el-table-column
          prop="name"
          label="Name"
          width="300">
      </el-table-column>
      <el-table-column
          prop="members"
          label="Mitglieder"
          sortable
          width="150">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="Operations"
          width="200">
        <el-button
            @click.native.prevent="$emit('logOut')"
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
export default {
  name: 'GroupsView',
}
</script>

<style scoped>

</style>