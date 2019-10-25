<template>
  <v-dialog
    :labelWidth="100"
    :inputs="data"
    :show-btns="isShowDialogBtns"
    @add="executeAnsible"
    @dialogClose="closeExecuteAnsibleDialog"
  >
    <div
      slot="inventoryTxt"
      v-if="data.show"
    >
      <span>inventoryTxt：</span>
      <input
        ref="txtFile"
        type="file"
      >
    </div>
    <div
      v-if="data.show"
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
</template>

<script>
import ExecLines from "@/components/lines.vue";
import HostsTable from "@/page/host/components/hostsTable.vue";
export default {
  components: {
    HostsTable,
    ExecLines
  },
  data() {
    return {
      hostsTableData: [],
      execAnsibleResult: "",
      isShowDialogBtns: true,
      data: {
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
      }
    };
  },
  methods: {
    showAnsibleSynccResult() {
      let res = {
        cmd: "abcdefg",
        hosts: [{ group: 23, hostId: 5 }],
        lines: ["fdfsfaf", "tertnftg"]
      };
      let form = { ...res, lines: res.lines.join("\n"), excecuteType: "async" };
      this.data = {
        ...this.data,
        form,
        mode: "edit"
      };
      this.execAnsibleResult = form.lines;
      this.hostsTableData = form.hosts;
      this.isShowDialogBtns = false;
      this.data.show = true;
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
            this.execAnsibleResult = lines;
          })
          .finally(() => {
            this.data.confirmBtnLoading = false;
          });
      } else {
        this.$axios
          .post("/v1/hosts/exec/playbook/async", params)
          .then(() => {
            this.isShowDialogBtns = false;
            this.$message.warning("异步执行中");
            // todo:异步
            setTimeout(() => {
              this.showAnsibleSynccResult();
            }, 3000);
            this.data.show = false;
          })
          .finally(() => {
            this.data.confirmBtnLoading = false;
          });
      }
    }
  }
};
</script>
