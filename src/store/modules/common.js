import Vue from 'vue'
import { schoolApi } from '@/api/school'
import { teacherApi } from '@/api/teacher'
import { classApi } from '@/api/class'
const common = {
  state: {
    schoolList: [],
    teacherList_search: [],
    classList_search: [],
    teacherList_modal: [],
    classList_modal: [],
  },
  mutations: {
    GET_SCHOOL_LIST: (state, record) => {
      state.schoolList = record
    },
    GET_TEACHER_LIST: (state, record) => {
      record.key == 1 ? (state.teacherList_search = record.list) : (state.teacherList_modal = record.list)
      console.log('record', record)
    },
    GET_CLASS_LIST: (state, record) => {
      record.key == 1 ? (state.classList_search = record.list) : (state.classList_modal = record.list)
    },
  },
  actions: {
    getSchoolList({ commit }, record) {
      const params = {
        pageNo: 1,
        pageSize: 999,
      }
      let list = []
      schoolApi.getSchoolList(params).then((res) => {
        if (res.code == 200 && res.data.list.length > 0) {
          list = res.data.list.map((item) => {
            return {
              label: item.schoolName,
              value: item.id,
            }
          })
        }
        commit('GET_SCHOOL_LIST', list)
      })
    },
    getTeacherList({ commit }, record) {
      const schoolId = {
        schoolId: record.id ? record.id : '',
      }
      const page = {
        pageNo: 1,
        pageSize: 999,
      }

      const params = { ...schoolId, ...page }

      let list = []
      teacherApi.getTeacherList(params).then((res) => {
        if (res.code == 200 && res.data.list.length > 0) {
          list = res.data.list.map((item) => {
            return {
              label: item.name,
              value: item.id,
            }
          })
        }
        const data = {
          key: record.key ? record.key : '',
          list,
        }
        commit('GET_TEACHER_LIST', data)
      })
    },
    getClassList({ commit }, record) {
      const teacherId = {
        teacherId: record.id ? record.id : '',
        schoolId: record.schoolId ? record.schoolId : '',
      }
      const page = {
        pageNo: 1,
        pageSize: 999,
      }
      const params = { ...teacherId, ...page }
      classApi.getClassList(params).then((res) => {
        let list = []
        if (res.code == 200 && res.data.list.length > 0) {
          list = res.data.list.map((item) => {
            return {
              label: item.name,
              value: item.id,
            }
          })
        }
        const data = {
          key: record.key ? record.key : '',
          list,
        }
        commit('GET_CLASS_LIST', data)
      })
    },
  },
}
export default common
