export const contentTableConfig = {
  data: [
    {
      key: '1',
      name: '2022级班级A',
      school: '校区A',
      studentNum: '30',
      year: '2022',
      exam: ['3'],
      teacher: '吴勇',
      createTime: '2022-03-01 23:14:06',
      time: '2022-03-01~2022-03-08',
    },
    {
      key: '2',
      name: '2022级班级B',
      school: '校区B',
      studentNum: '59',
      year: '2022',
      exam: ['1'],
      teacher: '倪友聪',
      createTime: '2022-03-02 05:20:33',
    },
    {
      key: '3',
      name: '2022级班级C',
      school: '校区B',
      studentNum: '30',
      year: '2022',
      exam: ['1'],
      teacher: '吴勇',
      createTime: '2022-03-02 08:45:00',
    },
    {
      key: '4',
      name: '2021级班级D',
      school: '校区D',
      studentNum: '54',
      year: '2021',
      exam: ['2'],
      teacher: '倪友聪',
      createTime: '2022-03-02 14:29:56',
    },
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' },
    },
    {
      title: '班级名称',
      dataIndex: 'name',
    },
    {
      title: '所属学校',
      dataIndex: 'schoolName',
    },
    {
      title: '负责教师',
      dataIndex: 'teacherName',
    },
    {
      title: '年份',
      dataIndex: 'year',
    },
    {
      title: '学生数',
      dataIndex: 'studentNum',
    },
    {
      title: '指定试卷',
      dataIndex: 'exam',
      scopedSlots: { customRender: 'exam' },
    },
    {
      title: '有效期',
      dataIndex: 'time',
      scopedSlots: { customRender: 'time' },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      scopedSlots: { customRender: 'createTime' },
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ],
}
