<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="45%">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <a-form-model :model="formData" style="margin-bottom: 10px" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="试题名称">
              <a-input v-model="formData.name" placeholder="请输入试题名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="试题类型">
              <a-select @change="handleChange" v-model="formData.type" placeholder="请选择试题类型">
                <a-select-option value="0"> 单选 </a-select-option>
                <a-select-option value="1"> 多选 </a-select-option>
                <a-select-option value="2"> 判断 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <a-form-model :model="formData" style="margin-bottom: 10px" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="3" style="text-align: center"> 类型:</a-col>
          <a-col :span="17">
            <a-form-model-item>
              <a-select style="width: 200px" @change="handleChange" v-model="formData.type" placeholder="请选择类型">
                <a-select-option value="0"> 文字 </a-select-option>
                <a-select-option value="1"> 图片 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <a-row v-if="formData.type == '0' || formData.type == '1'">
        <a-col :span="3" style="text-align: center">试题图片:</a-col>
        <a-col :span="17">
          <a-upload
            list-type="picture-card"
            :file-list="formData.fileList"
            @preview="imgPreview"
            @change="imgChange"
            :before-upload="beforeUpload"
            :customRequest="imgRequest"
          >
            <div v-if="formData.fileList.length < 2">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-col>
      </a-row>

      <a-modal
        v-if="formData.fileList.length != 0"
        :visible="previewVisible"
        :footer="null"
        @cancel="previewVisible = false"
      >
        <img :alt="formData.fileList[0].name || null" style="width: 100%" :src="formData.fileList[0].url" />
      </a-modal>

      <a-row>
        <a-col :span="3" style="text-align: center">试题内容:</a-col>
        <a-col :span="17">
          <a-textarea v-model="formData.content" placeholder="请输入试题内容" :rows="4" />
        </a-col>
      </a-row>
      <a-row style="margin-top: 5px">
        <a-col :span="24" style="text-align: right"> <a-button @click="addChoose">新增选项</a-button></a-col>
      </a-row>

      <a-row style="background-color: #f0f2f5; margin-top: 5px" v-if="formData.chooseList.length != 0">
        <a-col :span="3">勾选正确答案</a-col>
        <a-col :span="2">选项名称</a-col>
        <a-col :span="16"> 选择内容 </a-col>
      </a-row>
      <a-row type="flex" align="middle" style="margin-top: 5px" v-for="item in formData.chooseList" :key="item.key">
        <a-col :span="3" style="text-align: center"> <a-checkbox v-model="item.selectKey"> </a-checkbox></a-col>
        <a-col :span="2" style="text-align: center"> <a-input style="width: 33px" v-model="item.id"></a-input></a-col>
        <a-col :span="17">
          <a-textarea v-model="item.content" placeholder="请输入选项内容" :rows="2" />
        </a-col>
        <a-col :span="2" style="text-align: center">
          <a-button size="small" type="primary" @click="removeChooseList(item)">删除</a-button></a-col
        >
      </a-row>
      <a-row style="margin-top: 15px">
        <a-col :span="3" style="text-align: center">试题难度:</a-col>
        <a-col :span="17">
          <a-select @change="handleChange_lv" v-model="formData.lv" placeholder="请选择试题难度" style="width: 200px">
            <a-select-option value="0"> 难 </a-select-option>
            <a-select-option value="1"> 中 </a-select-option>
            <a-select-option value="2"> 易 </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row style="margin-top: 15px">
        <a-col :span="3" style="text-align: center">试题解析:</a-col>
        <a-col :span="17">
          <a-textarea v-model="formData.analysis" placeholder="请输入试题解析" :rows="4" />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import pageSearch from '@/components/page-form'
