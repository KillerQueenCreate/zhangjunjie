import Axios from "axios"
import { reqMemberList } from "../../utils/request"
const state = {
    //会员list
    list: [],

}
const mutations = {
    //修改list
    changeList(state, arr) {
        state.list = arr
    },

}

const actions = {
    //页面请求
    reqListAction(context) {
        //发送请求
        reqMemberList().then(res => {
            context.commit("changeList", res.data.list)
        })
        console.log(list);
    },

}
const getters = {
    list(state) {
        return state.list
    },

}

export default {
    state,
    mutations,
    actions, getters,
    namespaced: true
}