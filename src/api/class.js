import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import qs from 'qs'
export const classApi = {
  //获取所有班级列表
  getClassList: (params) => {
    return getAction('/api/learnClass', params)
  },
  //添加班级
  addClass: (params) => {
    return postAction('/api/learnClass', params)
  },
  //修改班级
  updateClass: (params) => {
    return putAction('/api/learnClass', params)
  },
  //删除班级
  deleteClass: (params) => {
    return deleteAction('/api/learnClass' + params)
  },
  //生成账号
  addAccount: (params) => {
    return postAction('/api/learnClass/addAccount', params)
  },
  //导入班级
  importClass: (params) => {
    return postAction('/api/learnClass/import', params)
  },
}
