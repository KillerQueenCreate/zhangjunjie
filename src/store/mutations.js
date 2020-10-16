export const state={
    userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}
export const mutations={
    changeUserInfo(state,info){
        state.userInfo=info;
        //由于状态层刷新，数据就没有了，但是我们希望数据还在
        //如果info是一个{},那么代表要退出，删除，如果不是空{}，代表是登录，存储
        if(info.id){
            sessionStorage.setItem("userInfo",JSON.stringify(info))
        }else{
            sessionStorage.removeItem("userInfo")
        }
    }
}
export const getters={
    userInfo(state){
        return state.userInfo;
    }
}