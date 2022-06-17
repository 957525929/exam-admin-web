export const modalFormConfig = {
  form_item: [
    {
      type: 'input',
      label: '省份',
      style: 'width:200px',
      name: 'province',
      required: true,
    },
    {
      type: 'input',
      label: '学校名称',
      name: 'schoolName',
      required: true,
    },
  ],
  formData: {
    schoolName: '',
    province: ''
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
