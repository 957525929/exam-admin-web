export const searchFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '所属学校',
      name: 'schoolId',
      style: 'width:200px',
      option: [],
    },
    {
      type: 'select',
      label: '负责教师',
      name: 'teacherId',
      style: 'width:200px',
      option: [],
    },
    {
      type: 'input',
      label: '班级名称',
      name: 'classNameLk',
    },
    // {
    //   type: 'input',
    //   label: '学生数',
    //   name: 'studentCount'
    // },
    {
      label: '年份',
      name: 'year',
      type: 'slot',
      slotName: 'year',
    },
    {
      type: 'picker',
      label: '时间',
      format: 'YYYY-MM-DD',
      startTimeLabel: '开始时间',
      endTimeLabel: '结束时间',
      startTime: 'beginTime',
      endTime: 'endTime',
    },
  ],
  form_data: {
    beginTime: null,
    endTime: null,
    year: null,
    // studentCount: '',
    classNameLk: '',
    schoolId: ' ',
    teacherId: ' ',
    id: '',
  },
  form_data_copy: {
    beginTime: null,
    endTime: null,
    year: null,
    // studentCount: '',
    classNameLk: '',
    schoolId: ' ',
    teacherId: ' ',
    id: '',
  },
  formLayout: 'inline',
}
