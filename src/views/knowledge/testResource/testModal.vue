<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel" width="50%" :footer="null">
      <div v-if="getData" class="content">
        <div class="top">
          <span class="type"> {{ getData.quesType == 1 ? '单选' : getData.quesType == 2 ? '多选' : '判断' }}</span>
          <span class="title" id="content">{{ getData.content }}</span>
        </div>
        <div class="bottom">
          <div v-if="contentImg && contentImg.length > 0 && getData.external == 1">
            <div class="picture" v-for="item in contentImg" :key="item">
              <img :src="item" />
            </div>
          </div>

          <div class="content">
            <div
              style="margin-top: 20px"
              :class="item.selectKey ? 'optionSuccess' : 'option'"
              v-for="item in getData.optionS"
              :key="item.id"
            >
              <span class="indexBox"> {{ item.name }}</span>
              <span class="indexTitle"> {{ item.value }}</span>
              <img v-if="item.selectKey" src="@/assets/success.png" width="20px" height="20px" style="z-index: 999" />
            </div>
          </div>
        </div>
        <div style="margin-top: 10px">
          <span
            >正确答案：<span style="color: #00cc62; margin: 0 15px">{{ getData.answer }}</span></span
          >
          <span
            >难度等级：<span style="color: #00cc62; margin: 0 15px">{{
              getData.difficulty == 3 ? '难' : getData.difficulty == 2 ? '中' : '易'
            }}</span></span
          >
        </div>

        <div style="margin-top: 20px; color: #00cc62; font-size: 15px">解析：</div>

        <div style="margin-top: 20px; color: #f69a51; font-size: 15px" id="analysis">{{ getData.analysis }}</div>
        <br />
        <div style="margin-left: 20px" v-if="analysisImg && analysisImg.length > 0 && getData.external == 1">
          <div class="picture" v-for="item in analysisImg" :key="item">
            <img :src="item" />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { guid } from '@/utils/util'
import { questionApi } from '@/api/question'
import pageSearch from '@/components/page-form'
export default {
  components: {
    pageSearch,
  },
  data() {
    return {
      visible: false,
      title: '',
      getData: null,
      rowData: undefined,
      contentImg: [],
      analysisImg: [],
    }
  },
  mounted() {},
  filters: {
    level(val) {
      let lv = '易'
      switch (val) {
        case '2':
          lv = '中'
          break
        case '3':
          lv = '难'
          break
      }
      return lv
    },
  },
  methods: {
    //uid
    guid,

    async look(record) {
      this.visible = true
      this.title = '详情'
      // this.getData = { ...record }
      // console.log(' this.getData', this.getData)
      this.handlerLook(record.quesId)
    },
    async handlerLook(id) {
      this.contentImg = []
      this.analysisImg = []
      try {
        const res = await questionApi.lookQues(id)
        if (res.code == 200) {
          this.getData = res.data
          const arr = this.getData.answer.split('')
          for (const key in arr) {
            for (const value in this.getData.optionS) {
              if (this.getData.optionS[value].name == arr[key]) {
                this.getData.optionS[value].selectKey = true
              }
            }
          }
          console.log('arr', this.getData)
          let resList = res.data.resources
          const contentImg = resList.filter((item) => item.type == '0')
          const analysisImg = resList.filter((item) => item.type == '1')
          if (contentImg.length > 0) {
            this.contentImg = contentImg.map((item) => item.url)
          }
          if (analysisImg.length > 0) {
            this.analysisImg = analysisImg.map((item) => item.url)
          }
          // console.log('contentImg', this.contentImg)
          // console.log('analysisImg', this.analysisImg)
          // document.getElementById('content').append(this.rowData.content)
          // dom = this.rowData.content
          // console.log('dom', dom)
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        console.log(e)
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
  display: flex;
  flex-direction: column;
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
</style>
