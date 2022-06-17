export const formConfig = {
  form_item: [
    {
      type: 'input',
      label: '试卷名称',
      name: 'paperName',
      required: true,
    },
    {
      type: 'inputNumber',
      label: '总分',
      name: 'totalScore',
      style: 'width:110px',
      min: 1,
      max: 300,
      required: true,
    },
    {
      type: 'inputNumber',
      label: '出题数',
      name: 'quesCount',
      style: 'width:110px',
      min: 1,
      max: 300,
      required: true,
    },
    {
      type: 'inputNumber',
      label: '考试时间（分）',
      name: 'examTime',
      style: 'width:125px',
      min: 1,
      max: 300,
      required: true,
      // unit: '分',
    },
  ],
  formData: {
    paperName: '',
    quesCount: undefined,
    totalScore: undefined,
    examTime: undefined,
  },
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
}
