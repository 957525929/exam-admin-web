<template>
  <div>
    <a-card>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="公司信息配置">
          <div style="width: 40%">
            <page-form ref="form" :formItem="form_item" :formHandler="form_handler" :formData="queryParam"
              :labelCol="labelCol" :wrapperCol="wrapperCol" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="出题配置" force-render>
          <div style="width: 40%">
            <page-form ref="form" :formItem="form_item_num" :formHandler="form_handler_num" :formData="queryParam_num"
              :labelCol="labelCol" :wrapperCol="wrapperCol" />
          </div>
        </a-tab-pane>
      </a-tabs>
      <!-- 查询功能 -->
    </a-card>
  </div>
</template>

<script>
  import {
    editDateForSearch
  } from '@/utils/util'
  import pageForm from '@/components/page-form'
  import {
    contentTableConfig
  } from './config/content.config'
  import {
    getAction
  } from '@/api/manage'
  import {
    systemApi
  } from '@/api/system'

  export default {
    components: {
      pageForm,
    },
    beforeMount() {
      this.loadComponyData()
      this.loadExamData()
    },
    data() {
      return {
        // 表单
        ...contentTableConfig,
        form_handler: [{
            type: 'primary',
            label: '提交',
            key: 'submit',
            loading: this.loading,
            handler: () => this.searchCompanyData(),
          },
          {
            label: '重置',
            key: 'reset',
            loading: this.loading,
            handler: () => this.resetCompony(),
          },
        ],
        form_handler_num: [{
          type: 'primary',
          label: '提交',
          key: 'submit',
          loading: this.loading,
          handler: () => this.searchExamData(),
        },
        {
          label: '重置',
          key: 'reset',
          loading: this.loading,
          handler: () => this.resetConfig(),
        }],
      }
    },
    methods: {
      loadComponyData() {
        getAction('/configItem/getCompanyConfig').then(res => {
          if (res.code == 200) {
            this.queryParam = res.data
          }
        })
      },
      loadExamData() {
        getAction('/api/configItem/getConfigItem').then(res => {
          if (res.code == 200) {
            this.queryParam_num = res.data
          }
        })
      },
      handleSubmit(e) {
        // 验证时间段是否正确
        let time = {
          startTime: this.formInline.startTime,
          endTime: this.formInline.endTime,
        }
        let isTimeTrue = editDateForSearch(time)
        if (!isTimeTrue) {
          this.$message.error('开始时间不能晚于结束时间！')
          return
        }
      },
      searchCompanyData() {
        this.loading = true
        systemApi
          .updateCompanyConfig(this.queryParam)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('修改成功')
              this.loadExamData()
            } else {
              this.$message.error(res.message)
              return false
            }
            this.loading = false
          })
          .catch((err) => {
            this.$message.error(err.message)
            this.loading = false
          })
      },
      searchExamData() {
        this.loading = true
        systemApi
          .updateConfigItem(this.queryParam_num)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('修改成功')
              this.loadComponyData()
            } else {
              this.$message.error(res.message)
              return false
            }
            this.loading = false
          })
          .catch((err) => {
            this.$message.error(err.message)
            this.loading = false
          })
      },
      resetCompony() {
        this.queryParam.message = ''
        this.queryParam.phone = ''
        this.queryParam.url = ''
      },
      resetConfig() {
        this.queryParam_num.randExamQuesCount = ''
        this.queryParam_num.randExamTime = ''
        this.queryParam_num.selfExamQuesCount = ''
        this.queryParam_num.selfExamTime = ''
        this.queryParam_num.selfTrainQuesCount = ''
        this.queryParam_num.sortTrainQuesCount = ''
      },
      reset() {
        this.$refs.search.resetForm()
      },
    },
  }
</script>

<style lang="less" scoped></style>