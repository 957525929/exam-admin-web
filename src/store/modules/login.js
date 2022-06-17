export const loginMock = {
  success: true,
  message: '登录成功',
  code: 200,
  result: {
    multi_depart: 1,
    userInfo: {
      id: 'e9ca23d68d884d4ebb19d07889727dae',
      account: 'admin',
      name: '管理员',
      avatar: 'temp/f2-1_1591257744991.png',
      birthday: '2018-12-05',
      sex: 1,
      email: '11@qq.com',
      phone: '18566666661',
      orgCode: 'A01',
      status: 1,
      delFlag: 0,
      workNo: '111',
      post: '',
      telephone: null,
      createBy: null,
      createTime: '2038-06-21 17:54:10',
      updateBy: 'admin',
      updateTime: '2020-06-04 16:02:28',
      activitiSync: 1,
      userIdentity: 1,
      departIds: '',
      thirdId: null,
      thirdType: null,
    },
    sysAllDictItems: {
      ol_form_biz_type: [
        { value: 'demo', text: '官方示例', title: '官方示例' },
        { value: 'bpm', text: '流程表单', title: '流程表单' },
        { value: 'temp', text: '测试表单', title: '测试表单' },
        { value: 'bdfl_include', text: '导入表单', title: '导入表单' },
      ],
      x_receipt_type: [
        { value: '101', text: '销售预收款', title: '销售预收款' },
        { value: '102', text: '销售收款', title: '销售收款' },
        { value: '199', text: '其他收款', title: '其他收款' },
      ],
      x_stock_io_type: [
        { value: '101', text: '采购入库', title: '采购入库' },
        { value: '1011', text: '采购入库-红字', title: '采购入库-红字' },
        { value: '102', text: '盘盈入库', title: '盘盈入库' },
        { value: '191', text: '涨库入库', title: '涨库入库' },
        { value: '199', text: '其他入库', title: '其他入库' },
        { value: '201', text: '销售出库', title: '销售出库' },
        { value: '2011', text: '销售出库-红字', title: '销售出库-红字' },
        { value: '202', text: '盘亏出库', title: '盘亏出库' },
        { value: '299', text: '其他出库', title: '其他出库' },
        { value: '301', text: '仓库调拨', title: '仓库调拨' },
        { value: '801', text: '成本调整', title: '成本调整' },
      ],
      x_payable_type: [
        { value: '202', text: '采购应付', title: '采购应付' },
        { value: '299', text: '其他应付', title: '其他应付' },
      ],
      position_rank: [
        { value: '1', text: '员级', title: '员级' },
        { value: '2', text: '助级', title: '助级' },
        { value: '3', text: '中级', title: '中级' },
        { value: '4', text: '副高级', title: '副高级' },
        { value: '5', text: '正高级', title: '正高级' },
      ],
      customer_category: [],
      rule_conditions: [
        { value: '>', text: '大于', title: '大于' },
        { value: '<', text: '小于', title: '小于' },
        { value: '!=', text: '不等于', title: '不等于' },
        { value: '=', text: '等于', title: '等于' },
        { value: '>=', text: '大于等于', title: '大于等于' },
        { value: '<=', text: '小于等于', title: '小于等于' },
        { value: 'LEFT_LIKE', text: '左模糊', title: '左模糊' },
        { value: 'RIGHT_LIKE', text: '右模糊', title: '右模糊' },
        { value: 'LIKE', text: '模糊', title: '模糊' },
        { value: 'IN', text: '包含', title: '包含' },
        { value: 'USE_SQL_RULES', text: '自定义SQL表达式', title: '自定义SQL表达式' },
      ],
      x_bill_type: [
        { value: 'stk_io_bill..101', text: '采购入库单', title: '采购入库单' },
        { value: 'stk_io_bill..201', text: '销售出库单', title: '销售出库单' },
        { value: 'fin_payable', text: '应付单', title: '应付单' },
        { value: 'fin_payment..201', text: '采购预付单', title: '采购预付单' },
        { value: 'fin_payment..202', text: '采购付款单', title: '采购付款单' },
      ],
      x_payable_check_type: [{ value: '201', text: '付款核应付', title: '付款核应付' }],
      online_graph_data_type: [
        { value: 'sql', text: 'SQL', title: 'SQL' },
        { value: 'json', text: 'JSON', title: 'JSON' },
      ],
      online_graph_display_template: [
        { value: 'tab', text: 'Tab风格', title: 'Tab风格' },
        { value: 'single', text: '单排布局', title: '单排布局' },
        { value: 'double', text: '双排布局', title: '双排布局' },
        { value: 'combination', text: '组合布局', title: '组合布局' },
      ],
      x_rp_check_type: [
        { value: '101', text: '收款核应收', title: '收款核应收' },
        { value: '201', text: '付款核应付', title: '付款核应付' },
      ],
      x_invoice_type: [
        { value: '11', text: '普通发票', title: '普通发票' },
        { value: '12', text: '专用发票', title: '专用发票' },
        { value: '13', text: '专用增值税发票', title: '专用增值税发票' },
        { value: '21', text: '收据', title: '收据' },
        { value: '99', text: '其他', title: '其他' },
      ],
      x_receivable_check_type: [{ value: '101', text: '收款核应收', title: '收款核应收' }],
      del_flag: [
        { value: '1', text: '已删除', title: '已删除' },
        { value: '0', text: '正常', title: '正常' },
      ],
      x_settle_method: [
        { value: '11', text: '现金', title: '现金' },
        { value: '21', text: '银行汇款', title: '银行汇款' },
      ],
      cgform_table_type: [
        { value: '1', text: '单表', title: '单表' },
        { value: '2', text: '主表', title: '主表' },
        { value: '3', text: '附表', title: '附表' },
      ],
      msg_category: [
        { value: '1', text: '通知公告', title: '通知公告' },
        { value: '2', text: '系统消息', title: '系统消息' },
      ],
      org_category: [
        { value: '3', text: '岗位', title: '岗位' },
        { value: '1', text: '公司', title: '公司' },
        { value: '2', text: '部门', title: '部门' },
      ],
      priority: [
        { value: 'H', text: '高', title: '高' },
        { value: 'M', text: '中', title: '中' },
        { value: 'L', text: '低', title: '低' },
      ],
      dict_item_status: [
        { value: '1', text: '启用', title: '启用' },
        { value: '0', text: '不启用', title: '不启用' },
      ],
      activiti_sync: [
        { value: '1', text: '同步', title: '同步' },
        { value: '0', text: '不同步', title: '不同步' },
      ],
      msgSendStatus: [
        { value: '0', text: '未发送', title: '未发送' },
        { value: '1', text: '发送成功', title: '发送成功' },
        { value: '2', text: '发送失败', title: '发送失败' },
      ],
      msg_type: [
        { value: 'USER', text: '指定用户', title: '指定用户' },
        { value: 'ALL', text: '全体用户', title: '全体用户' },
      ],
      eoa_plan_type: [
        { value: '1', text: '日常记录', title: '日常记录' },
        { value: '2', text: '本周工作', title: '本周工作' },
        { value: '3', text: '下周计划', title: '下周计划' },
      ],
      msgType: [
        { value: '4', text: '系统', title: '系统' },
        { value: '1', text: '短信', title: '短信' },
        { value: '2', text: '邮件', title: '邮件' },
        { value: '3', text: '微信', title: '微信' },
      ],
      eoa_plan_status: [
        { value: '0', text: '未开始', title: '未开始' },
        { value: '1', text: '进行中', title: '进行中' },
        { value: '2', text: '已完成', title: '已完成' },
      ],
      x_supplier_level: [
        { value: '1', text: '一级', title: '一级' },
        { value: '2', text: '二级', title: '二级' },
      ],
      x_payment_type: [
        { value: '201', text: '采购预付款', title: '采购预付款' },
        { value: '202', text: '采购付款', title: '采购付款' },
        { value: '299', text: '其他付款', title: '其他付款' },
      ],
      database_type: [
        { value: '1', text: 'MySQL', title: 'MySQL' },
        { value: '2', text: 'Oracle', title: 'Oracle' },
        { value: '3', text: 'SQLServer', title: 'SQLServer' },
      ],
      log_type: [
        { value: '2', text: '操作日志', title: '操作日志' },
        { value: '1', text: '登录日志', title: '登录日志' },
      ],
      send_status: [
        { value: '0', text: '未发布', title: '未发布' },
        { value: '1', text: '已发布', title: '已发布' },
        { value: '2', text: '已撤销', title: '已撤销' },
      ],
      x_receivable_type: [
        { value: '102', text: '销售应收', title: '销售应收' },
        { value: '199', text: '其他应收', title: '其他应收' },
      ],
      eoa_cms_menu_type: [
        { value: '1', text: '列表', title: '列表' },
        { value: '2', text: '链接', title: '链接' },
      ],
      bpm_process_type: [
        { value: 'test', text: '测试流程', title: '测试流程' },
        { value: 'oa', text: 'OA办公', title: 'OA办公' },
        { value: 'business', text: '业务办理', title: '业务办理' },
      ],
      form_perms_type: [
        { value: '1', text: '可见(未授权不可见)', title: '可见(未授权不可见)' },
        { value: '2', text: '可编辑(未授权禁用)', title: '可编辑(未授权禁用)' },
      ],
      valid_status: [
        { value: '0', text: '无效', title: '无效' },
        { value: '1', text: '有效', title: '有效' },
      ],
      urgent_level: [
        { value: '1', text: '一般', title: '一般' },
        { value: '2', text: '重要', title: '重要' },
        { value: '3', text: '紧急', title: '紧急' },
      ],
      user_status: [
        { value: '1', text: '正常', title: '正常' },
        { value: '2', text: '冻结', title: '冻结' },
      ],
      operate_type: [
        { value: '1', text: '查询', title: '查询' },
        { value: '2', text: '添加', title: '添加' },
        { value: '3', text: '修改', title: '修改' },
        { value: '4', text: '删除', title: '删除' },
        { value: '5', text: '导入', title: '导入' },
        { value: '6', text: '导出', title: '导出' },
      ],
      quartz_status: [
        { value: '0', text: '正常', title: '正常' },
        { value: '-1', text: '停止', title: '停止' },
      ],
      menu_type: [
        { value: '2', text: '按钮权限', title: '按钮权限' },
        { value: '1', text: '子菜单', title: '子菜单' },
        { value: '0', text: '一级菜单', title: '一级菜单' },
      ],
      sex: [
        { value: '1', text: '男', title: '男' },
        { value: '2', text: '女', title: '女' },
      ],
      tax_scale: [],
      supplier_category: [],
      perms_type: [
        { value: '1', text: '显示', title: '显示' },
        { value: '2', text: '禁用', title: '禁用' },
      ],
      global_perms_type: [
        { value: '1', text: '可见/可访问(授权后可见/可访问)', title: '可见/可访问(授权后可见/可访问)' },
        { value: '2', text: '可编辑(未授权时禁用)', title: '可编辑(未授权时禁用)' },
      ],
      x_rp_type: [
        { value: '1', text: '应收', title: '应收' },
        { value: '2', text: '应付', title: '应付' },
      ],
      online_graph_type: [
        { value: 'bar', text: '柱状图', title: '柱状图' },
        { value: 'line', text: '曲线图', title: '曲线图' },
        { value: 'pie', text: '饼图', title: '饼图' },
        { value: 'table', text: '数据列表', title: '数据列表' },
      ],
      x_bill_proc_status: [
        { value: '1', text: '编制', title: '编制' },
        { value: '12', text: '编制中', title: '编制中' },
        { value: '13', text: '编制完成', title: '编制完成' },
        { value: '2', text: '审核', title: '审核' },
        { value: '21', text: '审核开始', title: '审核开始' },
        { value: '22', text: '审核中', title: '审核中' },
        { value: '23', text: '审核完成', title: '审核完成' },
        { value: '3', text: '执行', title: '执行' },
        { value: '32', text: '执行中', title: '执行中' },
        { value: '33', text: '执行完成', title: '执行完成' },
      ],
      x_customer_level: [
        { value: '1', text: '一级', title: '一级' },
        { value: '2', text: '二级', title: '二级' },
      ],
      bpm_status: [
        { value: '1', text: '待提交', title: '待提交' },
        { value: '2', text: '处理中', title: '处理中' },
        { value: '3', text: '已完成', title: '已完成' },
        { value: '4', text: '已作废', title: '已作废' },
      ],
      x_tax_scale: [{ value: '1', text: '一般纳税人', title: '一般纳税人' }],
      depart_status: [
        { value: '0', text: '不启用', title: '不启用' },
        { value: '1', text: '启用', title: '启用' },
      ],
    },
    departs: [
      {
        id: 'c6d7cb4deeac411cb3384b1b31278596',
        parentId: '',
        departName: '北京国炬公司',
        departNameEn: null,
        departNameAbbr: null,
        departOrder: 0,
        description: null,
        orgCategory: '1',
        orgType: '1',
        orgCode: 'A01',
        mobile: null,
        fax: null,
        address: null,
        memo: null,
        status: null,
        delFlag: '0',
        createBy: 'admin',
        createTime: '2019-02-11 14:21:51',
        updateBy: 'admin',
        updateTime: '2019-03-22 16:47:19',
      },
    ],
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzQ4MDIyOTgsInVzZXJuYW1lIjoiYWRtaW4ifQ.uG-Lj8cyaW5dieRGeEuCy3CSeQ17rNb-EEkODIs9xfE',
  },
  timestamp: 1634800498738,
}
