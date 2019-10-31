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
      :columns="accountsColumns"
      :directTableData="accountsData"
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
            name: "账户信息",
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
      accountsData: [],
      accountsColumns: [
        {
          name: "id",
          id: "id",
          isShow: false,
          support: {
            edit: {
              show: false
            }
          }
        },
        { name: "用户名", id: "username", support: ["edit"] },
        {
          name: "登陆方式",
          id: "loginType",
          support: ["edit"],
          queryType: "radio",
          options: [
            { id: "SECRET_KEY", name: "秘钥" },
            { id: "PASSWORD", name: "密码" }
          ]
        },

        {
          name: "密码",
          id: "password",
          support: ["edit"]
        },
        {
          name: "secretKeyId",
          id: "secretKeyId",
          support: ["edit"]
        },

        { name: "primary", id: "primary" },
        { name: "publicKey", id: "publicKey" }
      ],
      tableBtnsConfig: [
        {
          name: "修改",
          editConfig: {
            title: "修改",
            handler: this.saveAccount
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
      this.accountsData = [];
      return this.refeshTableData();
    },
    saveAccount(form) {
      return this.$axios.put(`/v1/hosts/${form.id}/accounts`, form);
    },
    refeshTableData() {
      return this.$axios.get(`/v1/hosts/${this.hostId}`).then(res => {
        let { payload } = res;
        let { accounts } = payload;
        this.accountsData = accounts;
        return payload;
      });
    }
  }
};
</script>