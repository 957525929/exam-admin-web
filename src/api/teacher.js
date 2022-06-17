import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import qs from 'qs'
export const teacherApi = {
  //获取所有教师列表
  getTeacherList: (params) => {
    return getAction('/api/teacher/getTeacherBySearch', params)
  },
  //添加教师
  addTeacher: (params) => {
    return postAction('/api/teacher', params)
  },
  //修改老师
  updateTeacher: (params) => {
    return putAction('/api/teacher', params)
  },
  //删除老师
  deleteTeacher: (params) => {
    return deleteAction('/api/teacher' + params)
  },
  //禁启用老师
  disableTeacher: (params) => {
    return postAction(`/api/account/disable/${params.id}?status=${params.status}`)
  },
}
