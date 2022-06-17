import { isMobile } from '@/utils/validate.js'
let validatePass = (rule, value, callback) => {
  if (!value) {
    console.log('value', value)
    callback(new Error('请输入电话号码'))
  } else if (!isMobile(value)) {
    console.log('value', value)
    callback(new Error('请输入正确的电话号码格式'))
  } else {
    callback()
  }
}
export const modalFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '所属校区',
      name: 'schoolId',
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
      label: '所属班级',
      name: 'classId',
      required: true,
      option: [
        {
          label: '2022级A班',
          value: '1',
        },
        {
          label: '2022级B班',
          value: '2',
        },
        {
          label: '2022级c班',
          value: '3',
        },
      ],
    },
    {
      type: 'select',
      label: '负责教师',
      name: 'teacherId',
      required: true,
      option: [
        {
          label: '教师A',
          value: '1',
        },
        {
          label: '教师B',
          value: '2',
        },
        {
          label: '教师C',
          value: '3',
        },
      ],
    },
    {
      type: 'input',
      label: '账号',
      name: 'account',
      required: true,
    },
    {
      type: 'input',
      label: '学号',
      name: 'number',
      required: true,
    },
    {
      type: 'input',
      label: '学生名称',
      name: 'name',
      required: true,
    },
    {
      type: 'input',
      label: '电话号码',
      name: 'phone',
      // required: true,
      validator: [{ required: true, validator: validatePass, trigger: 'change' }]
    },
    // {
    //   type: 'select',
    //   label: '有效期',
    //   name: 'time',
    //   option: [
    //     {
    //       label: '永久',
    //       value: '永久',
    //     },
    //     {
    //       label: '自定义',
    //       value: '自定义',
    //     },
    //   ],
    // },
    // {
    //   type: 'slot',
    //   slotName: 'time',
    // },
    // {
    //   type: 'rangePicker',
    //   label: '有效期',
    //   name: 'rangeTime',
    //   required: true,
    // },
  ],
  formData: {
    account: '',
    number: '',
    name: '',
    phone: '',
    classId: undefined,
    schoolId: undefined,
    startTime: undefined,
    endTime: undefined,
    teacherId: undefined,
    rangeTime: undefined,
    schoolName: '',
    className: '',
    teacherName: '',
    time: '自定义',
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
