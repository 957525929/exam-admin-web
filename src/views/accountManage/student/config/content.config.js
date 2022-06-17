import { formatDate } from '@/utils/util'
import moment from 'moment'
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
      teacher: '教师A',
      hasRight: 0,
      createTime: '2022-03-01 23:14:06',
      startTime: moment(formatDate('2022-03-01', 'yyyy-MM-dd')),
      endTime: moment(formatDate('2022-03-08', 'yyyy-MM-dd')),
      time: '永久',
    },
    {
      key: '2',
      account: 'studentb',
      name: '学生B',
      number: '172031226',
      phone: '18350556744',
      school: '校区A',
      class: '2022-A班',
      teacher: '教师A',
      hasRight: 1,
      createTime: '2022-03-02 05:20:33',
      startTime: moment(formatDate('2022-03-01', 'yyyy-MM-dd')),
      endTime: moment(formatDate('2022-03-08', 'yyyy-MM-dd')),
      time: '2022-03-01~2022-03-08',
    },
    {
      key: '3',
      account: 'studentc',
      name: '学生C',
      number: '172031227',
      phone: '18352346744',
      school: '校区A',
      class: '2022-A班',
      teacher: '教师B',
      hasRight: 1,
      createTime: '2022-03-02 08:45:00',
      startTime: moment(formatDate('2022-03-01', 'yyyy-MM-dd')),
      endTime: moment(formatDate('2022-03-08', 'yyyy-MM-dd')),
      time: '2022-03-01~2022-03-08',
    },
    {
      key: '4',
      account: 'studentd',
      name: '学生D',
      number: '172031228',
      phone: '1835033344',
      school: '校区A',
      class: '2022-A班',
      teacher: '教师c',
      hasRight: 0,
      createTime: '2022-03-02 14:29:56',
      startTime: moment(formatDate('2022-03-01', 'yyyy-MM-dd')),
      endTime: moment(formatDate('2022-03-08', 'yyyy-MM-dd')),
      time: '2022-03-01~2022-03-08',
    },
    {
      key: '5',
      account: 'studente',
      name: '学生E',
      number: '172031227',
      phone: '18352346744',
      school: '校区A',
      class: '2022-E班',
      teacher: '教师C',
      hasRight: 1,
      createTime: '2022-03-02 08:45:00',
      startTime: moment(formatDate('2022-03-01', 'yyyy-MM-dd')),
      endTime: moment(formatDate('2022-03-08', 'yyyy-MM-dd')),
      time: '2022-03-01~2022-03-08',
    },
    {
      key: '6',
      account: 'studentf',
      name: '学生F',
      number: '172031228',
      phone: '1835033344',
      school: '校区A',
      class: '2022-A班',
      teacher: '教师F',
      hasRight: 0,
      createTime: '2022-03-02 14:29:56',
      startTime: moment(formatDate('2022-03-01', 'yyyy-MM-dd')),
      endTime: moment(formatDate('2022-03-08', 'yyyy-MM-dd')),
      time: '2022-03-01~2022-03-08',
    },
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' },
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '学生名称',
      dataIndex: 'name',
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
    },
    {
      title: '所属学校',
      dataIndex: 'schoolName',
    },
    {
      title: '所属班级',
      dataIndex: 'className',
    },
    {
      title: '负责教师',
      dataIndex: 'teacherName',
    },
    {
      title: '禁启用',
      dataIndex: 'hasRight',
      scopedSlots: { customRender: 'hasRight' },
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