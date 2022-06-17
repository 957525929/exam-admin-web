<template>
  <div>
    <a-card class="content-search">
    <div class="button-wrap">
        <a-button class="btn" @click="addRandom">随机</a-button>
        <a-button class="btn" @click="addPreview">预览</a-button>
        <a-button class="btn" type="primary" @click="save">保存</a-button>
      </div>
      <div style="height: 100px">
        <page-form ref="pageForm" :formItem="form_item" :formData="formData" :labelCol="labelCol"
          :wrapperCol="wrapperCol" formLayout="inline" />
      </div>
<!--      <div style="display: flex; justify-content: flex-end; margin: 10px;">-->
<!--        <a-button class="btn" @click="addRandom">随机</a-button>-->
<!--        <a-button class="btn" @click="addPreview">预览</a-button>-->
<!--        <a-button class="btn" type="primary" @click="save">保存</a-button>-->
<!--      </div>-->
      <a-row :gutter="16" style="margin-top: 10px">
        <a-col :span="6" style="text-align: center">
          <a-statistic title="单选" :value="typeList.radio" style="margin-right: 50px"></a-statistic>
        </a-col>
        <a-col :span="6" style="text-align: center">
          <a-statistic title="判断" :value="typeList.judge" class="demo-class"> </a-statistic>
        </a-col>
        <a-col :span="6" style="text-align: center">
          <a-statistic title="多选" :value="typeList.checkbox" class="demo-class"> </a-statistic>
        </a-col>
        <a-col :span="6" style="text-align: center">
          <a-statistic title="合计" :value="typeList.total" class="demo-class"> </a-statistic>
        </a-col>
      </a-row>
    </a-card>
    <div class="ele-page">
      <div class="left-card">
        <a-tooltip placement="left">
          <template slot="title">
            <span>点击刷新</span>
          </template>
          <a-icon class="icon" type="redo" @click="reload" />
        </a-tooltip>
        <!-- 左侧树 -->
        <a-card style="height: 100%; overflow: auto">
          <a-tree style="height: 100%" :tree-data="treeData" :defaultExpandedKeys="[1]" :defaultSelectedKeys="[1]">
            <template slot="custom" slot-scope="item">
              <div style="width: 100%" @click="getItem(item)">
                {{ item.title }}
              </div>
            </template>
          </a-tree>
        </a-card>
      </div>
      <!-- 右侧 -->
      <div class="right-card">
        <a-card style="height: 100%; overflow: auto">
          <a-alert message="请点击左侧菜单,显示详细数据" banner closable />
          <br />
          <test-resource v-if="selectKey" ref="testResource" :quesIdList="quesIdList" :getData="getData" @updateState="updateState"
            @updateGetData="updateGetData" @changeOptional="changeOptional" />
        </a-card>
      </div>
    </div>
    <random-modal ref="randomModal" :optionalList="optionalList" :quesCount="formData.quesCount" />
    <preview-modal :optionalList="optionalList" ref="previewModal"></preview-modal>
  </div>
</template>

