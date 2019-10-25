<template>
  <div id="host">
    <v-table
      responseTableField='rows'
      noShowPagination
      :table-btns-config="tableBtnsConfig"
      :top-btns-config="topBtnsConfig"
      :columns="columns"
      :label-width="130"
      :get-data="getDataList"
      :onDialogOpen="onDialogOpen"
      :show-btns="false"
      @delete="handleDelete"
      @openExecuteDialog="openExecuteDialog"
      @addSecret="openSecretDialog"
      @execAnsible="openExecAnsibleDialog"
    >
      <div
        slot="accounts"
        style="margin-top:-20px; margin-bottom:12px"
      >
        <v-table
          :noShowSearchBtn="true"
          :columns="accountsColumns"
          :directTableData="accountsData"
          noShowPagination
        ></v-table>
      </div>
      <div
        slot="networks"
        style="margin-top:-20px;"
      >
        <v-table
          :noShowSearchBtn="true"
          :columns="networksColumns"
          :directTableData="networksData"
          noShowPagination
        ></v-table>
      </div>
    </v-table>
    <!-- 生成秘钥 -->
    <secrect-dialog ref="secrectDialog"/>
    
    <v-dialog
      :labelWidth="100"
      :inputs="executeDialog"
      :show-btns="isShowDialogBtns"
      @add="execute"
      @dialogClose="closeExecuteDialog"
    >
      <div
        slot="executeResult"
        v-if="executeResult"
      >
        <exec-lines
          :title="'执行结果'"
          :executeResult="executeResult"
        ></exec-lines>
      </div>
    </v-dialog>

    <v-dialog
      :labelWidth="100"
      :inputs="execAnsibleDialog"
      :show-btns="isShowDialogBtns"
      @add="executeAnsible"
      @dialogClose="closeExecuteAnsibleDialog"
    >
      <div
        slot="inventoryTxt"
        v-if="execAnsibleDialog.show"
      >
        <span>inventoryTxt：</span>
        <input
          ref="txtFile"
          type="file"
        >
      </div>
      <div
        v-if="execAnsibleDialog.show"
        slot="playbookZip"
        style="margin-top:16px"
      >
        <span>playbookZip：</span>
        <input
          ref="zipFile"
          type="file"
        >
      </div>

      <exec-lines
        v-if="execAnsibleResult"
        slot="lines"
        :executeResult="execAnsibleResult"
      ></exec-lines>
      <div
        v-if="execAnsibleResult"
        slot="hosts"
        style="margin-top:-16px;"
      >
        <hosts-table :data="hostsTableData"></hosts-table>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import ExecLines from "@/components/lines.vue";
