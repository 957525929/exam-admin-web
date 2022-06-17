export const searchFormConfig = {
  form_item: [
    // {
    //   type: 'select',
    //   label: '操作类型',
    //   name: 'type',
    //   style: 'width:200px',
    //   option: [
    //     {
    //       label: '全部',
    //       value: '',
    //     },
    //     {
    //       label: '校区管理',
    //       value: '1',
    //     },
    //     {
    //       label: '班级管理',
    //       value: '2',
    //     },
    //     {
    //       label: '学生管理',
    //       value: '3',
    //     },
    //     {
    //       label: '知识单元管理',
    //       value: '4',
    //     },
    //     {
    //       label: '新增试卷',
    //       value: '5',
    //     },
    //     {
    //       label: '试卷列表',
    //       value: '6',
    //     },
    //     {
    //       label: '教师管理',
    //       value: '7',
    //     },
    //     {
    //       label: '学生管理',
    //       value: '8',
    //     },
    //   ],
    // },
    {
      type: 'input',
      label: '账号',
      name: 'account',
    },
    // {
    //   type: 'input',
    //   label: '姓名',
    //   name: 'name',
    // },
    {
      type: 'picker',
      label: '时间',
      format: 'YYYY-MM-DD',
      startTimeLabel: '开始时间',
      endTimeLabel: '结束时间',
      startTime: 'beginTime',
      endTime: 'endTime',
    },
  ],
  form_data: {
    beginTime: null,
    endTime: null,
    // name: '',
    account: '',
    // type: '',
  },
  formLayout: 'inline',
}
