export const contentTableConfig = {
  data: [
    {
      key: '1',
      name: '1+X',
      createTime: '2022-03-01 23:14:06',
      pathNode: '1',
    },
    {
      key: '2',
      name: '中职国赛',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1',
    },
    {
      name: '初级',
      key: '1-1-1',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-1',
    },
    {
      name: '中级',
      key: '1-1-2',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-1',
    },
    {
      name: '高级',
      key: '1-1-3',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-1',
    },
    {
      name: '建筑工程测量基础知识',
      key: '1-2-1',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
    {
      name: '角度测量',
      key: '1-2-2',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
    {
      name: '距离测量与直线定向',
      key: '1-2-3',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
    {
      name: '测量误差的基本知识',
      key: '1-2-4',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
    {
      name: '平面控制测量',
      key: '1-2-5',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
    {
      name: '地形图的基本知识',
      key: '1-2-6',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
    {
      name: '施工测量',
      key: '1-2-7',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
    {
      name: '全站仪测量',
      key: '1-2-8',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
    {
      name: '水准测量',
      key: '1-2-9',
      createTime: '2022-03-02 05:20:33',
      pathNode: '1-2',
    },
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' },
    },
    {
      title: '知识单元名称',
      dataIndex: 'unitName',
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
  loading: false,
}
