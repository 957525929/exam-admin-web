import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import qs from 'qs'
export const questionApi = {
  //添加题目
  addQues: (params) => {
    return postAction('/api/question', params)
  },
  //修改题目
  updateQues: (params) => putAction('/api/question', params),
  //查看题目
  lookQues: (params) => {
    return getAction('/api/question/' + params)
  },
  //导入题目
  batchQues: (params) => {
    return postAction('/api/question/batch', params)
  },
  //资源上传
  upload: (params) => postAction('/api/upload', params),
  //添加题目资源
  addResource: (params) => postAction('/api/question/resource', params),
  //删除题目资源
  deleteResource: (params) => deleteAction('/api/question/resource/' + params),
}
