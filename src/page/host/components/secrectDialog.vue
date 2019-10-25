<template>
  <v-dialog
    :show-btns="isShowDialogBtns"
    :inputs="data"
    @add="handleAddSecret"
    @dialogClose="closeSecretDialog"
  >
    <el-alert
      v-show="publicKey"
      style="margin-bottom:8px"
      slot="result"
      :title="publicKey"
      type="success"
      effect="dark"
    >
    </el-alert>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      publicKey:'',
      isShowDialogBtns: true,
      data: {
        title: "生成RSA密钥",
        show: false,
        mode: "add", // 编辑或者新增，
        form: {}, // 表单
        items: [
          {
            name: "描述",
            id: "comment",
            required: true,
            support: ["add"]
          },
          {
            name: "口令",
            id: "passphrase",
            required: true,
            support: ["add"]
          },
          {
            name: "结果",
            support: ["add"],
            queryType: "slot",
            slotName: "result"
          }
        ], // 字段
        confirmBtnLoading: false
      }
    };
  },
  methods: {
    closeSecretDialog() {
      this.isShowDialogBtns = true;
      this.publicKey = "";
    },
    handleAddSecret(form) {
      this.$axios
        .post("/v1/secret-key/rsa", form)
        .then(({ publicKey, id }) => {
          this.publicKey = `生成的公钥：${publicKey}，id：${id}`;
          this.isShowDialogBtns = false;
        })
        .finally(() => {
          this.data.confirmBtnLoading = false;
        });
    }
  }
};
</script>
