<template>
  <v-dialog
    :show-btns="false"
    :inputs="data"
  >
    <div slot="tags">
      <el-tag
        closable
        @close="handleClose(one)"
        v-for="one in tags"
        :key="one.id"
      >{{one.name}}</el-tag>
    </div>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      data: {
        title: "删除tags",
        show: false,
        mode: "edit", // 编辑或者新增，
        form: {}, // 表单
        items: [
          {
            name: "标签",
            queryType: "slot",
            slotName: "tags",
            support: ["edit"]
          }
        ], // 字段
        confirmBtnLoading: false
      }
    };
  },
  props: {
    hostId: {
      required: true
    },
    tags: {}
  },
  methods: {
    handleClose(tag) {
      this.$confirm("确定删除？").then(() => {
        this.$axios
          .delete(`/v1/hosts/${this.hostId}/tags/${tag.id}`)
          .then(() => {
            this.tags.splice(this.tags.indexOf(tag), 1);
            this.data.show=false
            this.$emit('refreshHostTable')
          });
      });
    },
  }
};
</script>
