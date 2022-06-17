const preview = {
    state: {
        optionalRowKeys: [],
        selectionRowsPlus: [],
        selectedRows: [],
        randomData: [],
        getData: {name: '知识单元'},
        isPre: false
    },
    mutations: {
        //剩下的id数组
        CHANGE_ROWKEYS: (state, record) => {
            state.optionalRowKeys = record
        },
        //剩下的表格数据
        CHANGE_SELECTION: (state, record) => {
            state.selectionRowsPlus = record
        },
        //操作相应的数据
        CHANGE_SELECTED: (state, record) => {
            state.selectedRows = record
        },
        CHANGE_GETDATA: (state, record) => {
            state.getData = record
        },
        //随机数据
        CHANGE_RANDOM_DATA: (state, record) => {
            state.randomData = record
        },
        CHANGE_PRE: (state, record) => {
            state.isPre = record
        }
    }
}
export default preview