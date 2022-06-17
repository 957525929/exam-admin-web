<template>
  <div>
    <a-card class="card" title="参数配置">
      <a-button slot="extra" @click="goBack">返回</a-button>
      <SourceItem :data="rowData" />
      <br />
      <!-- <ParamsList :rowData="rowData" /> -->
      <ParamsTable :data="dataExample" :show="false" ref="paramsTable" @updateAdd="showSave" @updateDel="loadData" />
      <br />
      <a-form-item class="btn-position">
        <a-button type="primary" @click="handlerOk" v-if="dataExample.length != 0 || showSaveBtn"> 保存 </a-button>
        <!-- <a-button style="margin-left: 30px" html-type="reset"> 重置 </a-button> -->
      </a-form-item>
    </a-card>
  </div>
</template>

<script>
import SourceItem from '../scenceManage/components/sourceItem.vue'
// import ParamsList from './components/paramsList'
import ParamsTable from './components/paramsTable'
import { columns, tableData } from './data/paramsTableData'
import { getEqPara, updateEqParam, addEquipmentParam } from '@/api/equip'
export default {
  components: {
    SourceItem,
    // ParamsList
    ParamsTable,
  },
  created() {
    this.rowData = JSON.parse(this.$route.query.data)
    this.loadData()
  },
  data() {
    return {
      rowData: '',
      columns,
      tableData,
      dataExample: [],
      oldDataExample: [],
      showSaveBtn: false,
    }
  },
  watch: {
    // dataExample(newValue) {
    //   console.log('newValue', newValue)
    // },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async loadData() {
      try {
        let params = {
          id: this.rowData.id,
        }
        let res = await getEqPara(params)

        console.log(res.data)
        this.dataExample = res.data
        this.oldDataExample = res.data
        this.oldDataExample = this.oldDataExample.map((item) => {
          return {
            id: item.id,
            name: item.name,
            value: item.value,
            upper: item.upper,
            lower: item.lower,
            unit: item.unit,
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    handlerOk() {
      this.$refs.paramsTable.$refs.editableTable.getValues((error, values) => {
        // // 错误数 = 0 则代表验证通过
        if (error === 0) {
          this.handletable(values)
        } else {
          this.$message.error('验证未通过')
          return false
        }
      })
    },
    async handletable(value) {
      value.forEach((item) => delete item.action)
      // console.log(newValute, 'newValute')
      const editData = value.filter((item) => item.id.length != 20)
      const addData = value.filter((item) => item.id.length == 20)
      if (addData.length > 0) {
        this.addTable(addData)
      }
      if (editData.length > 0) {
        if (JSON.stringify(this.oldDataExample) == JSON.stringify(editData)) {
          return false
        }
        this.editTable(editData)
      }

      // return
    },
    async editTable(value) {
      console.log('edit')
      try {
        let data = value.map((item) => {
          item.equipmentId = this.rowData.id
          return item
        })
        let res = await updateEqParam(data)
        if (res.code == 200) {
          this.$message.success('修改成功')
          this.loadData()
        }
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    async addTable(value) {
      // console.log('add')
      try {
        // console.log('value', value)
        // return false
        value.forEach((item) => {
          item.paramname = item.name
          return item
        })
        let data = {
          addEqParamDTOS: value,
          id: this.rowData.id,
        }
        let res = await addEquipmentParam(data)
        if (res.code == 200) {
          this.$message.success('新增成功')
          this.loadData()
        }
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    showSave(val) {
      this.showSaveBtn = true
      console.log('this.showSaveBtn', this.showSaveBtn)
    },
  },
}
</script>

<style lang="less" scoped>
.btn-position {
  display: flex;
  justify-content: flex-end;
}
</style>
