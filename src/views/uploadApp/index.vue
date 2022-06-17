<template>
  <div class="content">
    <div class="form">
      <a-form-model :model="appData" ref="ruleForm" :rules="rules" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" @submit="handleSubmit">
        <a-form-model-item label="客户端">
          <a-radio-group default-value="0" @change="typeChange">
            <a-radio-button value="0"> 教师端 </a-radio-button>
            <a-radio-button value="1"> 学生端 </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="当前应用版名称">{{versionNameCopy}}</a-form-model-item>
        <a-form-model-item prop="versionName" label="应用版本名称">
          <a-input
            placeholder="请输入应用版本名称"
            v-model="appData.versionName"
          />
        </a-form-model-item>
        <a-form-model-item label="当前应用版本号">{{versionCopy}}</a-form-model-item>
        <a-form-model-item prop="version" label="应用版本号">
          <a-input
            placeholder="请输入应用版本号"
            v-model="appData.version"
          />
        </a-form-model-item>
        <a-form-model-item label="更新类型">
          <a-radio-group :value="defaultType" @change="updateTypeChange">
            <a-radio-button value="0"> 整包更新 </a-radio-button>
            <a-radio-button value="1"> 热更新 </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="文件上传">
          <a-upload :showUploadList="false" :customRequest="appRequest">
            <a-button>upload</a-button>
          </a-upload>
          <p>{{fileName}}</p>
        </a-form-model-item>
        <a-form-model-item label="升级信息">
          <a-textarea
            placeholder="请输入升级信息"
            :rows="4"
            v-model="appData.message"
          />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" @click="submitApp"> 提交 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import {appUpload} from '@/api/appUpload'
export default {
  created() {
    this.loadData()
  },
  data() {
    return {
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
      defaultFileList: [],
      // form: this.$form.createForm(this, { name: 'coordinated' }),
      queryParam: {
        type: 'teacher'
      },
      rules: {
        version: [{required: true, message: '请输入应用版本号', trigger: 'blur'}],
        versionName: [{required: true, message: '请输入应用版本名称', trigger: 'blur'}],
      },
      appData: {
        url: '',
        appScenarios: "",
        id: undefined,
        message: "",
        version: "1",
        versionName: "1",
        type: ''
      },
      versionCopy: '',
      versionNameCopy: '',
      fileName: '',
      appDataCopy: null,
      defaultType: '0'
    }
  },
  methods: {
    loadData() {
      appUpload
        .loadData(this.queryParam)
        .then((res) => {
          if (res.code == 200) {
            for(let key in this.appData) {
              this.appData[key] = res.data[key]
            }
            this.versionCopy = this.appData.version
            this.versionNameCopy = this.appData.versionName
            this.appData.type == "整包更新" ? this.defaultType = '0' : this.defaultType = '1'
            console.log(this.defaultType)
            this.appDataCopy = JSON.parse(JSON.stringify(this.appData))
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
    },
    handleSubmit(e) {
      console.log('2222')
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log('values', values)
        if (!err) {
          console.log('Received values of form: ', values)
          this.form.resetFields()
        }
      })
    },
    typeChange() {
      this.queryParam.type === 'teacher' ? this.queryParam.type = 'student' : this.queryParam.type = 'teacher';
      this.loadData()
    },
    updateTypeChange(e) {
      e.target.value == "0" ? this.appData.type = '整包更新' : this.appData.type = '热更新'
      this.defaultType = e.target.value
    },
    appRequest(file) {
      const formData = new FormData()
      this.fileName = file.file.name
      formData.append('file', file.file)
      console.log(file)
      this.confirmLoading = true
      appUpload
        .uploadApp(formData)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('上传成功')
            this.appData.url = res.data
            this.confirmLoading = false
          } else {
            return false
          }
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },
    submitApp() {
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          console.log('表单验证', valid)
        }
      })
      if(JSON.stringify(this.appData) == JSON.stringify(this.appDataCopy)) return
      let params = {
        appScenarios: this.queryParam.type,
        url: this.appData.url,
        type: this.appData.type,
        message: this.appData.message,
        version: this.appData.version,
        versionName: this.appData.versionName
      }
      console.log(params)
      appUpload
        .uploadAppLog(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('修改成功')
            this.confirmLoading = false
            this.loadData()
          } else {
            return false
          }
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    }
  },
}
</script>

<style lang="less">
.content {
  display: flex;
  width: 100%;
  justify-content: center;
  .form {
    width: 50%;
  }
}
</style>
