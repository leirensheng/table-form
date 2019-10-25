<template>
  <v-table
    :noShowSearchBtn="true"
    :columns="hostsColumns"
    :directTableData="data"
    noShowPagination
  ></v-table>
</template>

<script>
export default {
  data() {
    return {
      hostsColumns: [
        {
          name: "组",
          id: "group"
        },
        {
          name: "主机id",
          id: "hostId"
        }
      ]
    };
  },
  props:{
    data:{
      type:Array,
      default:()=>[]
    }
  }
};
</script>

