<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="60%">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <page-form
        ref="pageForm"
        :formItem="form_item_copy"
        :formData="formData"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <template slot="imgcontent">
          <upload
            ref="content"
            :tid="tid"
            getKey="content"
            :value="getValue"
            :importfileList="formData.contentImg"
            :quesId="this.formData.quesId"
            :title="title"
        /></template>
        <template slot="quesOption">
          <a-row style="margin-top: 5px">
            <a-col :span="24" style="text-align: right">
              <a-button :disabled="formData.chooseList.length === 7" @click="addChoose">新增选项</a-button></a-col
            >
          </a-row>
          <a-row
            style="background-color: #f0f2f5; margin-top: 5px"
            v-if="formData.chooseList && formData.chooseList.length != 0"
          >
            <a-col :span="3">勾选正确答案</a-col>
            <a-col :span="2">选项名称</a-col>
            <a-col :span="16"> 选择内容 </a-col>
          </a-row>
          <a-row type="flex" align="middle" style="margin-top: 5px" v-for="item in formData.chooseList" :key="item.id">
            <a-col :span="3" style="text-align: center">
              <a-radio
                v-show="formData.quesType == 1 || formData.quesType == 3"
                :checked="item.selectKey"
                @change="radioChange(item)"
              >
              </a-radio>
              <a-checkbox v-show="formData.quesType == 2" v-model="item.selectKey"> </a-checkbox>
            </a-col>
            <a-col :span="2" style="text-align: center">
              <a-input style="width: 33px" v-model="item.name" readOnly></a-input
            ></a-col>
            <a-col :span="17">
              <a-textarea v-model="item.value" placeholder="请输入选项内容" :rows="2" />
            </a-col>
            <a-col :span="2" style="text-align: center">
              <a-button size="small" type="primary" @click="removeChooseList(item)">删除</a-button></a-col
            >
          </a-row>
        </template>
        <template slot="imgAnalysis">
          <upload
            ref="analysis"
            :tid="tid"
            getKey="analysis"
            :value="getValue"
            :importfileList="formData.analysisImg"
            :quesId="this.formData.quesId"
            :title="title"
          />
        </template>
      </page-form>
    </a-modal>
  </div>
</template>

<script>
import JEditor from '@/components/jeecg/JEditor'
import pageForm from '@/components/page-form'
import upload from '@/components/upload'
import { modalFormConfig } from './config/modal.config'
import { guid } from '@/utils/util'
import { questionApi } from '@/api/question'
import { getImgName } from '@/utils/util'

