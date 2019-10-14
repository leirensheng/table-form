<template>
  <div id="app">
    <v-table
      ref="table"
      noShowPagination
      :table-btns-config="tableBtnsConfig"
      :top-btns-config="topBtnsConfig"
      :columns="columns"
      :label-width="130"
      :get-data="getDataList"
      @queryChange="queryChange"
      @beforeQuery="beforeQuery"
      @delete="handleDelete"
      @beforeDialogOpen="beforeDialogOpen"
    >
      <div slot="file">
        <el-upload
          class="upload"
          ref="upload"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :http-request="uploadRequest"
          action=""
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >选取文件</el-button>
        </el-upload>
      </div>
    </v-table>
  </div>
</template>

<script>
import VTable from "./components/vTable.vue";

export default {
  name: "app",
  components: {
    VTable
  },
  methods: {
    queryChange(id, val, queryParams) {
      if (id === "code") {
        queryParams.version = "";
        if (val) {
          this.getVersion(val);
        } else {
          this.versionDisabled = true;
        }
      }
    },

    handleDelete({ code }) {
      this.$confirm("确定删除？").then(() => {
        this.$axios
          .delete(`/v1/scripts/${code}`)
          .then(({ success, message }) => {
            if (success) {
              this.$refs.table.search();
              this.$message.success("删除成功");
            } else {
              this.$message.error(message);
            }
          });
      });
    },

    beforeDialogOpen(
      {
        form: { fileName }
      },
      mode
    ) {
      if (mode == "edit") {
        this.uploadRequest = this.confirmEdit;
        this.fileList = [
          {
            name: fileName,
            url: ""
          }
        ];
      } else {
        this.uploadRequest = this.confirmAdd;
        this.fileList = [];
      }
    },

    handleExceed() {
      this.$message.warning(`只能选一个文件`);
    },

    getVersion(code) {
      this.$axios(`/v1/scripts/${code}/versions`)
        .then(({ payload, success }) => {
          if (success) {
            this.versions = payload.map(one => ({ name: one, id: one }));
            this.versionDisabled = false;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },

    confirmEdit(f) {
      this.handleConfirm(f, "edit");
    },

    confirmAdd(f) {
      this.handleConfirm(f, "add");
    },

    handleConfirm(f, mode) {
      let params = new FormData();
      params.append("file", f ? f.file : null);
      Object.keys(this.formData).forEach(key => {
        params.append(key, this.formData[key]);
      });
      let action =
        mode == "edit"
          ? this.$axios.put(`/v1/scripts/${this.formData.code}`, params)
          : this.$axios.post("/v1/scripts", params);
      action
        .then(res => {
          if (res.success) {
            this.$emit("uploadDone", res);
            this.$refs.upload.clearFiles();
          }
        })
        .catch(e => {
          this.$emit("uploadFail", e);
        });
    },

    beforeQuery({ version }) {
      this.getDataList = version ? this.list : this.getLatest;
    },

    list({ version, code }) {
      return this.$axios(`/v1/scripts/${code}/version/${version}`);
    },

    getLatest({ code }) {
      return this.$axios(`/v1/scripts/${code}/lastest`);
    },

    handleUpload(formData) {
      this.formData = formData;
      if (
        this.$refs.upload.uploadFiles.length &&
        this.$refs.upload.uploadFiles[0].size
      ) {
        this.$refs.upload.submit();
      } else {
        this.uploadRequest();
      }

      return new Promise((resolve, reject) => {
        this.$on("uploadDone", res => {
          resolve(res);
        });
        this.$on("uploadFail", e => {
          reject(e);
        });
      });
    }
  },
  data() {
    return {
      getDataList: this.getLatest,
      uploadRequest: this.confirmAdd,
      fileList: [],
      versionDisabled: true,
      versions: [],
      formData: {},
      tableBtnsConfig: [
        {
          name: "编辑",
          editConfig: {
            title: "修改",
            handler: this.handleUpload
          }
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
          name: "添加",
          btnType: { isPlain: true, type: "primary" },
          addConfig: {
            title: "添加",
            handler: this.handleUpload
          }
        }
      ]
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "id",
          queryType: "id",
          isShow: false,
          support: {
            add: {
              show: false
            },
            edit: {
              show: false
            }
          }
        },
        {
          name: "文件",
          queryType: "title",
          support: ["add", "edit"]
        },
        {
          name: "fileItem",
          queryType: "slot",
          slotName: "file",
          support: ["add", "edit"]
        },
        {
          name: "scriptAddDTO",
          queryType: "title",
          support: ["add", "edit"]
        },
        {
          name: "code",
          id: "code",
          support: ["add", "query"]
        },
        {
          name: "content",
          id: "content",
          support: ["add", "edit"]
        },
        {
          name: "description",
          id: "description",
          support: ["add", "edit"]
        },
        {
          name: "entryPoint",
          id: "entryPoint",

          support: ["add", "edit"]
        },
        {
          name: "name",
          id: "name",
          support: ["add", "edit"]
        },
        {
          name: "params",
          id: "params",
          support: ["add", "edit"]
        },
        {
          name: "paramsType",
          id: "paramsType",
          support: ["add", "edit"]
        },
        {
          name: "releaseNote",
          id: "releaseNote",
          support: ["add", "edit"]
        },
        {
          name: "type",
          id: "type",
          support: ["add"]
        },
        {
          name: "version",
          id: "version",
          queryType: "select",
          options: this.versions,
          support: {
            query: {
              disabled: this.versionDisabled
            },
            edit: {}
          }
        }
      ];
    }
  }
};
</script>

<style lang="scss">
#app {
  margin-top: 60px;
  .upload {
    margin-bottom: 15px;
  }
}
</style>
