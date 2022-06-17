<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="45%">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <!-- 新增、编辑 -->
      <a-form-model
        ref="ruleForm"
        v-if="title != '查看'"
        :model="formData"
        layout="inline"
        style="margin-bottom: 10px"
        :rules="rules"
      >
        <a-form-model-item label="资源名称" prop="name">
          <a-input v-model="formData.name" placeholder="请输入资源名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="资源类型" prop="resType">
          <a-select @change="handleChange" v-model="formData.resType" placeholder="请选择资源类型" style="width: 200px">
            <a-select-option value="0"> html </a-select-option>
            <a-select-option value="1"> 其他资源 </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-form-model-item
        v-if="title != '查看'"
        label="描述"
        :labelCol="{ span: 2 }"
        :wrapperCol="{
          span: 14,
        }"
      >
        <a-textarea v-model="formData.descr" placeholder="请输入描述" :rows="2" />
      </a-form-model-item>

      <div class="clearfix">
        <a-upload
          v-if="title != '查看' && formData.resType == '1'"
          list-type="picture-card"
          :file-list="fileList"
          @preview="imgPreview"
          @change="imgChange"
          :before-upload="beforeUpload"
          :customRequest="imgRequest"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-form-item v-if="title != '查看' && formData.resType == '0'">
          <j-editor v-model="formData.content" />
        </a-form-item>
        <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
          <img
            :alt="this.fileList.length != 0 ? this.fileList[0].name : ''"
            style="width: 100%"
            :src="this.fileList.length != 0 ? this.fileList[0].url : ''"
          />
        </a-modal>
        <a-modal :visible="previewVideoVisible" :footer="null" @cancel="previewVideoVisible = false">
          <video
            width="100%"
            height="500px"
            controls="controls"
            id="video"
            autoplay="autoplay"
            loop="loop"
            :src="formData.resUrl"
          ></video>
        </a-modal>
      </div>

      <!-- 查看 -->
      <a-carousel v-if="title == '查看' && getKey == 1" arrows>
        <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div>
        <div>
          <video
            v-if="!isJpg"
            width="100%"
            height="500px"
            controls="controls"
            id="video"
            autoplay="autoplay"
            loop="loop"
            :src="formData.resUrl"
          ></video>
          <!-- <audio v-if="!isJpg" :src="formData.resUrl" controls loop name="sssss"></audio> -->
          <img v-else class="cImg" :src="formData.resUrl" />
        </div>
      </a-carousel>
      <div
        v-if="title == '查看' && getKey == 0"
        width="100%"
        height="600px"
        class="parser-wrapper"
        v-html="formData.content"
      ></div>
      <!-- <video
        v-if="!isEdit && rowData.type != 'jpg' && rowData.type != 'png'"
        width="100%"
        height="500px"
        controls="controls"
        id="video"
        autoplay="autoplay"
        loop="loop"
        :src="preViewUrl"
      ></video> -->
    </a-modal>
  </div>
</template>

