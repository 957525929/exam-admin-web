export const searchFormConfig = {
  form_item: [
    {
      type: 'select',
      label: '所属学校',
      name: 'schoolIdEQ',
      style: 'width:200px',
      option: [],
    },
    {
      type: 'select',
      label: '负责教师',
      name: 'teacherIdEQ',
      style: 'width:200px',
      option: [],
    },
    {
      type: 'select',
      label: '所属班级',
      name: 'classIdEQ',
      style: 'width:200px',
      option: [],
    },

    {
      type: 'input',
      label: '学生名称',
      name: 'nameLk',
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
    nameLk: '',
    schoolIdEQ: ' ',
    classIdEQ: ' ',
    teacherIdEQ: ' ',
  },
  formLayout: 'inline',
}
