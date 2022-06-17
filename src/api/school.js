import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import qs from 'qs'
export const schoolApi = {
  //查询学校分页
  getSchoolList: (params) => {
    return getAction('/api/school/paging', params)
  },
  //添加学校
  addSchool: (params) => {
    return postAction('/api/school', params)
  },
  //修改学校
  updateSchool: (params) => putAction('/api/school', params),
  //删除学校
  deletSchool: (params) => {
    return deleteAction('/api/school/' + params)
  },
  //重置密码
  resetPwd: (params) => {
    return postAction('/managerweb/ManagerController/resetPwd', params)
  },
}
