export const contentTableConfig = {
  data: [
    {
      key: '1',
      name: '基坑监测',
      type: 'html',
      createTime: '2022-03-01 23:14:06',
      resUrl:
        'http://fzzt.fzjhdn.com:7777/czsftp/2021-11/eaeca1d3-bb76-70f3-70bb-4185feb59372/1637939646-jzwjkjcgs.html',
      resContent:
        "<html><head><meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'><meta http-equiv='content-type' content='text/html;charset=utf-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><meta content='always' name='referrer'><title></title><style type='text/css'>body{background:rgba(255,255,255,0.0);color: white !important;font-size: 3rem}</style></head><body id='iframeBody'><div style='width: 90%; margin: 10px auto;'><p class='MsoNormal'><span style='font-family: 宋体;'>基坑监测是基坑工程施工中的一个重要环节，是指在基坑开挖及地下工程施工过程中，对基坑岩土性状、支护结构变位和周围环境条件的变化，进行各种观察及分析工作，并将监测结果及时反馈，预测进一步施工后将导致的变形及稳定状态的发展</span><span style='font-family: Times New Roman;'>,</span><span style='font-family: 宋体;'>根据预测判定施工对周围环境造成影响的程度，来指导设计与施工，实现所谓信息化施工。主要包括：支护结构、相关自然环境、施工工况、地下水状况、基坑底部及周围土体、周围建（构）筑物、周围地下管线及地下设施、周围重要的道路、其它应监测的对象。测结果及时反馈，预测进一步施工后将导致的变形及稳定状态的发展</span><span style='font-family: Times New Roman;'>,</span><span style='font-family: 宋体;'>根据预测判定施工对周围环境造成影响的程度，来指导设计与施工，实现所谓信息化施工。主要包括：支护结构、相关自然环境、施工工况、地下水状况、基坑底部及周围土体、周围建（构）筑物、周围地下管线及地下设施、周围重要的道路、其它应监测的对象!&nbsp;&nbsp;</span></p></div></body></html><script>window.addEventListener('message',function(event){document.getElementById('iframeBody').style.backgroundColor = '#4FB9EB';document.getElementById('iframeBody').style.fontSize = '1rem';})</script>",
      description: '暂无',
    },
    // {
    //   key: '2',
    //   name: '基础知识',
    //   type: 'html',
    //   createTime: '2022-03-02 05:20:33',
    //   resUrl: '1',
    // },
    {
      name: '基坑监测照片',
      key: '1-1-1',
      type: 'nohtml',
      createTime: '2022-03-02 05:20:33',
      resUrl:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.gszjkcy.com%2Fuploads%2Fallimg%2F20190407%2Ffc92e67fdfbfc5559644b5b7a2a0cf74.jpg&refer=http%3A%2F%2Fwww.gszjkcy.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648952079&t=bf42487cb8bff4a0f2a9a9a869d600a4',
      description: '暂无',
    },
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' },
    },
    {
      title: '资源名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      scopedSlots: { customRender: 'type' },
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
}
