import { guid } from '@/utils/util'
export const contentTableConfig = {
  data: [
    {
      key: '1',
      name: '试题A',
      type: '0',
      type_2: '混合',
      content: '通常认为，代表整个地球的形状是（  ）所包围的形体？',
      fileList: [],
      chooseList: [
        { key: guid(), id: 'A', content: '水准面', selectKey: true },
        { key: guid(), id: 'B', content: '参考椭球面', selectKey: false },
        { key: guid(), id: 'C', content: '大地水准面', selectKey: false },
        { key: guid(), id: 'D', content: '似大地水准面', selectKey: false },
      ],
      lv: '1',
      analysis: '1、地球的水准面。',
      createTime: '2022-03-04 23:14:06',
      description: '暂无',
      true: 'A',
    },
    {
      key: '2',
      name: '试题B',
      type: '2',
      type_2: '混合',
      content: '地面上某一点到大地水准面的铅垂距离是该点的（  ）。',
      fileList: [],
      chooseList: [
        { key: guid(), id: 'A', content: '绝对高程', selectKey: false },
        { key: guid(), id: 'B', content: '相对高程', selectKey: false },
        { key: guid(), id: 'C', content: '正常高', selectKey: true },
        { key: guid(), id: 'D', content: '大地高', selectKey: false },
      ],
      lv: '2',
      analysis: '1、正常高。',
      createTime: '2022-03-02 05:20:33',
      description: '暂无',
      true: 'C',
    },
    {
      name: '试题C',
      key: '1-1-1',
      type: '1',
      type_2: '图片',
      content:
        '某日19时，杨某驾驶大客车，乘载57人（核载55人），连续行驶至次日凌晨1时，在金城江区境内050国道3008公里加110米处，因机动车左前胎爆裂，造成12人死亡、22人受伤的特大交通事故。杨某的主要违法行为是什么',
      fileList: [
        {
          uid: '1',
          name: 'jk',
          status: 'done',
          url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp9.itc.cn%2Fimages01%2F20210608%2F4564a35d2b164b07b88e0ad64b442e86.jpeg&refer=http%3A%2F%2Fp9.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648971167&t=e0d90f91e0226a74bf190217defaf9c2',
        },
      ],
      chooseList: [
        { key: guid(), id: 'A', content: '超速行驶', selectKey: true },
        { key: guid(), id: 'B', content: '不按规定会车', selectKey: true },
        { key: guid(), id: 'C', content: '疲劳驾驶', selectKey: false },
        { key: guid(), id: 'D', content: '不按规定使用灯光', selectKey: true },
      ],
      lv: '0',
      analysis:
        '1、城市道路上以90公里/小时的速度行驶，属于超速行驶；2、一直开启远光灯，属于不按规定使用灯光；3、加速抢道，属于不按规定会车。',
      createTime: '2022-03-02 05:20:33',
      description: '暂无',
      true: 'A 、B',
    },
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' },
    },
    // {
    //   title: '试题名称',
    //   dataIndex: 'name',
    // },
    {
      title: '题目内容',
      dataIndex: 'content',
      scopedSlots: { customRender: 'content' },
    },
    {
      title: '试题类型',
      dataIndex: 'quesType',
      scopedSlots: { customRender: 'quesType' },
    },
    {
      title: '类型',
      dataIndex: 'external',
      scopedSlots: { customRender: 'external' },
    },
    {
      title: '试题难度',
      dataIndex: 'difficulty',
      scopedSlots: { customRender: 'difficulty' },
    },
    {
      title: '描述',
      dataIndex: 'descr',
      scopedSlots: { customRender: 'descr' },
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
  page: '',
  pageSize: '',
  loading: false,
}
