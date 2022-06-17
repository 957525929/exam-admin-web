import { getAction, postAction, putAction, deleteAction } from '@/api/manage'

export const appUpload = {
    //获取最新
    loadData: (params) => {
      return getAction('/apk/getJustUpLoadApk', params)
    },
    //上传资源
    uploadApp: (params) => {
        return postAction('/api/upload/server', params)
    },
    //提交安装包记录
    uploadAppLog: (params) => {
        return postAction('/api/apk/submit', params)
    }
  }