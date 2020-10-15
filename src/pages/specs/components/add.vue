<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品规格' : '编辑商品规格'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <el-form-item label="规格属性" v-for="(item,index) in attrArr" :key="index">
          <div class="con">
            <div class="input-wrap">
              <el-input v-model="item.value"></el-input>
            </div>
            <el-button type="primary" v-if="index==0" @click="addAttr">新增规格属性</el-button>
            <el-button type="danger" v-else @click="del(index)">删除</el-button>
          </div>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添加</el-button
        >
        <el-button type="primary" @click="update" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqSpecsAdd,
  reqSpecsDetail,
  reqSpecsUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      attrArr:[
          {
              value:"",
          },
          {
              value:""
          }
      ],
      form: {
        specsname:"",
        attrs:"",
        status:1
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "specs/reqListAction",
      reqTotalAction:"specs/reqTotalAction",

    }),
    //删除
    del(index){
        this.attrArr.splice(index,1)
    },
    //新增规格属性
    addAttr(){
        this.attrArr.push({value:''})
    },
    cancel() {
      this.info.isshow = false;
    },
    //数据重置
    empty() {
        this.attrArr=[
          {
              value:"",
          },
          {
              value:""
          }
      ],
      this.form = {
        specsname:"",
        attrs:"",
        status:1
      };
    },
    //弹框消失完成
    close() {
      //如果添加开的弹框则不变，编辑的就清除form
      if (this.info.isAdd) {
        this.empty();
      }
    },
    checkedData(){
         if(this.form.specsname==""){
            warningAlert("名称不能为空")
            return false;
        }
        if(this.attrArr.some(item=>item.value=="")){
            warningAlert("所有属性值都必填")
            return false
        }
        return true
    },
    add() {
        if(!this.checkedData()){
            return
        }

        // console.log(this.form)
        // console.log(this.attrArr)
        // console.log((this.attrArr.map(item=>item.value)));
        this.form.attrs=JSON.stringify(this.attrArr.map(item=>item.value))
      reqSpecsAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //success
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          //列表数据要刷新
          this.reqListAction();
          this.reqTotalAction()
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情
    look(id) {
      //发请求
      reqSpecsDetail(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list[0];
          this.attrArr=JSON.parse(this.form.attrs).map(item=>({value:item}))
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
        if(!this.checkedData()){
            return
        }
        this.form.attrs=JSON.stringify(this.attrArr.map((item)=>item.value))
      reqSpecsUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
.con{
    display: flex;
}
.input-wrap{
    flex:1;
}
</style>