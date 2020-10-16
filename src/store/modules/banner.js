import {reqBannerList} from "../../utils/request"
const state={
    list:[]
}

const mutations={
    changeList(state,arr){
        state.list=arr
    }
}

const actions={
    //页面请求
    reqListAction(context){
        //发送请求
        reqBannerList().then(res=>{
            context.commit("changeList",res.data.list)
        })
    }
}

const getters={
    list(state){
        return state.list
    }
}

export default{
    state,
    mutations,
    actions,getters,
    namespaced:true
}