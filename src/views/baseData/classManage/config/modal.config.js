export const modalFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '所属学校',
      name: 'school',
      style: 'width:280px',
      required: true,
      option: [
        {
          label: '校区A',
          value: '1',
        },
        {
          label: '校区B',
          value: '2',
        },
        {
          label: '校区C',
          value: '3',
        },
      ],
    },
    {
      type: 'select',
      label: '负责教师',
      required: true,
      name: 'teacher',
      style: 'width:280px',
      option: [
        {
          label: '吴勇',
          value: '1',
        },
        {
          label: '倪友聪',
          value: '2',
        },
      ],
    },
    {
      type: 'input',
      label: '班级名称',
      required: true,
      name: 'name',
    },
    {
      label: '年份',
      required: true,
      name: 'year',
      type: 'slot',
      slotName: 'year',
    },
    {
      type: 'inputselect',
      label: '指定试卷',
      name: 'exam',
      style: 'width:280px',
      mode: 'multiple',
      option: [
        {
          label: '试卷一',
          value: '1',
        },
        {
          label: '试卷二',
          value: '2',
        },
        {
          label: '试卷三',
          value: '3',
        },
      ],
    },
    {
      type: 'input',
      label: '账号前缀',
      name: 'accountFront',
      placeholder: '请输入学校简称+年份+班级',
      required: true,
      key: 'create',
    },
    {
      type: 'inputNumber',
      label: '账号数量',
      name: 'account',
      style: 'width:200px',
      required: true,
      key: 'create',
      min: 1,
      max: 999,
    },
    {
      type: 'rangePicker',
      label: '有效期',
      name: 'rangeTime',
      required: true,
    },
    {
      type: 'slot',
      slotName: 'time',
      key: 'create',
    },
  ],
  formData: {
    name: '',
    id: '',
    year: undefined,
    school: undefined,
    teacher: undefined,
    rangeTime: [],
    exam: [],
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
