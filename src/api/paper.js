import { getAction, postAction, putAction, deleteAction } from '@/api/manage'

export const paperApi = {
  //试卷列表
  loadpaperList: (params) => {
    return postAction('/api/paper', params)
  },
  //添加试卷
  addPaper: (params) => {
    return postAction('/api/paper', params)
  },
  //修改试卷
  updatePaper: (params) => putAction('/api/paper', params),
  //删除试卷
  deletePaper: (params) => {
    return deleteAction('/api/paper/' + params)
  },
  //添加试卷关联
  addPaperRelate: (params) => {
    return postAction('/api/paper/class', params)
  },
  //更新试卷关联
  updatePaperRelate: (params) => {
    return putAction('/api/paper/class', params)
  },
  //查看试卷
  lookPaperQues: (params) => {
    return getAction('/api/paperQues/' + params)
  },
}
