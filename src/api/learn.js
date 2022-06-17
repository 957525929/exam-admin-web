import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import qs from 'qs'
export const learnApi = {
  //添加学习资源
  addLearn: (params) => {
    return postAction('/api/learnResource', params)
  },
  //修改学习资源
  updateLearn: (params) => putAction('/api/learnResource', params),
  //删除学习资源
  deletLearn: (params) => {
    return deleteAction('/api/learnResource/' + params)
  },
  //资源上传
  upload: (params) => postAction('/api/upload', params),
}
