export const searchFormConfig = {
  form_item: [
    {
      type: 'input',
      label: '班级名称',
      name: 'name',
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
      startTime: 'startTime',
      endTime: 'endTime',
    },
  ],
  queryParam: {
    startTime: null,
    endTime: null,
    name: '',
  },
  formLayout: 'inline',
}