import HostsTable from "@/page/host/components/hostsTable.vue";
import SecrectDialog from './components/secrectDialog'
export default {
  name: "host",
  components: {
    ExecLines,
    HostsTable,
    SecrectDialog
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    onmessage: function(data) {
      console.log("socket connected", data);
    },
    messages: function(data) {
      console.log(data);
    }
  },
  mounted() {
    this.$socket.emit("join", "wahh");
  },
  methods: {
    openExecAnsibleDialog() {
      this.execAnsibleDialog.show = true;
    },
    closeExecuteAnsibleDialog() {
      this.execAnsibleResult = "";
      this.hostsTableData = [];
      this.isShowDialogBtns = true;
    },
    executeAnsible(form) {
      let params = new FormData();
      params.append("inventoryTxt", this.$refs.txtFile.files[0]);
      params.append("playbookZip", this.$refs.zipFile.files[0]);
      Object.keys(form).forEach(key => {
        params.append(key, form[key]);
      });
      if (form.excecuteType === "sync") {
        this.$axios
          .post("/v1/hosts/exec/playbook", params)
          .then(res => {
            let { lines, hosts } = res;
            this.isShowDialogBtns = false;
            this.hostsTableData = hosts;
            this.execAnsibleResult = lines.join("\n");
          })
          .finally(() => {
            this.execAnsibleDialog.confirmBtnLoading = false;
          });
      } else {
        this.$axios
          .post("/v1/hosts/exec/playbook/async", params)
          .then(() => {
            this.isShowDialogBtns = false;
            this.$message.warning("异步执行中");
            setTimeout(() => {
              this.showAnsibleSynccResult();
            }, 3000);
            this.execAnsibleDialog.show = false;
          })
          .finally(() => {
            this.execAnsibleDialog.confirmBtnLoading = false;
          });
      }
    },
    handleZipChange(f) {
      console.log(f);
    },
    getAccoutData(val) {
      return Promise.resolve({
        payload: val
      });
    },
    openSecretDialog() {
      this.$refs.secrectDialog.data.show = true;
    },
    openExecuteDialog({ id }) {
      this.executeDialog.form.id = id;
      this.executeDialog.show = true;
    },
    execute(form) {
      let { excecuteType, cmd, id } = form;
      if (excecuteType === "sync") {
        this.$axios
          .post(`/v1/hosts/${id}/exec`, { cmd })
          .then(res => {
            this.isShowDialogBtns = false;
            this.executeResult = res.lines.join("\n");
            // this.$resu
          })
          .finally(() => {
            this.executeDialog.confirmBtnLoading = false;
          });
      } else {
        this.$axios
          .post(`/v1/hosts/${id}/exec/async`)
          .then(() => {
            this.executeDialog.show = false;
            this.$message.info("异步执行中。。。");
            setTimeout(() => {
              this.showAsyncResult();
            }, 3000);
          })
          .finally(() => {
            this.executeDialog.confirmBtnLoading = false;
          });
      }
    },
    showAnsibleSynccResult() {
      let res = {
        cmd: "abcdefg",
        hosts: [{ group: 23, hostId: 5 }],
        lines: ["fdfsfaf", "tertnftg"]
      };
      let form = { ...res, lines: res.lines.join("\n"), excecuteType: "async" };
      this.execAnsibleDialog = {
        ...this.execAnsibleDialog,
        form,
        mode: "edit"
      };
      this.execAnsibleResult = form.lines;
      this.hostsTableData = form.hosts;
      this.isShowDialogBtns = false;
      this.execAnsibleDialog.show = true;
    },
    showAsyncResult() {
      let res = {
        cmd: "abcdefg",
        lines: ["fdfsfaf", "tertnftg"]
      };
      let form = { ...res, lines: res.lines.join("\n"), excecuteType: "async" };
      this.executeDialog = { ...this.executeDialog, form, mode: "edit" };
      this.executeResult = form.lines;
      this.isShowDialogBtns = false;
      this.executeDialog.show = true;
    },

    getDataList() {
      return this.$axios.get("v1/hosts");
    },
    closeExecuteDialog() {
      this.isShowDialogBtns = true;
      this.executeResult = "";
    },

    handleAdd(form) {
      if (form.connectionType === "SSH_TUNNELS") {
        form.sshTunnels = {
          jumpHostId: form.jumpHostId,
          networkId: form.networkId
        };
        delete form.jumpHostId;
        delete form.networkId;
      }
      return this.$axios.post("/v1/hosts", form);
    },
    handleDelete({ id }) {
      this.$confirm("确定删除？").then(() => {
        this.$axios.delete(`/v1/hosts/${id}`).then(({ success, message }) => {
          if (success) {
            this.$refs.table.search();
            this.$message.success("删除成功");
          } else {
            this.$message.error(message);
          }
        });
      });
    },

    onDialogOpen({ id }) {
      this.accountsData = [];
      this.networksData = [];
      return this.$axios.get(`/v1/hosts/${id}`).then(res => {
        let { payload } = res;
        let { networks, accounts } = payload;
        this.accountsData = accounts;
        this.networksData = networks;
        return payload;
      });
    }
  },
  data() {
    return {
      hostsTableData: [],
      execAnsibleResult: "",
      execAnsibleDialog: {
        title: "执行Ansible剧本",
        show: false,
        mode: "add", // 编辑或者新增，
        form: {}, // 表单
        items: [
          {
            name: "参数",
            queryType: "textarea",
            id: "args",
            support: ["add", "edit"]
          },
          {
            queryType: "slot",
            slotName: "inventoryTxt",
            support: ["add"]
          },
          {
            queryType: "slot",
            slotName: "playbookZip",
            support: ["add"]
          },
          {
            name: "执行方式",
            id: "excecuteType",
            options: [
              { name: "同步", id: "sync" },
              { name: "异步", id: "async" }
            ],
            support: {
              add: {
                type: "radio",
                defaultValue: "sync"
              },
              edit: {
                type: "radio",
                defaultValue: "sync"
              }
            }
          },
          {
            queryType: "slot",
            slotName: "lines",
            support: ["add", "edit"]
          },
          {
            queryType: "slot",
            slotName: "hosts",
            support: ["add", "edit"]
          }
        ], // 字段
        confirmBtnLoading: false
      },
      networksColumns: [
        { name: "connectionExt", id: "connectionExt" },
        { name: "连接方式", id: "connectionType" },
        { name: "主机id", id: "hostId" },
        { name: "ip地址", id: "ipAddr" },
        { name: "mac地址", id: "macAddr" },
        { name: "primary", id: "primary" },
        { name: "remark", id: "remark" }
      ],
      networksData: [],
      accountsColumns: [
        { name: "用户名", id: "username" },
        { name: "登陆方式", id: "loginType" },
        { name: "primary", id: "primary" },
        { name: "publicKey", id: "publicKey" }
      ],
      accountsData: [],
      executeResult: "",
      executeDialog: {
        title: "执行命令",
        show: false,
        mode: "add", // 编辑或者新增，
        form: {}, // 表单
        items: [
          {
            name: "命令",
            id: "cmd",
            required: true,
            support: {
              add: {
                type: "textarea"
              },
              edit: {
                type: "textarea"
              }
            }
          },
          {
            name: "执行方式",
            id: "excecuteType",
            required: true,
            support: {
              add: {
                type: "radio",
                defaultValue: "sync"
              },
              edit: {
                type: "radio"
              }
            },
            options: [
              {
                name: "同步",
                id: "sync"
              },
              {
                name: "异步",
                id: "async"
              }
            ]
          },
          {
            name: "执行结果",
            queryType: "slot",
            support: ["add", "edit"],
            slotName: "executeResult"
          }
        ], // 字段
        loading: false,
        confirmBtnLoading: false
      },
      isShowDialogBtns: "",
      formData: {},
      mode: "add",
      tableBtnsConfig: [
        {
          name: "详情",
          editConfig: {
            title: "详情",
            handler: formData => this.handleUpload(formData, "edit")
          }
        },
        {
          name: "执行命令",
          eventName: "openExecuteDialog"
        },
        {
          name: "删除",
          btnType: {
            type: "danger"
          },
          eventName: "delete"
        }
      ],
      topBtnsConfig: [
        {
          name: "添加主机",
          btnType: { isPlain: true, type: "primary" },
          addConfig: {
            title: "添加",
            handler: this.handleAdd
          }
        },
        {
          name: "添加秘钥",
          btnType: { isPlain: false, type: "warning" },
          eventName: "addSecret"
        },
        {
          name: "执行Ansible剧本",
          btnType: { isPlain: true, type: "success" },
          eventName: "execAnsible"
        }
      ]
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "主机名称",
          id: "name",
          required: true,
          support: {
            add: {},
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "主机id",
          id: "id",
          isShow: false,
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "ip地址",
          id: "ipAddr",
          required: true,
          isShow: false,
          support: ["add"]
        },
        {
          name: "ssh端口",
          required: true,
          id: "sshPort",
          support: {
            add: {},
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "备注",
          id: "remark",
          support: {
            add: {},
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "网络标识",
          id: "networkRemark",
          isShow: false,
          support: ["add"]
        },

        {
          name: "登陆类型",
          required: true,
          id: "loginType",
          isShow: false,
          options: [
            { id: "SECRET_KEY", name: "秘钥" },
            { id: "PASSWORD", name: "密码" }
          ],
          support: {
            add: {
              type: "radio",
              defaultValue: "PASSWORD"
            }
          }
        },
        {
          name: "用户名",
          id: "username",
          required: true,
          isShow: false,
          support: ["add"]
        },
        {
          name: "秘钥",
          id: "secretKeyId",
          required: true,
          isShow: false,
          support: {
            add: {
              show: row => row.loginType === "SECRET_KEY"
            }
          }
        },
        {
          name: "密码",
          id: "password",
          required: true,
          isShow: false,
          support: {
            add: {
              show: row => row.loginType === "PASSWORD"
            }
          }
        },

        {
          name: "连接类型",
          id: "connectionType",
          required: true,
          isShow: false,
          support: {
            add: {
              type: "radio",
              defaultValue: "DIRECT"
            }
          },
          options: [
            { id: "DIRECT", name: "直连" },
            { id: "SSH_TUNNELS", name: "SSH通道" }
          ]
        },
        {
          name: "sshTunnels",
          isShow: false,
          queryType: "title",
          support: {
            add: {
              show: row => row.connectionType === "SSH_TUNNELS"
            }
          }
        },
        {
          name: "跳板机id",
          id: "jumpHostId",
          isShow: false,
          required: true,
          support: {
            add: {
              show: row => row.connectionType === "SSH_TUNNELS"
            }
          }
        },
        {
          name: "网络id",
          id: "networkId",
          required: true,
          isShow: false,
          support: {
            add: {
              show: row => row.connectionType === "SSH_TUNNELS"
            }
          }
        },
        {
          name: "创建时间",
          id: "createdAt",
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "创建人",
          id: "createdBy",
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "更新时间",
          id: "updatedAt",
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "更新人",
          id: "updatedBy",
          support: {
            edit: {
              type: "text"
            }
          }
        },
        {
          name: "账户信息",
          queryType: "title",
          support: ["edit"]
        },
        {
          queryType: "slot",
          slotName: "accounts",
          support: ["edit"]
        },
        {
          name: "网络信息",
          queryType: "title",
          support: ["edit"]
        },
        {
          queryType: "slot",
          slotName: "networks",
          support: ["edit"]
        }
      ];
    }
  }
};
</script>

<style lang="scss">
// #host {
// }
</style>
