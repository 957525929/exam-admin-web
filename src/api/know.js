import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import qs from 'qs'
export const konwApi = {
  //获取知识单元树
  getKnowList: (params) => {
    return getAction('/api/knowlUnit', params)
  },
  //分页查询知识单元
  getKnowPaging: (params) => {
    return getAction('/api/knowlUnit/paging', params)
  },
  //添加知识单元
  addKnow: (params) => {
    return postAction('/api/knowlUnit', params)
  },
  //修改知识单元
  updateKnow: (params) => putAction('/api/knowlUnit', params),
  //删除知识单元
  deletKnow: (params) => {
    return deleteAction('/api/knowlUnit/' + params)
  },
}
