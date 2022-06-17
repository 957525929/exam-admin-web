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
      label: '所属学校',
      name: 'schoolId',
      option: [],
      required: true,
    },
    {
      type: 'select',
      label: '负责教师',
      name: 'teacherId',
      option: [],
      required: true,
    },
    {
      type: 'select',
      label: '所属班级',
      name: 'classId',
      option: [],
      required: true,
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
      name: 'studentNumber',
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
      required: true,
      validator: [{ required: true, validator: validatePass, trigger: 'change' }],
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
    //   type: 'picker',
    //   label: '有效期',
    //   format: 'YYYY-MM-DD',
    //   startTimeLabel: '开始时间',
    //   endTimeLabel: '结束时间',
    //   startTime: 'startTime',
    //   endTime: 'endTime',
    // },
    // {
    //   type: 'rangePicker',
    //   label: '有效期',
    //   name: 'rangeTime',
    //   required: true,
    // },
    // {
    //   type: 'slot',
    //   slotName: 'banner',
    //   // style: 'width:300px',
    //   // change: () => this.handlerChange(),
    // },
  ],
  form_item_copy: [],
  formData: {
    account: '',
    studentNumber: '',
    name: '',
    phone: '',
    classId: undefined,
    schoolId: undefined,
    teacherId: undefined,
    schoolName: '',
    className: '',
    teacherName: '',
    id: '',
    rangeTime: [],
    // startValidDate: undefined,
    // endValidDate: undefined,
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