import { modalFormConfig } from './config/modal.config'
import { guid } from '@/utils/util'
export default {
  components: {
    pageSearch,
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
    }
  },
  mounted() {},
  methods: {
    //uid
    guid,
    async add() {
      this.visible = true

      await this.reset()
    },
    async edit(record) {
      this.formData = { ...record }
      this.visible = true
    },
    async look(record) {
      this.visible = true
      this.formData = { ...record }
    },
    reset() {
      for (let key in this.formData) {
        this.formData[key] = ''
      }
      this.formData.type = undefined
      this.formData.lv = undefined
      this.formData.fileList = []
      this.formData.chooseList = []
    },
    handlerCancel() {
      this.visible = false
      this.reset()
    },
    ok() {
      // this.$refs.pageSearch.$refs.form.validate((valid) => {
      //   if (valid) {
      this.title == '新增' ? this.addModal() : this.editModal()
      //   }
      // })
    },
    async addModal() {
      console.log('this', this.chooseList)
      // this.confirmLoading = true
      // let params = {
      //   parentNode: 'root',
      //   pid: 0,
      //   name: this.formData.name,
      //   nameEng: this.formData.eName,
      //   description: this.formData.description,
      // }
      // addScene(params)
      //   .then((res) => {
      //     if (res.code == 200) {
      //       this.$message.success('添加成功')
      //     }
      //     this.confirmLoading = false
      //     this.$emit('updateData', this.title, data)
      //   })
      //   .catch((e) => {
      //     this.confirmLoading = false
      //     console.log(e)
      //   })
      await this.handlerCancel()
    },
    async editModal() {
      // console.log(this.rowData)
      // this.confirmLoading = true
      // let params = {
      //   id: this.rowData.id,
      //   pathNodeId: this.rowData.pathNodeId,
      //   name: this.formData.name,
      //   description: this.formData.description,
      // }
      // if (this.rowData.name != this.formData.name || this.rowData.description != this.formData.description) {
      //   updateScene(params)
      //     .then((res) => {
      //       if (res.code == 200) {
      //         this.$message.success('修改成功')
      //       }
      //       this.confirmLoading = false
      //       this.$emit('updateData')
      //     })
      //     .catch((e) => {
      //       this.confirmLoading = false
      //       console.log(e)
      //     })
      // }
      await this.handlerCancel()
      // this.confirmLoading = false
    },
    handleChange(value) {
      this.getKey = value
    },
    handleChange_lv(value) {},
    //新增选项
    addChoose() {
      this.formData.chooseList.push({
        key: this.guid(),
        selectKey: false,
        content: '',
      })
    },
    removeChooseList(value) {
      // console.log('vavaluelue', value)
      this.formData.chooseList = this.formData.chooseList.filter((item) => item.key != value.key)
    },
    //试题图片
    imgPreview() {
      this.previewVisible = true
    },
    imgChange({ fileList }) {
      this.formData.fileList = fileList
      this.isImgChange = true
    },
    // 上传前验证
    beforeUpload(file) {
      const typeArr = [
        'image/jpeg',
        'image/png',
        'video/AVI',
        'video/mov',
        'video/rmvb',
        'video/rm',
        'video/FLV',
        'video/mp4',
        'video/3GP',
        'video/mpg',
        'video/mpe',
        'video/mpeg',
        'video/m2v',
      ]
      const photo = ['image/jpeg', 'image/png']
      this.noPhoto = photo.includes(file.type)
      // console.log('file.type', file.type)
      const isJpgOrPng = typeArr.includes(file.type)
      if (!isJpgOrPng) {
        this.$message.error('只支持上传jpg、png图片或视频')
      }
      const isLt2M = file.size / 1024 / 1024 < 80
      if (!isLt2M) {
        this.$message.error('上传失败，图片或视频大小不能超过80MB!')
      }
      return isJpgOrPng && isLt2M
    },
    // upload
    async imgRequest(file) {
      // const formData = new FormData()
      // this.tid = this.tid ? this.tid : guid()
      // formData.append('file', file.file)
      // formData.append('tid', this.tid)
      // try {
      //   let res = await upload(formData)
      //   let fileName = getImgName(res.data)
      //   this.fileList = [
      //     {
      //       uid: this.tid,
      //       name: fileName,
      //       status: 'done',
      //       url: res.data,
      //     },
      //   ]
      //   this.preViewTitle = this.fileList[0].name
      //   this.preViewUrl = this.fileList[0].url
      //   console.log('this.preViewUrl', this.preViewUrl)
      // } catch (err) {
      //   console.log(err)
      // }
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
