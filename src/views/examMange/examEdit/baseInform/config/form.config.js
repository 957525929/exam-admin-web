export const formConfig = {
  form_item: [
    {
      type: 'input',
      label: '试卷名称',
      name: 'name',
    },
    {
      type: 'input',
      label: '总分',
      name: 'total',
    },
    {
      type: 'input',
      label: '出题数',
      name: 'num',
    },
    {
      type: 'inputNumber',
      label: '考试时间（分）',
      name: 'self2',
      style: 'width:150px',
      min: 1,
      max: 300,
      // unit: '分',
    },
  ],
  formData: {
    name: '',
    year: '',
    num: '',
    school: undefined,
  },
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
