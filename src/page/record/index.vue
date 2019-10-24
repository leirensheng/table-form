<template>
  <div id="record">
    <v-table
      ref="table"
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
        <v-table
          :noShowSearchBtn="true"
          :columns="hostsColumns"
          :directTableData="hostsTableData"
          noShowPagination
        ></v-table>
      </div>
    </v-table>
  </div>
</template>

<script>
import ExecLines from "@/components/lines.vue";
export default {
  name: "record",
  components: {
    ExecLines
  },
  data() {
    return {
      hostsTableData: [],
      executeResult: "",
      hostsColumns: [
        {
          name: "组",
          id: "group"
        },
        {
          name: "主机id",
          id: "hostId"
        }
      ],
      columns: [
        {
          name: "name",
          id: "name"
        },
        {
          name: "execId",
          id: "id",
          isShow: false
        },
        {
          name: "命令",
          id: "cmd",
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "类型",
          id: "type"
        },
        {
          name: "是否成功",
          id: "success",
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "groupname",
          id: "groupname"
        },
        {
          name: "hostId",
          id: "hostId"
        },
        {
          name: "exitStatus",
          id: "exitStatus",
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "errMsg",
          id: "errMsg",
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "执行记录",
          queryType: "title",
          support: {
            edit: {}
          }
        },
        {
          name: "执行记录",
          queryType: "slot",
          slotName: "execLines",
          support: {
            edit: {}
          }
        },
        {
          name: "主机信息",
          queryType: "title",
          support: {
            edit: {
              show: row => row.type !== "ssh"
            }
          }
        },
        {
          name: "主机信息",
          queryType: "slot",
          slotName: "hosts",
          support: {
            edit: {
              show: row => row.type !== "ssh"
            }
          }
        }
      ],
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

  methods: {
    onDialogOpen({ id, hostId, type }) {
      this.executeResult = "";
      this.hosts = "";
      let path =
        type === "ssh"
          ? `/v1/hosts/${hostId}/exec/${id}`
          : `/v1/hosts/exec/ansible/${id}`;

      return this.$axios.get(path).then(res => {
        let { payload } = res;
        let { lines, hosts } = payload;
        this.executeResult = lines.join("\n");
        this.hostsTableData = hosts;
        return payload;
      });
    },

    getList() {
      return this.$axios.get("v1/records");
    }
  }
};
</script>

<style>
</style>template