<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="ansible" name="first">
       <basic-table type="ansible"></basic-table>
    </el-tab-pane>
    <el-tab-pane label="ssh" name="second">
       <basic-table type="ssh"></basic-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
 import BasicTable from './table'
  export default {
    data() {
      return {
        activeName: 'second'
      };
    },
    components:{
      BasicTable
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>