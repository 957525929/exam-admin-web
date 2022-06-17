import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import qs from 'qs'
export const commonApi = {
  uploadlocal: (params) => postAction('/api/upload/local', params),
  uploadserver: (params) => postAction('/api/upload/server', params),
}
