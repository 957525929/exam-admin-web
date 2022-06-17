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
      type: 'input',
      label: '账号',
      name: 'account',
      required: true,
    },

    {
      type: 'input',
      label: '名称',
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
    //   type: 'input',
    //   label: '可分配账号',
    //   name: 'accountNum',
    // },
    {
      type: 'select',
      label: '所属学校',
      name: 'schoolId',
      required: true,
      option: [
        // {
        //   label: '永久',
        //   value: '永久',
        // },
        // {
        //   label: '自定义',
        //   value: '自定义',
        // },
      ],
    },
    // {
    //   type: 'picker',
    //   label: '有效期',
    //   format: 'YYYY-MM-DD',
    //   startTimeLabel: '开始时间',
    //   endTimeLabel: '结束时间',
    //   startTime: 'startTime',
    //   endTime: 'endTime',
    //   required: true,
    // },
    {
      type: 'rangePicker',
      label: '有效期',
      name: 'rangeTime',
      required: true,
    },
    // {
    //   type: 'slot',
    //   slotName: 'time',
    // },
  ],
  form_item_copy: [],
  formData: {
    account: '',
    number: '',
    name: '',
    phone: '',
    rangeTime: [],
    time: '自定义',
    schoolId: undefined,
    id: '',
  },
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
