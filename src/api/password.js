import { postAction } from '@/api/manage'

export const psdApi = {
    resetPassword: (params) => {
        return postAction(`/api/account/reset_password?account=${params.account}`)
    }
}