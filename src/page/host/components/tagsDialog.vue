<template>
  <v-dialog
    :inputs="data"
    @add="handleAdd"
    @dialogClose="closeSecretDialog"
  >
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      publicKey: "",
      data: {
        title: "新增tags",
        show: false,
        mode: "add", // 编辑或者新增，
        form: {}, // 表单
        items: [
          {
            name: "标签",
            id: "name",
            required: true,
            support: ["add"]
          },
            {
            name: "类型",
            id: "type",
            required: true,
            support: ["add"]
          }
        ], // 字段
        confirmBtnLoading: false
      }
    };
  },
  props:{
    hostId:{
      required:true
    }
  },
  methods: {
    closeSecretDialog() {
      this.publicKey = "";
    },
    handleAdd(form) {
      this.$axios
        .post(`/v1/hosts/${form.id}/tags`, {...form,hostId:this.hostId})
        .then(() => {
           this.$emit('refreshHostTable')
           this.data.show=false
        })
        .finally(() => {
          this.data.confirmBtnLoading = false;
        });
    }
  }
};
</script>
