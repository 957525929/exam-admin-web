<template>
  <div>
    <JEditableTable
      ref="editableTable"
      :columns="columns"
      :dataSource="dataSource"
      :rowNumber="true"
      :actionButton="isShow"
      @added="addData"
    >
      <template v-slot:action="props">
        <a @click="handleDelete(props)">删除</a>
      </template>
    </JEditableTable>
  </div>
</template>

<script>
import JEditableTable from '@/components/jeecg/JEditableTable'
import { FormTypes } from '@/utils/JEditableTableUtil'
import { deleteEquipmentParam } from '@/api/equip'

export default {
  components: {
    JEditableTable,
  },
  props: ['data', 'show'],
  data() {
    return {
      dataSource: [],
      isShow: true,
      // 表头
      columns: [
        {
          title: '参数名称',
          key: 'name',
          type: FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }],
        },
        {
          title: '参数缺省值',
          key: 'value',
          type: FormTypes.inputNumber,
          placeholder: '请输入${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }],
        },
        {
          title: '超限上限值',
          key: 'upper',
          type: FormTypes.inputNumber,
          placeholder: '请输入${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }],
        },
        {
          title: '超限下限值',
          key: 'lower',
          type: FormTypes.inputNumber,
          placeholder: '请输入${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }],
        },
        {
          title: '单位',
          key: 'unit',
          type: FormTypes.input,
          placeholder: '请选择${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }],
        },
        {
          title: '操作',
          key: 'action',
          type: FormTypes.slot, // 定义该列为 自定义插值列
          slotName: 'action', // slot 的名称，对应 v-slot 冒号后面和等号前面的内容
        },
      ],
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    delData() {
      this.$refs.editableTable.initialize()
    },
    loadData() {
      // if (this.dataSource.length > 0) {
      //   let data = this.columns.filter((item) => item.title == '参数名称')
      //   data[0].key = 'name'
      // } else {
      //   let data = this.columns.filter((item) => item.title == '参数名称')
      //   data[0].key = 'paramname'
      // }
    },
    async handleDelete(val) {
      try {
        const formData = new FormData()
        formData.append('eqParamId', val.rowId)
        let res = await deleteEquipmentParam(formData)
        if (res.code == 200) {
          this.$emit('updateDel')
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
      // this.$refs.editableTable.added()
    },
    addData(val) {
      // console.log(val, 'val')
      this.$emit('updateAdd', val)
    },
  },
  watch: {
    show() {
      this.isShow = this.show
    },
    data(newValue) {
      // console.log('newValuenewValuenewValue', newValue)
      this.dataSource = newValue
      this.loadData()
    },
  },
}
</script>

<style lang="less" scoped></style>
