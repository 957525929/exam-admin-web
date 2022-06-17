export const searchFormConfig = {
  form_item: [
    {
      type: 'input',
      label: '资源名称',
      name: 'resourceName',
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
    beginTime: undefined,
    endTime: undefined,
    resourceName: undefined,
  },
  formLayout: 'inline',
}
