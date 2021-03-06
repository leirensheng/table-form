<template>
  <div id="host">
    <v-table
      ref="hostTable"
      responseTableField='rows'
      noShowPagination
      :table-btns-config="tableBtnsConfig"
      :top-btns-config="topBtnsConfig"
      :columns="columns"
      :label-width="130"
      :get-data="getDataList"
      :onDialogOpen="onDialogOpen"
      :last-column-width="230"
      @delete="handleDelete"
      @openExecuteDialog="openExecuteDialog"
      @addSecret="openSecretDialog"
      @execAnsible="openExecAnsibleDialog"
      @openAccountDialog="openAccountDialog"
      @openNetworkDialog="openNetworkDialog"
      @addTags="addTags"
      @deleteTags="deleteTags"
    />
    <!-- 生成秘钥 -->
    <secrect-dialog ref="secrectDialog" />
    <!-- 执行 -->
    <ExecAnsibleDialog ref="execAnsibleDialog" />

    <execute-dialog
      :id="curHostId"
      ref="executeDialog"
    />
    <!-- 账户信息 -->
    <account-dialog
      :hostId="curHostId"
      ref="accountDialog"
    />
    <!-- 网络信息 -->
    <network-dialog
      :hostId="curHostId"
      ref="networkDialog"
    />

    <tags-dialog
      ref="tagsDialog"
      :hostId="curHostId"
      @refreshHostTable="refreshHostTable"
    />

    <delete-tags-dialog
      ref="deleteTagsDialog"
      :hostId="curHostId"
      :tags="curTags"
      @refreshHostTable="refreshHostTable"
    />
  </div>
</template>

<script>
import ExecAnsibleDialog from "./components/execAnsibleDialog";
import ExecuteDialog from "./components/executeDialog";
import SecrectDialog from "./components/secrectDialog";
import AccountDialog from "./components/accountDialog";
import NetworkDialog from "./components/networkDialog";
import TagsDialog from "./components/tagsDialog";
import DeleteTagsDialog from "./components/deleteTagsDialog";

import { formatDate } from "../../../utils";
export default {
  name: "host",
  components: {
    ExecuteDialog,
    SecrectDialog,
    ExecAnsibleDialog,
    AccountDialog,
    NetworkDialog,
    TagsDialog,
    DeleteTagsDialog
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
    refreshHostTable() {
      this.$refs.hostTable.search();
    },
    addTags({ id }) {
      this.curHostId = id;
      this.$refs.tagsDialog.data.show = true;
    },
    deleteTags({ id, tags }) {
      this.curHostId = id;
      this.curTags = JSON.parse(JSON.stringify(tags));
      this.$refs.deleteTagsDialog.data.show = true;
    },
    modifyHost(form) {
      return this.$axios.put(`v1/hosts/${form.id}`, {
        name: form.name,
        remark: form.remark
      });
    },
    openExecAnsibleDialog() {
      this.$refs.execAnsibleDialog.data.show = true;
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
      this.curHostId = id;
      this.$refs.executeDialog.data.show = true;
    },
    openAccountDialog({ id }) {
      this.curHostId = id;
      this.$refs.accountDialog.data.show = true;
    },
    openNetworkDialog({ id }) {
      this.curHostId = id;
      this.$refs.networkDialog.data.show = true;
    },

    getDataList() {
      return this.$axios.get("v1/hosts");
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
      return this.$axios.get(`/v1/hosts/${id}`).then(res => res.payload);
    }
  },
  data() {
    return {
      curTags: [],
      curHostId: "",
      formData: {},
      mode: "add",
      tableBtnsConfig: [
        {
          name: "详情/修改",
          editConfig: {
            title: "详情/修改",
            handler: this.modifyHost
          }
        },
        {
          name: "账户信息",
          eventName: "openAccountDialog"
        },
        {
          name: "网络信息",
          eventName: "openNetworkDialog"
        },
        {
          name: "执行命令",
          eventName: "openExecuteDialog"
        },
        {
          name: "添加标签",
          btnType: { isPlain: false, type: "warning" },
          eventName: "addTags"
        },
        {
          name: "删除标签",
          btnType: { isPlain: false, type: "warning" },
          eventName: "deleteTags"
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
          support: ["add", "edit"]
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
          name: "标签",
          id: "tags",
          formatter: obj => obj.name
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
          support: ["add", "edit"]
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
          formatter: val => formatDate("yyyy-MM-dd hh:mm:ss", new Date(val)),
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
          formatter: val => formatDate("yyyy-MM-dd hh:mm:ss", new Date(val)),
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
