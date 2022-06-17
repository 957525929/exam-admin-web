export const searchFormConfig = {
  form_item: [
    // {
    //   type: 'select',
    //   label: '所属校区',
    //   name: 'school',
    //   style: 'width:200px',
    //   option: [
    //     {
    //       label: '全部',
    //       value: ' '
    //     },
    //     {
    //       label: '校区A',
    //       value: '1'
    //     },
    //     {
    //       label: '校区B',
    //       value: '2'
    //     },
    //     {
    //       label: '校区C',
    //       value: '3'
    //     }
    //   ]
    // },
    // {
    //   type: 'select',
    //   label: '所属班级',
    //   name: 'class',
    //   style: 'width:200px',
    //   option: [
    //     {
    //       label: '全部',
    //       value: ' '
    //     },
    //     {
    //       label: '2022级A班',
    //       value: '1'
    //     },
    //     {
    //       label: '2022级B班',
    //       value: '2'
    //     },
    //     {
    //       label: '2022级c班',
    //       value: '3'
    //     }
    //   ]
    // },
    // {
    //   type: 'select',
    //   label: '负责教师',
    //   name: 'teacher',
    //   style: 'width:200px',
    //   option: [
    //     {
    //       label: '全部',
    //       value: ' '
    //     },
    //     {
    //       label: '教师A',
    //       value: '1'
    //     },
    //     {
    //       label: '教师B',
    //       value: '2'
    //     },
    //     {
    //       label: '教师C',
    //       value: '3'
    //     }
    //   ]
    // },
    {
      type: 'input',
      label: '学生名称',
      name: 'nameLk'
    },
    {
      type: 'picker',
      label: '时间',
      format: 'YYYY-MM-DD',
      startTimeLabel: '开始时间',
      endTimeLabel: '结束时间',
      startTime: 'startTime',
      endTime: 'endTime'
    }
  ],
  form_data: {
    startTime: null,
    endTime: null,
    nameLk: '',
    class: ' ',
    school: ' ',
    teacher: ' '
  },
  formLayout: 'inline'
}
