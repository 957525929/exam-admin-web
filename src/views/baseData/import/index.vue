<template>
  <a-card>
    <div class="table-operator">
      <a-row type="flex" justify="space-between" :gutter="16">
        <a-col style="color: red">当前导入账号数：0</a-col>
        <a-col>
          <a-button type="primary" @click="submit" :loading="loading_submit"> 提交 </a-button>
          <a-button icon="download" type="dash" @click="exportExcel">模板下载</a-button>
          <a-upload :file-list="fileList" @change="fileChange" :before-upload="readExcel" accept=".xls,.xlsx">
            <div v-if="fileList.length < 1">
              <a-button icon="import"> 导入 </a-button>
            </div>
          </a-upload>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-alert
        message="当操作栏显示红色修改时,表示当前行有字段为空，需要修改。当操作栏显示绿色编辑时，表示字段检测没问题，但是可以编辑字段属性。"
        banner
        closable
      />
      <a-table
        rowKey="id"
        :data-source="dataSource"
        :columns="Object.getOwnPropertyNames(this.getRouteData).length == 1 ? columns_class : columns"
        :pagination="false"
        class="table"
      >
        <template
          v-for="col in Object.getOwnPropertyNames(this.getRouteData).length == 1
            ? ['name', 'school', 'teacher', 'year']
            : ['account', 'name', 'number', 'phone']"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="(e) => handleChange(e.target.value, record.uid, col)"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <!-- <template slot="groupName" slot-scope="text, record">
          <div>
            <a-select
              style="width: 150px; margin: -5px 0"
              v-if="record.editable"
              :value="text"
              @change="(e) => handleChange(e, record.uid, 'groupName')"
            >
              <a-select-option v-for="d in options" :key="d.value" :value="d.value">
                {{ d.label }}
              </a-select-option></a-select
            >
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template> -->
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => save(record.uid)">保存</a>
              <a-popconfirm title="是否确认取消?" @confirm="() => cancel(record.uid)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a
                :style="{ color: record.empty || record.phoneNum ? 'red' : 'green' }"
                :disabled="editingKey !== ''"
                @click="() => edit(record.uid)"
                >{{ record.empty || record.phoneNum ? '修改' : '编辑' }}</a
              >
              <!-- <a v-else style="color:green" :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a> -->
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { export2Excel } from '@/assets/Excel/excelexport'
// import { importStusByClasseId, isAccountList } from '@/api/class'
import { guid } from '@/utils/util'
import { isMobile } from '@/utils/validate'
export default {
  props: ['getData', 'getTestData'],
  data() {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '账号',
          dataIndex: 'account',
          align: 'center',
          scopedSlots: { customRender: 'account' },
        },

        {
          title: '学生姓名',
          align: 'center',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '学号',
          align: 'center',
          dataIndex: 'number',
          scopedSlots: { customRender: 'number' },
        },
        {
          title: '电话号码',
          align: 'center',
          dataIndex: 'phone',
          scopedSlots: { customRender: 'phone' },
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columns_class: [
        {
          title: '序号',
          dataIndex: 'id',
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '班级名称',
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' },
        },

        {
          title: '所属校区',
          align: 'center',
          dataIndex: 'school',
          scopedSlots: { customRender: 'school' },
        },
        {
          title: '负责教师',
          align: 'center',
          dataIndex: 'teacher',
          scopedSlots: { customRender: 'teacher' },
        },
        {
          title: '年份',
          align: 'center',
          dataIndex: 'year',
          scopedSlots: { customRender: 'year' },
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      dataSource: [],
      fileList: [],
      cacheData: [],
      editingKey: '',
      studentList: [
        {
          id: 1,
          account: '13023818128',
          name: '李四',
          number: '13023818128',
          phone: '13023818128',
        },
        {
          id: 2,
          account: '13023818129',
          name: '王五',
          number: '13023818129',
          phone: '13023818129',
        },
      ],
      schoolList: [
        {
          id: 1,
          name: '班级A',
          school: '校区A',
          teacher: '教师A',
          year: '2021',
        },
        {
          id: 2,
          name: '班级B',
          school: '校区B',
          teacher: '教师B',
          year: '2022',
        },
      ],
      pushData: [],
      getCheckAccKey: '',
      loading_import: false,
      loading_submit: false,
      getRouteData: {},
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.getRouteData = this.$route.params.record
      console.log('this.$route.query', Object.getOwnPropertyNames(this.getRouteData).length)
    },

    readExcel(file) {
      const that = this
      // 拿取文件对象
      var f = file
      // 用FileReader来读取
      var reader = new FileReader()
      // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = (f) => {
        var binary = ''
        var wb // 读取完成的数据
        var outdata // 你需要的数据
        var reader = new FileReader()
        reader.onload = (e) => {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // debugger;
          // return false;
          var XLSX = require('xlsx')
          wb = XLSX.read(binary, {
            type: 'binary',
          })
          var pushData = []
          // for (let j = 0; j < 2; j++) {
          // {"id":"123","级别":"自然部","年份":"2021","图层名称":"二违"}
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          console.log(JSON.stringify(outdata), '2222')
          if (Object.getOwnPropertyNames(this.getRouteData).length == 1) {
            for (let i = 0; i < outdata.length; i++) {
              let obj = {
                id: outdata[i]['id'],
                name: outdata[i]['班级名称'],
                school: outdata[i]['所属校区'],
                teacher: outdata[i]['负责教师'],
                year: outdata[i]['年份'],
              }
              pushData.push(obj)
            }
          } else {
            for (let i = 0; i < outdata.length; i++) {
              let obj = {
                id: outdata[i]['id'],
                account: outdata[i]['账号'],
                name: outdata[i]['学生姓名'],
                number: outdata[i]['学号'],
                phone: outdata[i]['电话号码'],
              }
              pushData.push(obj)
            }
          }

          console.log('this.pushData', pushData)
          // }
          // console.log("-----base----" + JSON.stringify(pushData.base));
          // console.log("-----list----" + JSON.stringify(pushData.list));
          this.pushData = pushData
          Object.getOwnPropertyNames(this.getRouteData).length == 1
            ? this.reImport_class(pushData)
            : this.reImport(pushData)
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
    },
    fileChange() {},
    async reImport(value) {
      let data = []
      if (value) {
        data = value
        // this.guid()
        data.forEach((item) => (item.uid = guid()))
      } else {
        data = this.dataSource
      }
      let res_phone = data.filter((item) => {
        return !isMobile(item.phone)
      })
      data.forEach((item) => delete item.phoneNum)

      if (res_phone.length > 0) {
        res_phone.forEach((item) => (item.phoneNum = true))
        let data = res_phone.map((item) => item.phone)
        let phoneData = data.join('、')
        this.$message.error(`${phoneData}手机格式不符合`)
      }
      let res_empty = data.filter((item) => {
        return (
          item.account == undefined ||
          item.name == undefined ||
          item.number == undefined ||
          item.phone == undefined ||
          item.account == '' ||
          item.name == '' ||
          item.number == '' ||
          item.phone == '' ||
          item.phoneNum == true
        )
      })
      let res_unempty = data.filter((item) => {
        return (
          item.account != undefined &&
          item.name != undefined &&
          item.number != undefined &&
          item.phone != undefined &&
          item.account != '' &&
          item.name != '' &&
          item.number != '' &&
          item.phone != '' &&
          !item.phoneNum
        )
      })
      res_empty.forEach((item) => (item.empty = true))
      res_unempty.forEach((item) => delete item.empty)

      this.dataSource = [...res_empty, ...res_unempty]
      console.log('this.dataSource', this.dataSource)
      this.cacheData = this.dataSource.map((item) => ({ ...item }))
      // await this.checkAccount()
    },

    async reImport_class(value) {
      let data = []
      if (value) {
        data = value
        // this.guid()
        data.forEach((item) => (item.uid = guid()))
      } else {
        data = this.dataSource
      }

      let res_empty = data.filter((item) => {
        return (
          item.name == undefined ||
          item.school == undefined ||
          item.teacher == undefined ||
          item.year == undefined ||
          item.name == '' ||
          item.school == '' ||
          item.teacher == '' ||
          item.year == ''
        )
      })
      let res_unempty = data.filter((item) => {
        return (
          item.name != undefined &&
          item.school != undefined &&
          item.teacher != undefined &&
          item.year != undefined &&
          item.name != '' &&
          item.school != '' &&
          item.teacher != '' &&
          item.year != ''
        )
      })
      res_empty.forEach((item) => (item.empty = true))
      res_unempty.forEach((item) => delete item.empty)

      this.dataSource = [...res_empty, ...res_unempty]
      console.log('this.dataSource', this.dataSource)
      this.cacheData = this.dataSource.map((item) => ({ ...item }))
      // await this.checkAccount()
    },

    async checkAccount() {
      this.getCheckAccKey = ''
      let data = this.dataSource.map((item) => item.account)
      try {
        let params = { accountList: data }
        let res = await isAccountList(params)
        if (res.code == 500) {
          this.$message.error(res.message)
          this.getCheckAccKey = 'error'
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleChange(value, key, column) {
      // console.log('value', value)
      // console.log('asdasdadsaasdasas')
      // console.log('column', column)
      const newData = [...this.dataSource]
      const target = newData.filter((item) => key === item.uid)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    edit(key) {
      console.log('key', key)
      const newData = [...this.dataSource]
      const target = newData.filter((item) => key === item.uid)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.dataSource = newData
      }
    },
    save(key) {
      // console.log('key', key)
      const newData = [...this.dataSource]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => key === item.uid)[0]
      const targetCache = newCacheData.filter((item) => key === item.uid)[0]
      if (target && targetCache) {
        delete target.editable
        this.dataSource = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },

    cancel(key) {
      const newData = [...this.dataSource]
      const target = newData.filter((item) => key === item.uid)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter((item) => key === item.uid)[0])
        delete target.editable
        this.dataSource = newData
      }
    },
    async submit() {
      Object.getOwnPropertyNames(this.getRouteData).length == 1 ? this.class_save() : this.student_save()
    },
    async student_save() {
      let data_edit = this.dataSource.filter((item) => item.editable == true)
      if (this.dataSource.length == 0 || data_edit.length > 0) {
        return false
      }

      this.loading_submit = true
      await this.reImport()
      let res_empty = this.dataSource.filter((item) => {
        return (
          item.account == undefined ||
          item.name == undefined ||
          item.number == undefined ||
          item.phone == undefined ||
          item.account == '' ||
          item.name == '' ||
          item.number == '' ||
          item.phone == ''
        )
      })
      let res_phone = this.dataSource.filter((item) => {
        this.loading_submit = false
        return !isMobile(item.phone)
      })

      if (res_empty.length > 0) {
        this.$message.error('提交的数据的字段不能为空')
        this.loading_submit = false
        return false
      }
      if (res_phone.length > 0) {
        this.$message.error(`${phoneData}手机格式不符合`)
        this.loading_submit = false
        return false
      }
      console.log('this.getCheckAccKey', this.getCheckAccKey)
      return
      if (this.getCheckAccKey == 'error') {
        this.loading_submit = false
        return false
      } else {
        let data = {
          classeId: this.classId,
          importStudentDTOList: this.dataSource,
        }
        try {
          let res = await importStusByClasseId(data)
          if (res.code == 200) {
            this.$message.success('导入成功')
            this.$router.push({ name: 'group-groupList' })
            this.loading_submit = false
          } else {
            this.$message.error(res.message)
            this.loading_submit = false
          }
          console.log(res)
        } catch (e) {
          this.loading_submit = false
          console.log(e)
        }
      }
    },

    async class_save() {
      console.log('sssssqq')
      let data_edit = this.dataSource.filter((item) => item.editable == true)
      if (this.dataSource.length == 0 || data_edit.length > 0) {
        return false
      }

      this.loading_submit = true
      await this.reImport_class()
      let res_empty = this.dataSource.filter((item) => {
        return (
          item.name == undefined ||
          item.school == undefined ||
          item.teacher == undefined ||
          item.year == undefined ||
          item.name == '' ||
          item.school == '' ||
          item.teacher == '' ||
          item.year == ''
        )
      })

      if (res_empty.length > 0) {
        this.$message.error('提交的数据的字段不能为空')
        this.loading_submit = false
        return false
      }
    },

    exportExcel(search) {
      // search.examId = search.examId ? search.examId : search.id
      const sheetName = [search.examId + '']
      const list =
        Object.getOwnPropertyNames(this.getRouteData).length == 1
          ? [[['id', '班级名称', '所属校区', '负责教师', '年份']]]
          : [[['id', '账号', '学生姓名', '学号', '电话号码']]]
      const { studentList, schoolList } = this
      // let data = Object.getOwnPropertyNames(this.getRouteData).length == 1 ? this.schoolList : this.studentList
      if (Object.getOwnPropertyNames(this.getRouteData).length == 1) {
        for (let i = 0; i < schoolList.length; i++) {
          list[0].push([
            schoolList[i].id,
            schoolList[i].name,
            schoolList[i].school,
            schoolList[i].teacher,
            schoolList[i].year,
          ])
        }
      } else {
        for (let i = 0; i < studentList.length; i++) {
          list[0].push([
            studentList[i].id,
            studentList[i].account,
            studentList[i].name,
            studentList[i].number,
            studentList[i].phone,
          ])
        }
      }
      const fileName = Object.getOwnPropertyNames(this.getRouteData).length == 1 ? '班级列表' : '学生列表'
      export2Excel(sheetName, list, fileName)
    },
  },
  watch: {
    // getTestData: {
    //   handler(newValue, oldValue) {
    //     this.loadData(newValue)
    //   }
    // }
  },
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.red {
  color: red;
}
.green {
  color: green;
}
</style>
