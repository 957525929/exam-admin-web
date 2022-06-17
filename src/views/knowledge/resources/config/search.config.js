export const searchFormConfig = {
  form_item: [
    {
      type: 'input',
      label: '知识名称',
      name: 'nameLk',
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
    nameLk: undefined,
    parentId: undefined,
  },

  formLayout: 'inline',
}
