export const searchFormConfig = {
  form_item: [
    {
      type: 'input',
      label: '试卷名称',
      name: 'paperNameLk',
    },
    {
      type: 'input',
      label: '出卷人',
      name: 'nameLk',
    },
    // {
    //   type: 'input',
    //   label: '年份',
    //   name: 'year',
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
    paperNameLk: '',
    nameLk: '',
  },
  formLayout: 'inline',
}
