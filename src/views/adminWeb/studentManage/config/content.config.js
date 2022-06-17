export const contentTableConfig = {
  data: [
    {
      key: '1',
      account: 'studenta',
      name: '学生A',
      number: '172031225',
      phone: '18350076744',
      school: '校区A',
      class: '2022-A班',
      teacher: '张天',
      createTime: '2022-03-01 23:14:06'
    },
    {
      key: '2',
      account: 'studentb',
      name: '学生B',
      number: '172031226',
      phone: '18350556744',
      school: '校区A',
      class: '2022-A班',
      teacher: '张天',
      createTime: '2022-03-02 05:20:33'
    },
    {
      key: '3',
      account: 'studentc',
      name: '学生C',
      number: '172031227',
      phone: '18352346744',
      school: '校区A',
      class: '2022-A班',
      teacher: '张天',
      createTime: '2022-03-02 08:45:00'
    },
    {
      key: '4',
      account: 'studentd',
      name: '学生D',
      number: '172031228',
      phone: '1835033344',
      school: '校区A',
      class: '2022-A班',
      teacher: '张天',
      createTime: '2022-03-02 14:29:56'
    }
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' }
    },
    {
      title: '账号',
      dataIndex: 'account'
    },
    {
      title: '学生名称',
      dataIndex: 'name'
    },
    {
      title: '学号',
      dataIndex: 'number'
    },
    {
      title: '电话号码',
      dataIndex: 'phone'
    },
    {
      title: '所属校区',
      dataIndex: 'school'
    },
    {
      title: '所属班级',
      dataIndex: 'class'
    },
    {
      title: '所属教师',
      dataIndex: 'teacher'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
}
