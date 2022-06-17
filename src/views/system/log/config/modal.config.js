export const modalFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '所属校区',
      name: 'school',
      style: 'width:280px',
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
      type: 'input',
      label: '班级名称',
      name: 'name',
    },
    {
      type: 'input',
      label: '年份',
      name: 'year',
    },
  ],
  formData: {
    name: '',
    year: '',
    school: undefined,
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
