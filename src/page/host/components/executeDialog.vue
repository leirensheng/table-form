<template>
  <v-dialog
    :labelWidth="100"
    :inputs="data"
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
</template>

<script>
import ExecLines from "@/components/lines.vue";
export default {
  data() {
    return {
      isShowDialogBtns: true,
      executeResult: "",
      data: {
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
      }
    };
  },
  components:{
    ExecLines,
  },
  methods: {
    closeExecuteDialog() {
      this.isShowDialogBtns = true;
      this.executeResult = "";
    },

    showAsyncResult() {
      let res = {
        cmd: "abcdefg",
        lines: ["fdfsfaf", "tertnftg"]
      };
      let form = { ...res, lines: res.lines.join("\n"), excecuteType: "async" };
      this.data = { ...this.data, form, mode: "edit" };
      this.executeResult = form.lines;
      this.isShowDialogBtns = false;
      this.data.show = true;
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
            this.data.confirmBtnLoading = false;
          });
      } else {
        this.$axios
          .post(`/v1/hosts/${id}/exec/async`)
          .then(() => {
            this.data.show = false;
            this.$message.info("异步执行中。。。");
            setTimeout(() => {
              this.showAsyncResult();
            }, 3000);
          })
          .finally(() => {
            this.data.confirmBtnLoading = false;
          });
      }
    }
  }
};
</script>


