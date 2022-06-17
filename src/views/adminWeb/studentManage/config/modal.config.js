export const modalFormConfig = {
  form_item: [
    {
      type: 'input',
      label: '账号',
      name: 'account',
    },
    {
      type: 'input',
      label: '学号',
      name: 'number',
    },
    {
      type: 'input',
      label: '学生名称',
      name: 'name',
    },
    {
      type: 'input',
      label: '电话号码',
      name: 'phone',
    },
  ],
  formData: {
    account: '',
    number: '',
    name: '',
    phone: '',
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
