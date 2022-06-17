export const searchFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '试题类型',
      name: 'type',
      style: 'width:200px',
      option: [
        {
          label: '全部',
          value: ' ',
        },
        {
          label: '单选',
          value: '1',
        },
        {
          label: '判断',
          value: '2',
        },
        {
          label: '多选',
          value: '3',
        },
      ],
    },
    {
      type: 'select',
      label: '试题难度',
      name: 'lv',
      style: 'width:200px',
      option: [
        {
          label: '全部',
          value: ' ',
        },
        {
          label: '难',
          value: '1',
        },
        {
          label: '中',
          value: '2',
        },
        {
          label: '易',
          value: '3',
        },
      ],
    },
    {
      type: 'select',
      label: '类型',
      name: 'type_2',
      style: 'width:200px',
      option: [
        {
          label: '全部',
          value: ' ',
        },
        {
          label: '文字',
          value: '文字',
        },
        {
          label: '混合',
          value: '混合',
        },
      ],
    },
    {
      type: 'input',
      label: '试题内容',
      name: 'name',
    },
  ],
  queryParam: {
    startTime: null,
    endTime: null,
    name: '',
    type: ' ',
    lv: ' ',
  },
  formLayout: 'inline',
}
