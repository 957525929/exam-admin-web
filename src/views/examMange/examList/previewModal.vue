<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="40%" :footer="null">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
        <span>试卷名称：{{ formData.paperName }}</span>
        <span>总分：{{ formData.totalScore }}</span>
        <span>出题数：{{ formData.quesCount }}</span>
        <span>考试时间（分）：{{ formData.examTime }}</span>
      </div>
      <!-- <div style="height: 800px"> -->
      <div v-if="quesList.length > 0" class="content">
        <div class="optionContent">
          <div v-for="(item, index) in quesList" :key="item.quesId" style="margin-bottom: 5px">
            <div class="top">
              <span class="type"> {{ item.quesType == 1 ? '单选' : item.quesType == 2 ? '多选' : '判断' }}</span>
              <span style="font-size: 15px; font-weight: 700; margin-right: 3px"> {{ index + 1 }}、</span>
              <span class="title" id="content">{{ item.content }}</span>
            </div>
            <div class="bottom">
              <div
                v-if="
                  item.resources && item.resources.filter((item) => item.type == '0').length > 0 && item.external == 1
                "
              >
                <div
                  class="picture"
                  v-for="picture in item.resources.filter((item) => item.type == '0')"
                  :key="picture.url"
                >
                  <img :src="picture.url" />
                </div>
              </div>

              <div class="content">
                <div style="margin-top: 20px" class="option" v-for="option in item.optionS" :key="option.id">
                  <span class="indexBox"> {{ option.name }}</span>
                  <span class="indexTitle"> {{ option.value }}</span>
                  <!-- <img v-if="item.selectKey" src="@/assets/success.png" width="20px" height="20px" style="z-index: 999" /> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </a-modal>
  </div>
</template>

<script>
import pageSearch from '@/components/page-form'
import { guid } from '@/utils/util'
import { modalConfig } from './config/modal.cofig'
import { paperApi } from '@/api/paper'
export default {
  components: {
    pageSearch,
  },
  data() {
    return {
      ...modalConfig,
      visible: false,
      title: '',
      getData: null,
      rowData: undefined,
      contentImg: [],
      analysisImg: [],
      quesList: [],
    }
  },
  mounted() {},
  methods: {
    //uid
    guid,

    async look(record) {
      this.visible = true
      this.title = '预览'
      console.log('reees', record)
      this.handlerLook(record.paperId)
    },
    async handlerLook(id) {
      // this.contentImg = []
      // this.analysisImg = []
      // this.getData = this.previewData
      // let resList = this.previewData.resources
      // const contentImg = resList.filter((item) => item.type == '0')
      // const analysisImg = resList.filter((item) => item.type == '1')
      // if (contentImg.length > 0) {
      //   this.contentImg = contentImg.map((item) => item.url)
      // }
      // if (analysisImg.length > 0) {
      //   this.analysisImg = analysisImg.map((item) => item.url)
      // }
      const res = await paperApi.lookPaperQues(id)
      if (res && res.code == 200) {
        // console.log('eress', res)
        for (const key in this.formData) {
          if (res.data[key]) {
            this.formData[key] = res.data[key]
          }
        }
        this.quesList = res.data.questionDTOS
        // console.log('res.data.questionDTOS', res.data.questionDTOS)
      }
    },

    handlerCancel() {
      this.visible = false
      // this.reset()
    },
  },
  watch: {},
}
</script>

<style lang="less" scoped>
p {
  display: inline-block !important;
}

.content {
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .optionContent {
    height: 500px;
    .top {
      .type {
        background-color: #39b54a;
        padding: 3px 8px 3px 8px;
        border-radius: 5px;
        color: #fff;
        margin-right: 10px;
      }

      .title {
        font-size: 16px;
        font-weight: 800;
      }
    }

    .bottom {
      display: flex;
      flex-flow: column;
      align-items: center;

      .picture {
        margin-top: 2%;
        height: 300px;
        width: 100%;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .content {
        // width: 80%;
        .option {
          width: 80%;
          height: 30px;
          line-height: 30px;
          border-radius: 5px;
          margin: 5px auto;
          overflow: hidden;
          border: 1px solid #dddddd;

          .indexBox {
            background-color: #0081ff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
          }

          .indexTitle {
          }
        }

        .optionSuccess {
          position: relative;
          border: 1px solid #65c711;
          color: #65c711;
          width: 80%;
          height: 30px;
          border-radius: 5px;
          margin: 5px auto;
          overflow: hidden;
          display: flex;
          align-items: center;

          .indexBox {
            background-color: #0081ff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            margin-right: 5px;
          }

          img {
            position: absolute;
            right: 15px;
          }
        }
      }
    }

    .picture {
      margin-top: 2%;
      height: 300px;
      width: 80%;

      img {
        display: block;
        width: 70%;
        height: 100%;
      }
    }
  }
}
</style>
