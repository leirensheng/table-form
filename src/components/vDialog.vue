<template>
  <div>
    <el-dialog
      :title="inputs.title"
      :visible="inputs.show"
      :close-on-click-modal="false"
      :before-close="()=>inputs.show=false"
      :width="dailogWidth"
      center
      @close="close"
      @open="open"
    >
      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :size="formSize"
        :validate-on-rule-change="false"
        :label-width="labelWidth+'px'"
        :rules="formRules"
      >
        <div
          v-for="(one,index) in showItems"
          :key="index"
        >
          <el-form-item
            v-if="!['slot','title','underline'].includes(getItemType(one))"
            :prop="one.id"
            :label="getLabel(one)"
          >
            <!-- 文本 -->
            <span
              v-if="getItemType(one)=='text'"
              style="color:red"
            >
              {{ form[one.id] }}
            </span>
            <!--select-->
            <el-select
              v-else-if="getItemType(one)=='select'"
              v-model="form[one.id]"
              :placeholder="one.tips"
              clearable
              style="width: 100%"
              :disabled="isItemDisabled(one.support)"
              @change="(val)=>handleItemChange(one) "
            >
              <!-- todo: change -->
              <el-option
                v-for="(option,index1) in one.options.filter(one=>!one.noShow)"
                :key="index1"
                :label="one.sourceFormat?option[one.sourceFormat.label]: option.name"
                :value="one.sourceFormat?option[one.sourceFormat.value]:option.id"
              />
            </el-select>

            <el-radio-group
              v-else-if="getItemType(one)=='radio'"
              v-model="form[one.id]"
              :disabled="isItemDisabled(one.support)"
              @change="(val)=>handleItemChange(one) "
            >
              <el-radio
                v-for="(option,index1) in one.options.filter(one=>!one.noShow)"
                :key="index1"
                :label="one.sourceFormat?option[one.sourceFormat.value]:option.id"
              >
                {{ one.sourceFormat?option[one.sourceFormat.label]: option.name }}
              </el-radio>
            </el-radio-group>

            <!-- 下拉多选 -->
            <el-select
              v-else-if="getItemType(one)=='multipleSelect'"
              v-model="form[one.id]"
              clearable
              :placeholder="one.tips"
              multiple
              style="width: 100%"
              filterable
              :disabled="isItemDisabled(one.support)"
              @change="(val)=>handleItemChange(one) "
            >
              <el-option
                v-for="(option,index2) in one.options.filter(one=>!one.noShow)"
                :key="index2"
                :label="one.sourceFormat?option[one.sourceFormat.label]: option.name"
                :value="one.sourceFormat?option[one.sourceFormat.value]:option.id"
              />
            </el-select>
            <!-- textarea -->
            <el-input
              v-else-if="getItemType(one)=='textarea'"
              v-model="form[one.id]"
              type="textarea"
              :placeholder="one.tips"
              :disabled="isItemDisabled(one.support)"
              @change="(val)=>handleItemChange(one) "
            />
            <el-input
              v-else
              v-model="form[one.id]"
              :placeholder="one.tips"
              :disabled="isItemDisabled(one.support)"
              @change="(val)=>handleItemChange(one) "
            />
          </el-form-item>
          <div
            v-else-if="getItemType(one)=='title'"
            class="title"
          >
            <span class="line" />
            {{ one.name }}
          </div>
          <div
            v-else-if="getItemType(one)=='underline'"
            class="underline"
          />
          <slot
            v-else
            :form="form"
            :name="one.slotName"
          />
        </div>
        <el-form-item v-if="showBtns">
          <div style="float:right">
            <el-button
              size="medium"
              @click="inputs.show = false"
            >
              取 消
            </el-button>
            <el-button
              size="medium"
              type="primary"
              v-loading="inputs.confirmBtnLoading"
              @click="confirm"
            >
              确 定
            </el-button>
          </div>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    inputs: {
      type: Object,
      required: true
    },
    showBtns: {
      type: Boolean,
      default: () => true
    },
    // 表单字段名宽度，单位为px
    labelWidth: {
      type: Number,
      default: () => 90
    },

    dailogWidth: {
      type: String,
      default: () => "33%"
    },
    formSize: {
      type: String,
      default: () => "large"
    },
    // 修改的时候不传给后端的字段
    notSendColumns: {
      type: Array,
      default: () => [
        "updateUser",
        "updateTime",
        "password",
        "updatePassword",
        "createTime"
      ]
    },
    basicAddForm: {
      type: Object,
      default: () => {}
    },
    basicEditForm: {
      type: Object,
      default: () => {}
    },
    // 处理v-table 打开本弹窗时表单数据（异步的，同步的可以直接在vTable中的beforeAssignToDialog中处理）
    onDialogOpen: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      formRules: {},
      form: {},
      loading: false
    };
  },
  computed: {
    showItems() {
      return this.inputs.items.filter(one => {
        if (Array.isArray(one.support)) {
          return true;
        } else if (typeof one.support === "object") {
          let isShow = one.support[this.inputs.mode].show;
          return typeof isShow === "function"
            ? isShow(this.form)
            : [undefined, true].includes(isShow);
        }
      });
    }
  },

  methods: {
    close() {
      this.formRules = {};
      this.form = {};
      this.$refs.form.resetFields();
      this.$emit("dialogClose");
    },
    getItemType(config) {
      return (
        (config.support[this.inputs.mode] &&
          config.support[this.inputs.mode].type) ||
        config.queryType
      );
    },
    getLabel(config) {
      const label =
        (config.support[this.inputs.mode] &&
          config.support[this.inputs.mode].dialogName) ||
        config.name;
      return label + (config.queryType == "title" ? "" : "：");
    },

    isItemDisabled(support) {
      // support为数组时是基础配置，不支持设置disabled
      if (Array.isArray(support)) {
        return false;
      }
      if (typeof support[this.inputs.mode].disabled === "function") {
        return support[this.inputs.mode].disabled(this.form);
      }
      return support[this.inputs.mode].disabled;
    },
    handleItemChange(config) {
      // 只有support为对象的时候才支持事件抛出
      if (
        config.support[this.inputs.mode] &&
        config.support[this.inputs.mode].eventName
      ) {
        this.$emit(config.support[this.inputs.mode].eventName, {
          value: this.form[config.id],
          id: config.id,
          form: this.form,
          curConfig: config,
          allConfig: this.inputs.items
        });
      }
    },
    open() {
      this.initRule();
      if (this.inputs.mode === "edit") {
        let data =
          this.inputs.form && JSON.parse(JSON.stringify(this.inputs.form));
        if (this.onDialogOpen) {
          this.loading = true;
          this.onDialogOpen(data)
            .then(data => {
              this.initEditForm(data);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.initEditForm(data);
        }
      } else {
        this.inputs.items.forEach(one => {
          if (one.id) {
            this.$set(
              this.form,
              one.id,
              (one.support.add && one.support.add.defaultValue) || ""
            );
          }
        });
        if (this.basicAddForm) {
          this.form = { ...this.form, ...this.basicAddForm };
        }
      }
    },
    initEditForm(form) {
      this.form = form;
      this.notSendColumns.forEach(one => {
        if (!this.showItems.map(column => column.id).includes(one)) {
          delete this.form[one];
        }
      });

      if (this.basicEditForm) {
        this.form = { ...this.form, ...this.basicEditForm };
      }
    },
    // 初始化表单规则
    initRule() {
      this.inputs.items.forEach(one => {
        if (one.required) {
          this.$set(this.formRules, one.id, [
            { required: true, trigger: "blur", message: one.tips }
          ]);
          if (one.getValidator) {
            this.formRules[one.id].push({
              validator: one.getValidator(this),
              trigger: "blur"
            });
          }
        }
      });
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.inputs.confirmBtnLoading = true;
          if (this.inputs.mode == "edit") {
            this.$emit("edit", { ...this.form }, "修改");
          } else {
            this.$emit("add", { ...this.form }, "新增");
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  padding: 7px;
  color: #0d0d0d;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 15px;
  .line {
    border: 3px solid #2e82ff;
    margin-right: 13px;
    border-radius: 4px;
  }
}
.underline {
  // width: 100
  margin-bottom: 16px;
  border-bottom: 1px dotted #d6d6d6;
}
</style>
