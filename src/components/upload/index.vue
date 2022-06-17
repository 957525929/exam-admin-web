<template>
  <div>
    <a-upload
      list-type="picture-card"
      :file-list="fileList"
      @preview="imgPreview"
      @change="imgChange"
      :before-upload="beforeUpload"
      :customRequest="imgRequest"
    >
      <div>
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <a-modal :visible="deleteVisible" @ok="handleDeleteOk" @cancel="handleDeleteCancel">
      <div style="color: red">是否确定删除该图片（此操作不可撤销！！！）</div>
    </a-modal>
  </div>
</template>

<script>
import { commonApi } from '@/api/common'
import { questionApi } from '@/api/question'
import { getImgName } from '@/utils/util'
import { guid } from '@/utils/util'
export default {
  props: ['tid', 'value', 'importfileList', 'quesId', 'getKey', 'title'],
  data() {
    return {
      previewVisible: false,
      deleteVisible: false,
      fileList: [],
      previewImage: '',
      uid: '',
    }
  },
  mounted() {},
  watch: {
    tid: {
      handler() {
        this.fileList = []
      },
      immediate: true,
    },
    importfileList: {
      handler(newVal) {
        if (newVal && newVal.length != 0) {
          this.fileList = newVal
        }
      },
      immediate: true,
    },
  },
  methods: {
    // loadFileList(newVal) {
    //   console.log('newVal', newVal)
    //   let fileName = getImgName(res.data)
    //   let fileData = {
    //     uid: guid(),
    //     name: fileName,
    //     status: 'done',
    //     url: res.data,
    //   }
    //   this.fileList.push(fileData)
    // },
    async imgPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleCancel() {
      this.previewVisible = false
    },
    imgChange({ file }) {
      if (file.status == 'removed') {
        if (this.value == 'add') {
          this.fileList = this.fileList.filter((item) => item.uid != file.uid)
        } else if (this.value == 'edit') {
          this.deleteVisible = true
          this.uid = file.uid
        }
      }
    },
    // 上传前验证
    beforeUpload(file) {
      console.log('file', file)
      const typeArr = [
        'image/jpeg',
        'image/jpg',
        'image/bmp',
        'image/png',
        'image/gif',
        'image/tiff',
        // 'video/AVI',
        // 'video/mov',
        // 'video/rmvb',
        // 'video/rm',
        // 'video/FLV',
        // 'video/mp4',
        // 'video/3GP',
        // 'video/mpg',
        // 'video/mpe',
        // 'video/mpeg',
        // 'video/m2v',
      ]
      const photo = ['image/jpeg', 'image/png', 'image/bmp', 'image/jpg', 'image/gif', 'image/tiff']
      this.noPhoto = photo.includes(file.type)
      // console.log('file.type', file.type)
      const isJpgOrPng = typeArr.includes(file.type)
      if (!isJpgOrPng) {
        this.$message.error('只支持上传图片')
      }
      const isLt2M = file.size / 1024 / 1024 < 80
      if (!isLt2M) {
        this.$message.error('上传失败，图片或视频大小不能超过80MB!')
      }
      return isJpgOrPng && isLt2M
    },
    // upload
    async imgRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('tid', this.tid)
      try {
        let res = {}
        this.title == '新增'
          ? (res = await commonApi.uploadlocal(formData))
          : (res = await commonApi.uploadserver(formData))

        if (res.code == 200) {
          let fileName = getImgName(res.data)
          let fileData = {
            uid: guid(),
            name: fileName,
            status: 'done',
            url: res.data,
          }
          if (this.value == 'add') {
            this.fileList.push(fileData)
          } else {
            this.uploadImg(fileData)
          }
        }

        // console.log('this.preViewUrl', this.preViewUrl)
      } catch (err) {
        console.log(err)
      }
    },
    async uploadImg(fileData) {
      // this.fileList.push(fileData)
      const params = {
        quesId: this.quesId,
        type: this.getKey == 'content' ? '0' : '1',
        url: fileData.url,
      }
      console.log('getKey', params) //试题资源：0，解析资源：1

      try {
        const res = await questionApi.addResource(params)
        if (res.code == 200) {
          this.$message.success('新增成功')
          this.fileList.push(fileData)
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async handleDeleteOk() {
      console.log('quesId', this.quesId)
      if (!this.uid) {
        return
      }
      if (this.title == '新增') {
        this.fileList = this.fileList.filter((item) => item.uid != this.uid)
      } else {
        try {
          const res = await questionApi.deleteResource(this.uid)
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.fileList = this.fileList.filter((item) => item.uid != this.uid)
          } else {
            this.$message.error(res.message)
          }
        } catch (e) {
          console.log(e)
        }
      }

      this.deleteVisible = false
    },
    handleDeleteCancel() {
      this.deleteVisible = false
    },
  },
}
</script>

<style></style>
