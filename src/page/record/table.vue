<template>
  <div id="record">
    <v-table
      noShowPagination
      responseTableField='rows'
      :table-btns-config="tableBtnsConfig"
      :columns="columns"
      :get-data="getList"
      :onDialogOpen="onDialogOpen"
      :show-btns="false"
    >
      <div slot="execLines">
        <exec-lines :executeResult="executeResult"></exec-lines>
      </div>
      <div
        slot="hosts"
        style="margin-top:-16px;"
      >
        <hosts-table :data="hostsTableData"></hosts-table>
      </div>
    </v-table>
  </div>
</template>

<script>
import ExecLines from "@/components/lines.vue";
import HostsTable from "@/page/host/components/hostsTable.vue";
import columns from "./columns.js";
export default {
  name: "record",
  components: {
    ExecLines,
    HostsTable
  },
  props:{
     type:{
       type:String,
       required:true,
     }
  },
  data() {
    return {
      hostsTableData: [],
      executeResult: "",
      columns,
      tableBtnsConfig: [
        {
          name: "执行记录",
          show: row => row.type !== "ansible",
          editConfig: {
            title: "执行记录"
          }
        }
      ]
    };
  },
   computed:{
    getList(){
      return this.type!=='ssh'? this.getAnsibleList:this.getSshList
    }
   },
  methods: {
    onDialogOpen({ id, hostId, type }) {
      this.executeResult = "";
      this.hostsTableData = [];
      let path =
        type === "ssh"
          ? `/v1/hosts/${hostId}/exec/${id}`
          : `/v1/hosts/${hostId}/exec/ansible/${id}`;

      return this.$axios.get(path).then(res => {
        let { payload } = res;
        let { lines, hosts } = payload;
        this.executeResult = lines;
        this.hostsTableData = hosts;
        return payload;
      });
    },
    getAnsibleList() {
      return this.$axios.get("v1/hosts/exec/ansible");
    },
    getSshList() {
      return this.$axios.get("v1/hosts/exec/ssh");
    }
  }
};
</script>