export default {
  props: ['getData'],
  watch: {
    'formData.external': {
      handler(newValue) {
        // console.log('newValue', newValue)
        this.handleText(newValue)
      },
      immediate: true,
    },
    'formData.quesType': {
      handler(newValue) {
        this.formData.chooseList.forEach((item) => (item.selectKey = false))
      },
    },
  },
  components: {
    pageForm,
    JEditor,
    upload,
  },
  data() {
    return {
      //modalData
      ...modalFormConfig,
      confirmLoading: false,
      visible: false,
      title: '',
      getKey: '', //判断试题类型
      previewVisible: false, //图片预览
      arrOption: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      form_item_copy: [],
      fileList_content: [],
      fileList_anlaysis: [],
      tid: '',
      formData_copy: {},
      getValue: '',
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
    }
  },
  mounted() {
    this.form_item_copy = this.form_item
  },
  methods: {
    //uid
    guid,
    handleText(newValue) {
      if (newValue == 1) {
        this.form_item_copy = this.form_item
      } else if (newValue == 0) {
        this.form_item_copy = this.form_item.filter(
          (item) => item.slotName != 'imgAnalysis' && item.slotName != 'imgcontent'
        )
      }
    },
    async add() {
      this.visible = true
      this.tid = guid()
      this.getValue = 'add'
      await this.reset()
    },
    async edit(record) {
      this.tid = guid()
      this.getValue = 'edit'
      console.log('record', record)
      record.external = record.external + ''
      for (let key in this.formData) {
        if (record[key]) {
          this.formData[key] = record[key]
        }
      }
      this.formData.external = Number(this.formData.external)

      await this.handlerLook(record.quesId)
      this.visible = true
    },
    async handlerLook(id) {
      try {
        const res = await questionApi.lookQues(id)
        if (res.code == 200) {
          console.log('res.data', res.data)
          let data = res.data.optionS
          const arr = this.formData.answer.split('')
          for (const key in arr) {
            for (const value in data) {
              if (data[value].name == arr[key]) {
                data[value].selectKey = true
              }
            }
          }

          this.formData.chooseList = data
          let resList = await res.data.resources
          const contentImg = resList.filter((item) => item.type == '0')
          const analysisImg = resList.filter((item) => item.type == '1')
          this.formData.contentImg = await this.handlerFileList(contentImg)
          this.formData.analysisImg = await this.handlerFileList(analysisImg)
          // console.log('this.formData', this.formData)

          this.formData_copy = JSON.parse(JSON.stringify(this.formData))
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
    },
    handlerFileList(record) {
      if (record.length == 0) {
        return
      }
      return record.map((item) => {
        return {
          uid: item.id,
          name: getImgName(item.url),
          status: 'done',
          url: item.url,
        }
      })
    },
    async look(record) {
      this.visible = true
      this.formData = { ...record }
    },
    async reset() {
      this.$nextTick(() => {
        this.$refs.pageForm.$refs.formRef.clearValidate()
      })
      for (let key in this.formData) {
        this.formData[key] = ''
      }
      this.formData.quesType = undefined
      this.formData.difficulty = undefined
      this.formData.external = 1
      this.formData.quesType = 1
      this.formData.analysisImg = []
      this.formData.contentImg = []
      this.formData.chooseList = [
        {
          id: this.guid(),
          selectKey: false,
          value: '',
          name: 'A',
        },
        {
          id: this.guid(),
          selectKey: false,
          value: '',
          name: 'B',
        },
      ]
    },
    async handlerCancel() {
      this.visible = false
      this.confirmLoading = false
      await this.reset()
    },
    ok() {
      this.$refs.pageForm.$refs.formRef.validate((valid) => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    judgeCondition() {
      const quesList = this.formData.chooseList.map((item) => {
        return {
          name: item.name,
          value: item.value,
        }
      })
      let answers
      const answerList = this.formData.chooseList.filter((item) => item.selectKey == true)
      let quesFlag = false
      for (let key in quesList) {
        if (!quesList[key].value) {
          quesFlag = true
        }
      }
      if (quesFlag) {
        this.$message.info('选项内容不能为空')
        return
      } else if (quesList.length < 2) {
        this.$message.info('选项不能低于2个')
        return
      } else if (answerList.length == 0) {
        this.$message.info('正确答案不能为空')
        return
      } else if (answerList.length > 1 && (this.formData.quesType == 1 || this.formData.quesType == 3)) {
        this.$message.info('当前状态不能选择多个正确答案')
        return
      } else if (answerList.length < 2 && this.formData.quesType == 2) {
        this.$message.info('当前状态至少选择2个正确答案')
        return
      } else if (
        this.formData.external == 1 &&
        this.$refs.content.fileList.length == 0 &&
        this.$refs.analysis.fileList.length == 0
      ) {
        this.$message.info('图片资源不能为空')
        return
      } else {
        answers = answerList.map((item) => item.name).join('')
        return {
          answers,
          quesList,
        }
      }
    },
    async addModal() {
      const data = this.judgeCondition()
      console.log('data', data)
      if (!data) {
        return
      }
      const { answers, quesList } = data
      let contentUrl = []
      let analysistUrl = []
      console.log('this.$refs.content.fileList', this.$refs.content)
      if (this.formData.external == 1) {
        if (this.$refs.content.fileList.length > 0) {
          contentUrl = this.$refs.content.fileList.map((item) => item.url)
        }
        if (this.$refs.analysis.fileList.length > 0) {
          analysistUrl = this.$refs.analysis.fileList.map((item) => item.url)
        }
      }

      const contentList = [
        {
          type: '0', //试题资源：0，解析资源：1
          urls: contentUrl,
        },
      ]

      const analysisList = [
        {
          type: '1', //试题资源：0，解析资源：1
          urls: analysistUrl,
        },
      ]

      let params = {
        analysis: this.formData.analysis,
        answer: answers,
        content: this.formData.content,
        descr: this.formData.descr,
        difficulty: this.formData.difficulty,
        external: this.formData.external,
        options: quesList,
        quesType: this.formData.quesType,
        unitId: this.getData.key,
        quesResource: [...contentList, ...analysisList],
      }

      this.confirmLoading = true

      try {
        const res = await questionApi.addQues(params)
        if (res.code == 200) {
          this.$message.success('新增成功')
          this.confirmLoading = false
          this.$emit('update')
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
      this.confirmLoading = false
      this.handlerCancel()
    },
    async editModal() {
      const data = this.judgeCondition()
      if (!data) {
        return
      }
      this.confirmLoading = true
      const { answers, quesList } = data
      let params = {
        analysis: this.formData.analysis,
        answer: answers,
        content: this.formData.content,
        descr: this.formData.descr,
        difficulty: this.formData.difficulty,
        external: this.formData.external,
        quesOptionDTOS: quesList,
        quesType: this.formData.quesType,
        quesId: this.formData.quesId,
      }

      if (JSON.stringify(this.formData_copy) != JSON.stringify(this.formData)) {
        questionApi
          .updateQues(params)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('修改成功')
              this.$emit('update')
            } else {
              this.$message.error(res.message)
            }
            this.confirmLoading = false
          })
          .catch((e) => {
            this.confirmLoading = false
            console.log(e)
          })
      }
      await this.handlerCancel()
      // this.confirmLoading = false
    },
    handleChange(value) {
      this.getKey = value
    },
    handleChange_lv(value) {},
    //新增选项
    addChoose() {
      console.log('this.formData.chooseList', this.formData.chooseList)
      if (this.formData.chooseList.length === 7) {
        return
      }
      this.formData.chooseList.push({
        id: this.guid(),
        selectKey: false,
        value: '',
        name: this.arrOption[this.formData.chooseList.length],
      })
    },
    removeChooseList(value) {
      const data = this.formData.chooseList.filter((item) => item.id != value.id)
      this.formData.chooseList = data
      this.formData.chooseList.forEach((item, index) => (item.name = this.arrOption[index]))
    },
    radioChange(e) {
      this.formData.chooseList.forEach((item) => (item.selectKey = true))
      this.formData.chooseList.filter((item) => item.id != e.id).forEach((item) => (item.selectKey = false))
    },
  },
}
</script>

<style lang="scss" scoped></style>
