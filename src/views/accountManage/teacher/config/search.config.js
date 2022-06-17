export const searchFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '所属学校',
      name: 'schoolId',
      style: 'width:200px',
      option: [
        // {
        //   label: '全部',
        //   value: ' ',
        // },
        // {
        //   label: '校区A',
        //   value: '1',
        // },
        // {
        //   label: '校区B',
        //   value: '2',
        // },
        // {
        //   label: '校区C',
        //   value: '3',
        // },
      ],
    },
    {
      type: 'input',
      label: '账号',
      name: 'account',
    },
    {
      type: 'input',
      label: '名称',
      name: 'teacherNameLk',
    },
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
    account: '',
    teacherNameLk: '',
    schoolId: ' ',
  },
  formLayout: 'inline',
}