<script>
  import testResource from './testResource/index.vue'
  import pageForm from '@/components/page-form'
  import randomModal from './randomModal/randomModal'
  import previewModal from './previewModal/previewModal'
  import {
    formConfig
  } from './config/form.config'
  import {
    tree
  } from './config/base_tree'
  import {
    konwApi
  } from '@/api/know.js'
  import {
    treeData
  } from '../../eleManage/data/tree'
  import {
    paperApi
  } from '@/api/paper'

  export default {
    inject: ['reload'],
    components: {
      testResource,
      pageForm,
      randomModal,
      previewModal
    },
    watch: {
      paperId(newVal) {
        newVal && this.loadPaper(newVal)
      }
    },
    mounted() {
      for (const key in this.formData) {
        this.formData[key] = undefined
      }
      for (const key in this.typeList) {
        this.typeList[key] = undefined
      }
      this.loadData()

      this.paperId = this.$route.params.id
      this.paperId ? (this.$route.meta.title = '编辑试卷') : (this.$route.meta.title = '新增试卷')
    },
    data() {
      return {
        ...formConfig,

        treeData: [{
          title: '知识单元',
          name: '知识单元',
          key: 1,
          parentId: 0,
          scopedSlots: {
            title: 'custom'
          },
          children: []
        }, ],
        selectKey: '',
        getData: '',
        typeList: {
          radio: 0, //单选
          judge: 0, //判断
          checkbox: 0, //多选
          total: 0, //合计
        },
        tree,
        previewList: [],
        optionalList: [],
        paperId: '',
        quesIdList: [],
        formData_copy: [],
      }
    },

    methods: {
      //打开随机弹窗
      addRandom() {
        this.$refs.randomModal.showModal()
      },
      addPreview() {
        this.$refs.previewModal.showModal()
      },
      changeOptional(value) {
        this.optionalList = value
      },
      loadData() {
        const params = {
          count: true,
        }
        konwApi
          .getKnowList(params)
          .then((res) => {
            if (res.code == 200) {
              const data = this.handlerTreeData(res.data.children)
              this.treeData[0].children = data
              this.getItem(this.treeData[0])
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      async loadPaper(newVal) {
        const res = await paperApi.lookPaperQues(newVal)
        if (res && res.code == 200) {
          for (const key in this.formData) {
            if (res.data[key]) {
              this.formData[key] = res.data[key]
            }
          }
          this.formData_copy = JSON.parse(JSON.stringify(this.formData))
          this.quesIdList = res.data.questionDTOS
          this.quseList = res.data.questionDTOS
          // console.log('this.quseList ', this.quseList)
          this.updateState(res.data.questionDTOS)
        }
      },
      handlerTreeData(data) {
        return data.map((item) => {
          if (item.children != 0) {
            return {
              title: item.name,
              name: item.name,
              key: item.unitId,
              parentId: item.parentId,
              children: this.handlerTreeData(item.children),
              scopedSlots: {
                title: 'custom'
              },
            }
          } else {
            return {
              title: item.name,
              name: item.name,
              key: item.unitId,
              parentId: item.parentId,
              children: item.children,
              scopedSlots: {
                title: 'custom'
              },
            }
          }
        })
      },
      // 获取所点击树的内容
      getItem(v) {
        this.selectKey = v.key
        this.getData = v
        this.$refs.testResource.changeCurrent()
        if (v) {
          this.$store.commit('CHANGE_GETDATA', v)
        }
      },
      //统计数值的回调
      updateState(value) {
        const radioData = value.filter((item) => item.quesType == 1).length
        const checkBoxData = value.filter((item) => item.quesType == 2).length
        const judgeData = value.filter((item) => item.quesType == 3).length
        // const { radioData, judgeData, checkBoxData } = value
        this.typeList.radio = radioData
        this.typeList.judge = judgeData
        this.typeList.checkbox = checkBoxData
        this.typeList.total = this.typeList.radio + this.typeList.judge + this.typeList.checkbox
        // console.log('typeList', this.typeList)
        // this.treeData[0].title = this.treeData[0].name + '（' + value.length + '）'
        this.quseList = value
        console.log(this.quseList)
        // this.changePreviewList()
      },
      // changePreviewList() {
      //   //筛选在quseList没有而optionalList里有的项,并删除
      //   let ignoreOptionlList = []
      //   this.optionalList.forEach((ele, index) => {
      //     let isHave = this.quseList.some((item) => {
      //       if(ele.quesId == item.quesId) return true
      //     })
      //     if(!isHave) ignoreOptionlList.push(ele.quesId)
      //   })
      //   ignoreOptionlList.forEach(item => {
      //     this.optionalList.forEach((ele, index) => {
      //       if(ele.quesId = item) this.optionalList.splice(index, 1)
      //     })
      //   })
      //   //随机题目数据
      //   let randomData = this.$store.state.preview.randomData
      //   let randomDataCopy = []
      //   //记录随机题目与选中重合的题目
      //   this.quseList.forEach(item => {
      //     let isHave = this.optionalList.some(ele => ele.quesId == item.quesId)
      //     randomData.forEach(ele => {
      //       if(ele.quesId == item.quesId) {
      //         randomDataCopy.push(ele)
      //         isHave = true
      //       }
      //     })
      //     console.log(isHave)
      //     if (!isHave) {
      //       this.optionalList.push({
      //         ...item,
      //         knowledge: this.$store.state.preview.getData.name
      //       })
      //     }
      //   })
      //   console.log(this.optionalList, '_____________')
      //   this.optionalList.map(item => {
      //     if (!item.knowledge) item.knowledge = this.$store.state.preview.getData.name
      //   })
      //   this.$store.commit('CHANGE_RANDOM_DATA', randomDataCopy)
      // },
      //当前选择的总数回调
      updateGetData(value) {
        console.log('value', this.getData)
        this.getData.total = value.length
        // if (this.getData.key != 1) {
        //   this.getData.title = this.getData.name + '（' + value.length + '）'
        // }
      },
      //递归改父节点的值
      handlerData(params) {
        return params.map((item) => {
          item = Object.assign({}, item)
          if (item.key == key) {
            let sonTotalNum = 0
            item.children.map((item) => item.total && (sonTotalNum += item.total))
            item.total = sonTotalNum
            item.title = item.name + '（' + sonTotalNum + '）'
          } else if (item.children) {
            item.children = this.handlerData(item.children, key)
          }
          return item
        })
      },
      save() {
        this.$refs.pageForm.$refs.formRef.validate((valid) => {
          if (valid) {
            !this.paperId ? this.addPapers() : this.updatePapers()
          }
        })
      },
      judgeCondition() {
        if (this.quseList.length == 0) {
          this.$message.info('所选试题不能为空')
          return
        } else if (this.quseList.length != this.formData.quesCount) {
          this.$message.info('所选试题与出题数不符')
          return
        } else {
          let quesId = this.quseList.map((item) => item.quesId)
          return quesId
        }
      },
      async addPapers() {
        const quesId = this.judgeCondition()
        if (!quesId) {
          return
        }
        const params = {
          paperName: this.formData.paperName,
          quesCount: this.formData.quesCount,
          totalScore: this.formData.totalScore,
          examTime: this.formData.examTime,
          questions: quesId,
        }
        const res = await paperApi.addPaper(params)
        if (res && res.code == 200) {
          this.$message.success('新增成功')
          this.$router.push({
            name: 'examMange-examList',
            params: {
              isAdd: true,
              fromExam: true
            },
          })
        }
      },
      async updatePapers() {
        const quesId = this.judgeCondition()
        if (!quesId) {
          return
        }
        const params = {
          paperName: this.formData.paperName,
          quesCount: this.formData.quesCount,
          totalScore: this.formData.totalScore,
          examTime: this.formData.examTime,
          questions: quesId,
          paperId: this.paperId,
        }
        if (
          JSON.stringify(this.formData_copy) == JSON.stringify(this.formData) &&
          JSON.stringify(quesId) == JSON.stringify(this.quesIdList.map((item) => item.quesId))
        ) {
          this.$router.push({
            name: 'examMange-examList',
            params: {
              isAdd: true,
              fromExam: true
            },
          })
          return
        }
        const res = await paperApi.updatePaper(params)
        if (res && res.code == 200) {
          this.$message.success('更新成功')
          this.$router.push({
            name: 'examMange-examList',
            params: {
              isAdd: true,
              fromExam: true
            },
          })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .content-search {
    position: relative;
  }

  .button-wrap {
    position: absolute;
    right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn {
      margin: 0 6px;
    }
  }

  .ele-page {
    display: flex;
    justify-content: center;
    height: 70vh;
  }

  .left-card {
    position: relative;
    flex: 1;
  }

  .icon {
    position: absolute;
    right: 20px;
    top: 30px;
    z-index: 999;
    font-size: 20px;
    color: #08c;
  }

  .icon:hover {
    color: orange;
  }

  .right-card {
    flex: 3;
  }
</style>
<style lang="less">
  .tip_style {
    .ant-tooltip-inner {
      background-color: grey !important;
    }

    .ant-tooltip-arrow::before {
      background-color: grey !important;
    }
  }
</style>