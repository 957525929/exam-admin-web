import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import qs from 'qs'
export const studentApi = {
  //获取所有学生列表
  getStudentList: (params) => {
    return getAction('/api/student', params)
  },
  //添加学生
  addStudent: (params) => {
    return postAction('/api/student', params)
  },
  //修改学生
  updateStudent: (params) => {
    return putAction('/api/student', params)
  },
  //删除学生
  deleteStudent: (params) => {
    return deleteAction('/api/teacher' + params)
  },
  //导入学生
  importStudent: (params) => {
    return postAction('/api/student/import', params)
  },
  //禁启用学生
  disableStudent: (params) => {
    return postAction(`/api/account/disable/${params.id}?status=${params.status}`)
  },
}
