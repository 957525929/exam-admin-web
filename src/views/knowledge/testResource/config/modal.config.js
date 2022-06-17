import { guid } from '@/utils/util'
export const modalFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '试题类型',
      name: 'quesType',
      required: true,
      option: [
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
      label: '类型',
      name: 'external',
      required: true,
      option: [
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
      type: 'textarea',
      label: '描述',
      name: 'descr',
      // required: true,
    },
    {
      type: 'textarea',
      label: '试题内容',
      name: 'content',
      required: true,
      rows: '5',
    },
    {
      type: 'slot',
      label: '试题内容图片',
      slotName: 'imgcontent',
    },
    {
      type: 'slot',
      slotName: 'quesOption',
      display: 'none',
    },
    {
      type: 'select',
      label: '试题难度',
      name: 'difficulty',
      required: true,
      option: [
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
      type: 'textarea',
      label: '试题解析',
      name: 'analysis',
      // required: true,
      rows: '5',
    },
    {
      type: 'slot',
      label: '试题解析图片',
      slotName: 'imgAnalysis',
    },
  ],
  formData: {
    quesType: 1,
    external: 1,
    difficulty: undefined,
    descr: '',
    content: '',
    lv: '',
    analysis: '',
    answer: '',
    quesId: '',
    chooseList: [
      {
        id: guid(),
        selectKey: false,
        value: '',
        name: 'A',
      },
      {
        id: guid(),
        selectKey: false,
        value: '',
        name: 'B',
      },
    ],
    fileList: [],
    contentImg: [],
    analysisImg: [],
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
