<template>
  <v-dialog
    :labelWidth="100"
    :inputs="data"
    :onDialogOpen="onDialogOpen"
    :show-btns="false"
  >
    <v-table
      slot="table"
      :noShowSearchBtn="true"
      :columns="columns"
      :directTableData="tableData"
      :table-btns-config="tableBtnsConfig"
      noShowPagination
      :is-append-to-body="true"
      @refeshTableData="refeshTableData"
    ></v-table>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      data: {
        title: "",
        show: false,
        mode: "edit",
        form: {},
        items: [
          {
            name: "网络信息",
            queryType: "title",
            support: ["edit"]
          },
          {
            name: "表格",
            queryType: "slot",
            support: ["edit"],
            slotName: "table"
          }
        ], // 字段
        loading: false,
        confirmBtnLoading: false
      },
      tableData: [],
      columns: [
        { name: "connectionExt", id: "connectionExt" },
        {
          name: "连接方式",
          id: "connectionType",
          support: {
            edit: {
              type: "radio"
            }
          },
          options: [
            { id: "DIRECT", name: "直连" },
            { id: "SSH_TUNNELS", name: "SSH通道" }
          ]
        },
        {
          name: "主机id",
          id: "hostId",
          support: {
            edit: {
              show: false
            }
          }
        },
        { name: "网络id", id: "id", support: ["edit"] },
        { name: "ip地址", id: "ipAddr" },
        { name: "mac地址", id: "macAddr" },
        { name: "primary", id: "primary" },
        { name: "remark", id: "remark", support: ["edit"] },
        {
          name: "jumpHostId",
          id: "jumpHostId",
          support: {
            edit: {
              show: row => row.connectionType === "SSH_TUNNELS"
            }
          }
        }
      ],
      tableBtnsConfig: [
        {
          name: "修改",
          editConfig: {
            title: "网络信息修改",
            handler: this.save
          }
        }
      ]
    };
  },
  props: {
    hostId: {
      default: () => ""
    }
  },
  methods: {
    onDialogOpen() {
      this.tableData = [];
      return this.refeshTableData();
    },
    save(form) {
      let params = {
        connectionType: form.connectionType,
        sshTunnels: {
          jumpHostId: form.connectionType==='SSH_TUNNELS'?form.jumpHostId:'',
          networkId: form.id
        },
        remark: form.remark
      };
      return this.$axios.put(`/v1/hosts/${this.hostId}/networks`, params);
    },
    refeshTableData() {
      return this.$axios.get(`/v1/hosts/${this.hostId}`).then(res => {
        let { payload } = res;
        let { networks } = payload;
        this.tableData = networks;
        return payload;
      });
    }
  }
};
</script>