<script>
import JEditor from '@/components/jeecg/JEditor'
import { modalFormConfig } from './config/modal.config'
import { learnApi } from '@/api/learn'
import { commonApi } from '@/api/common'
import { guid, getImgName } from '@/utils/util'
export default {
  components: {
    JEditor,
  },
  props: ['getData'],
  data() {
    return {
      //modalData
      ...modalFormConfig,
      confirmLoading: false,
      visible: false,
      title: '',
      //判断html还是其他
      getKey: '',
      //预览视频，照片
      previewVisible: false,
      previewVideoVisible: false,
      fileList: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        resType: [{ required: true, message: '请选择类型', trigger: 'change' }],
      },
      fileName: '',
      isJpg: '',
    }
  },
  mounted() {
    // console.log('getDatagetData', this.getData)
  },
  methods: {
    async add() {
      this.visible = true

      // this.reset()
    },
    async edit(index, record) {
      this.formData = { ...record }
      this.formData_copy = { ...record }
      this.title = '编辑'
      this.fileList = [
        {
          uid: '1',
          name: this.formData.name,
          status: 'done',
          url: this.formData.resUrl,
        },
      ]

      this.getKey = index
      if (this.formData.resUrl) {
        this.fileName = this.formData.resUrl.split('.')[this.formData.resUrl.split('.').length - 1]
      }
      this.fileName = this.fileName.toLowerCase()
      this.visible = true
    },
    async look(index, record) {
      this.visible = true
      this.formData = { ...record }
      this.title = '查看'
      this.fileList = []
      this.getKey = index

      if (this.formData.resUrl) {
        this.fileName = this.formData.resUrl.split('.')[this.formData.resUrl.split('.').length - 1]
      }
      const typeArr = ['jpeg', 'png', 'jpg', 'bmp', 'gif', 'tiff']
      this.fileName = this.fileName.toLowerCase()
      this.isJpg = typeArr.includes(this.fileName)
      console.log('isJpg', this.isJpg)
    },

    reset() {
      this.$refs.ruleForm ? this.$refs.ruleForm.clearValidate() : ''
      for (const key in this.formData) {
        this.formData[key] = ''
      }
      this.formData.resType = '0'
      this.formData.resUrl = ''
      this.fileList = []
    },
    async handlerCancel() {
      this.visible = false
      this.reset()
    },
    ok() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    async addModal() {
      this.formData.resType == '0' ? this.addHtml() : this.addOther()
    },
    async addOther() {
      if (this.fileList.length == 0) {
        this.$message.info('上传资源不能为空')
        return
      }
      this.confirmLoading = true

      let params = {
        name: this.formData.name,
        resType: this.formData.resType,
        descr: this.formData.descr,
        unitId: this.getData.key,
        content: this.formData.content,
        resUrl: this.fileList[0].url,
      }
      try {
        const res = await learnApi.addLearn(params)
        if (res.code == 200) {
          this.$message.success(res.data)
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
    async addHtml() {
      if (!this.formData.content) {
        this.$message.info('文字不能为空')
        return
      }
      this.confirmLoading = true
      let params = {
        name: this.formData.name,
        resType: this.formData.resType,
        descr: this.formData.descr,
        unitId: this.getData.key,
        content: this.formData.content,
      }
      try {
        const res = await learnApi.addLearn(params)
        if (res.code == 200) {
          this.$message.success(res.data)
          this.confirmLoading = false
          this.$emit('update')
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
      this.handlerCancel()
    },
    async editModal() {
      if (this.formData.resType == '0' && !this.formData.content) {
        this.$message.info('文字不能为空')
        return
      } else if (this.formData.resType == '1' && this.fileList.length == 0) {
        this.$message.info('上传资源不能为空')
        return
      }
      if (JSON.stringify(this.formData) != JSON.stringify(this.formData_copy)) {
        let params = {
          name: this.formData.name,
          resType: this.formData.resType,
          descr: this.formData.descr,
          unitId: this.getData.key,
          content: this.formData.content,
          resUrl: this.formData.resUrl,
          id: this.formData.id,
        }
        try {
          const res = await learnApi.updateLearn(params)
          if (res.code == 200) {
            this.$message.success(res.data)
            this.confirmLoading = false
            this.$emit('update')
          } else {
            this.$message.error(res.message)
          }
        } catch (e) {
          console.log('e')
        }
      }
      await this.handlerCancel()
      // this.confirmLoading = false
    },
    // 新增图片
    imgPreview() {
      // if (!this.fileName) {
      //   return
      // }
      if (this.formData.resUrl) {
        this.fileName = this.formData.resUrl.split('.')[this.formData.resUrl.split('.').length - 1]
      }
      this.fileName = this.fileName.toLowerCase()
      // console.log('this.fileName', this.fileName)
      const typeArr = ['jpeg', 'png', 'jpg', 'bmp', 'gif', 'tiff']
      this.isJpg = typeArr.includes(this.fileName)
      console.log('this.isJpg', this.isJpg)
      this.isJpg ? (this.previewVisible = true) : (this.previewVideoVisible = true)
    },
    imgChange({ fileList }) {
      this.fileList = fileList
      this.isImgChange = true
    },
    // 上传前验证
    beforeUpload(file) {
      const typeArr = [
        'image/jpeg',
        'image/jpg',
        'image/bmp',
        'image/png',
        'image/gif',
        'image/tiff',
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
        'audio/mpeg',
        'audio/ogg',
        'audio/wma',
        'audio/wav',
        'audio/ape',
      ]
      const photo = ['image/jpeg', 'image/png', 'image/bmp', 'image/jpg', 'image/gif', 'image/tiff']
      this.noPhoto = photo.includes(file.type)
      // console.log('file.type', file.type)
      const isJpgOrPng = typeArr.includes(file.type)
      if (!isJpgOrPng) {
        this.$message.error('只支持上传图片、音频或视频')
      }
      const isLt2M = file.size / 1024 / 1024 < 80
      if (!isLt2M) {
        this.$message.error('上传失败，文件大小不能超过80MB!')
      }
      // return isLt2M
      return isJpgOrPng && isLt2M
    },
    // upload
    async imgRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      try {
        let res = await commonApi.uploadserver(formData)

        let fileName = getImgName(res.data)
        fileName = fileName.toLowerCase()
        // console.log('sss', fileName)
        this.fileList = [
          {
            uid: guid(),
            name: fileName,
            status: 'done',
            url: res.data,
          },
        ]
        this.formData.resUrl = res.data
      } catch (err) {
        console.log(err)
      }
    },
    loadIframe() {
      var _iframe = window.document.getElementById('iFrameDiv')
      _iframe = _iframe.contentWindow || _iframe.contentDocument
      _iframe.postMessage({}, '*')
    },
    //类型change
    handleChange(value) {
      this.formData.resType = value
      this.fileList = []
      this.formData.content = ''
      this.formData.resUrl = ''
    },
  },
  watch: {},
}
</script>

<style>
.parser-wrapper img {
  max-width: 100% !important;
  /* object-fit: cover !important; */
}
.cImg {
  width: 100%;
  height: 100%;
}
</style>
