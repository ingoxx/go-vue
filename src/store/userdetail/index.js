import { getUserDetail } from '../../api'
import { Message } from 'element-ui'

const userDetail = {
    namespace: true,
    state: {
        userdetail:null,
        activeName:"user",
    },
    getters: {
        activeNameChange(state) {
            return state.activeName
        },
    },
    mutations: {
        GET_USER_DETAIL(state, data) {
            state.userdetail = data;
        },
        TOGGLE_TAB(state, data) {
            state.activeName = data;
        },
    },
    actions: {
        async GetUserDetail(state) {
            const resp = await getUserDetail({name: sessionStorage.getItem('user')}).catch(
                err => {
                    return Message.error(err);
                }
            )
            state.commit("GET_USER_DETAIL", resp.data.data)
        }, 
    },
}

export default userDetail