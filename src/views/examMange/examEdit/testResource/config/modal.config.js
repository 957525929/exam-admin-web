export const modalFormConfig = {
  form_item: [
    {
      type: 'input',
      label: '试题名称',
      name: 'name',
    },
  ],
  formData: {
    name: '',
    type: undefined,
    content: '',
    lv: '',
    analysis: '',
    chooseList: [],
    fileList: [],
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
