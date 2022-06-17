export const searchFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '试题类型',
      name: 'quesType',
      style: 'width:200px',
      option: [
        {
          label: '全部',
          value: ' ',
        },
        {
          label: '单选',
          value: 1,
        },
        {
          label: '多选',
          value: 2,
        },
        {
          label: '判断',
          value: 3,
        },
      ],
    },
    {
      type: 'select',
      label: '试题难度',
      name: 'difficulty',
      style: 'width:200px',
      option: [
        {
          label: '全部',
          value: ' ',
        },
        {
          label: '易',
          value: 1,
        },
        {
          label: '中',
          value: 2,
        },
        {
          label: '难',
          value: 3,
        },
      ],
    },
    {
      type: 'select',
      label: '类型',
      name: 'external',
      style: 'width:200px',
      option: [
        {
          label: '全部',
          value: ' ',
        },
        {
          label: '文字',
          value: 0,
        },
        {
          label: '混合',
          value: 1,
        },
      ],
    },
    {
      type: 'input',
      label: '试题内容',
      name: 'content',
    },
  ],
  form_data: {
    beginTime: null,
    endTime: null,
    content: '',
    quesType: ' ',
    difficulty: ' ',
    type_2: ' ',
  },
  formLayout: 'inline',
}
