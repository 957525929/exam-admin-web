<template>
  <div>
    <a-form-model :layout="formLayout || 'horizontal'" ref="formRef" :model="value">
      <a-form-model-item
        v-for="item in form_item"
        :key="item.name"
        :prop="item.name"
        :label="item.label"
        :rules="item.rules"
        :label-col="item.display ? null : labelCol"
        :wrapper-col="item.display ? null : wrapperCol"
      >
        <!--Input-->
        <a-input
          v-if="item.type === 'input'"
          :placeholder="item.placeholder || `${type_msg[item.type]}${item.label}`"
          :readOnly="item.readOnly"
          v-model="value[item.name]"
        ></a-input>
        <div v-if="item.type === 'inputNumber'">
          <a-input-number
            :placeholder="`${type_msg[item.type]}${item.label}`"
            :min="item.min || 1"
            :max="item.max || 50"
            :readOnly="item.readOnly"
            v-model="value[item.name]"
            :style="item.style"
          />
          <span style="margin-left: 5px" v-if="item.unit">{{ item.unit }}</span>
        </div>
        <a-textarea
          v-if="item.type === 'textarea'"
          :placeholder="`${type_msg[item.type]}${item.label}`"
          :rows="item.rows"
          :readOnly="item.readOnly"
          v-model="value[item.name]"
        ></a-textarea>
        <a-checkbox-group
          v-if="item.type === 'checkbox'"
          :readOnly="item.readOnly"
          v-model="value[item.name]"
          :options="item.options"
        >
        </a-checkbox-group>
        <a-radio-group
          v-if="item.type === 'radio'"
          v-model="value[item.name]"
          :options="item.options"
          :readOnly="item.readOnly"
        >
        </a-radio-group>

        <a-select
          v-if="item.type === 'select'"
          v-model="value[item.name]"
          :placeholder="`${type_msg[item.type]}${item.label}`"
          :readOnly="item.readOnly"
          :style="item.style"
          :mode="item.mode"
          :disabled="item.disabled"
          @change="item.change && item.change()"
        >
          <a-select-option v-for="x in item.option" :key="x.value">
            {{ x.label }}
          </a-select-option>
        </a-select>
        <div v-if="item.type === 'selectandinput'">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-select
                v-model="value[item.name]"
                :placeholder="`${type_msg[item.type]}${item.label}`"
                :readOnly="item.readOnly"
                :style="item.style"
              >
                <a-select-option v-for="x in item.option" :key="x.value">
                  {{ x.label }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="12">
              <a-input
                :placeholder="`${type_msg[item.typeEdition]}${item.labelEdition}`"
                :readOnly="item.readOnly"
                v-model="value[item.nameEdition]"
              ></a-input>
            </a-col>
          </a-row>
        </div>
        <a-select
          v-if="item.type === 'inputselect'"
          showSearch
          :autoClearSearchValue="false"
          :not-found-content="null"
          @search="item.change && item.change"
          @blur="item.blur && item.blur()"
          @change="item.change && item.change()"
          @select="item.select && item.select()"
          :filter-option="filterOption"
          v-model="value[item.name]"
          :placeholder="`${type_msg[item.type]}${item.label}`"
          :readOnly="item.readOnly"
          :style="item.style"
          :mode="item.mode"
        >
          <a-select-option v-for="x in item.option" :key="x.value">
            {{ x.label }}
          </a-select-option>
        </a-select>
        <a-cascader
          v-if="item.type === 'cascader'"
          change-on-select
          :options="item.options"
          :placeholder="`${type_msg[item.type]}${item.label}`"
          v-model="value[item.name]"
          :display-render="displayRender"
          :readOnly="item.readOnly"
        />
        <div v-if="item.type === 'picker'">
          <a-date-picker
            :format="item.format"
            :placeholder="`${type_msg[item.type]}${item.startTimeLabel}`"
            v-model="value[item.startTime]"
            :readOnly="item.readOnly"
          />
          ~
          <a-date-picker
            :format="item.format"
            :placeholder="`${type_msg[item.type]}${item.endTimeLabel}`"
            v-model="value[item.endTime]"
            :readOnly="item.readOnly"
          />
        </div>
        <div v-if="item.type === 'rangePicker'">
          <a-range-picker :format="item.format" v-model="value[item.name]" :readOnly="item.readOnly" />
        </div>
        <slot v-if="item.type === 'slot'" class="slotName" :name="item.slotName" />
        <!-- {{item.options}} -->
      </a-form-model-item>
      <slot name="footer" />
    </a-form-model>
    <!--按钮-->
    <div style="float: right; margin-bottom: 5px">
      <span v-for="item in formHandler" :key="item.key">
        <slot v-if="item.type === 'slot'" class="slotName" :name="item.slotName"></slot>
        <a-button
          v-else
          :loading="item.loading"
          :type="item.type"
          @click="item.handler && item.handler()"
          style="margin-right: 10px"
          >{{ item.label }}</a-button
        >
      </span>
      <!-- <a-button @click="resetForm">导入</a-button> -->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    form_item: {
      type: Array,
      default: () => [],
    },
    //按钮
    formHandler: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => {},
    },
    labelCol: {
      type: Object,
      default: () => {},
    },
    wrapperCol: {
      type: Object,
      default: () => {},
    },
    formLayout: {
      type: String,
      default: () => 'horizontal',
    },
  },
  // props: ['formItem', 'formHandler', 'value', 'labelCol', 'wrapperCol', 'formLayout'],
  data() {
    return {
      moment,
      //是否存在必填规则
      type_msg: {
        input: '请填写',
        select: '请选择',
        textarea: '请填写',
        picker: '请选择',
        cascader: '请选择',
        checkbox: '请选择',
        inputselect: '请选择',
        selectandinput: '请选择',
        inputNumber: '请填写',
        slot: '请填写',
        rangePicker: '请选择',
      },
      // formLayout: 'horizontal'
    }
  },
  // created() {
  //   console.log(this, 'aaa111aaaa')
  // },
  methods: {
    initFormData() {
      this.form_item.forEach((item) => {
        //rules规则
        if (item.required) {
          this.rules(item)
        }
        //自定义规则
        if (item.validator) {
          item.rules = item.validator
        }
      })
    },
    rules(item) {
      const requestRules = [
        {
          required: true,
          message: `${this.type_msg[item.type]}${item.label}`,
          trigger: 'change',
        },
      ]
      //其他的rules的规则
      if (item.rules && item.rules.length > 0) {
        item.rules = requestRules.concat(item.rules)
      } else {
        item.rules = requestRules
      }
      // console.log(item.rules)
    },
    displayRender({ labels }) {
      return labels.join('.')
    },
    async resetForm() {
      // console.log('11122222')
      await this.$refs.formRef.resetFields()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
  watch: {
    form_item: {
      handler(newValue) {
        // console.log('newValue', newValue)
        this.initFormData()
      },
      immediate: true,
      deep: true,
    },
    formHandler: {
      handler(newValue) {
        // console.log(newValue, 'newValue')
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>

<style lang="less">
.slotName {
  display: flex;
  justify-content: center;
}
</style>
