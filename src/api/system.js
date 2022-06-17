import { putAction } from '@/api/manage'

export const systemApi = {
    //修改公司信息
    updateCompanyConfig: (params) => {
      return putAction('/api/configItem/updateCompanyConfig', params)
    },
    //修改出题配置
    updateConfigItem: (params) => {
      return putAction('/api/configItem/updateConfigItem', params)
    }
  }