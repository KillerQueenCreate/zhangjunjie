import Axios from "axios"
import {reqGoodsCount,reqGoodsList} from "../../utils/request"
const state={
    //菜单list
    list:[],
    //一页的数量
    size:2,
    //总数
    total:0,
    //页码
    page:1
}
const mutations={
    //修改list
    changeList(state,arr){
        state.list=arr
    },
    changeTotal(state,num){
        state.total=num
    },
    //修改页码
    changePage(state,page){
        state.page=page
    }

}

const actions={
    //页面请求
    reqListAction(context){
        
        //发送请求
        reqGoodsList({page:context.state.page,size:context.state.size}).then(res=>{
            //如果取list的时候，取到null，那么有可能是最后一页没数据，需要减一页
            // 再次请求list
            let list=res.data.list?res.data.list:[]
            if(context.state.page>1&&list.length==0){
                context.commit("changePage",context.state.page-1)
                context.dispatch("reqListAction")
                return;
            }

            
            context.commit("changeList",list)
        })
    },
    //获取总数请求
    reqTotalAction(context){
        reqGoodsCount().then(res=>{
            context.commit("changeTotal",res.data.list[0].total)
        })
    },
    //组件修改了页码
    changePageAction(context,page){
        //修改页码
        context.commit("changePage",page)
        //发起list请求
        context.dispatch('reqListAction')
    }
}
const getters={
    list(state){
        return state.list
    },
    size(state){
        return state.size
    },
    total(state){
        return state.total
    }

}

export default{
    state,
    mutations,
    actions,getters,
    namespaced:true
}