export const searchFormConfig = {
  form_item: [
    {
      type: 'input',
      label: '省份',
      style: 'width:200px',
      name: 'province',
    },
    {
      type: 'input',
      label: '学校名称',
      name: 'schoolNameLK',
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
  // form_data: {
  //   beginTime: null,
  //   endTime: null,
  //   province: '',
  //   schoolNameLK: '',
  // },
  // form_item_copy: [
  //   {
  //     type: 'input',
  //     label: '学校名称',
  //     name: 'schoolNameLK',
  //   },
  //   {
  //     type: 'input',
  //     label: '省份',
  //     style: 'width:200px',
  //     name: 'province',
  //   },
  //   {
  //     type: 'picker',
  //     label: '时间',
  //     format: 'YYYY-MM-DD',
  //     startTimeLabel: '开始时间',
  //     endTimeLabel: '结束时间',
  //     startTime: 'beginTime',
  //     endTime: 'endTime',
  //   },
  // ],
  // form_data_copy: {
  //   beginTime: null,
  //   endTime: null,
  //   province: '',
  //   schoolNameLK: '',
  // },
  formLayout: 'inline',
}
