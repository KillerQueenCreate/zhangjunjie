<template>
  <div>
    <el-dialog title="会员修改" :visible.sync="info.isshow" @closed="close">
      <el-form ref="form" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
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
        <!-- <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button> -->
        <el-button type="primary" @click="update">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqMemberDetail,
  reqMemberList,
  reqMemberUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        uid: "1",
        nickname: "2",
        phone: "",
        password: "4",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqMemberList: "member/reqListAction",
    }),
    cancel() {
      this.info.isshow = false;
    },
    //数据重置
    empty() {
      this.form = {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      };
    },
    //弹框消失完成
    close() {
      //如果添加开的弹框则不变，编辑的就清除form
      if (this.info.isAdd) {
        this.empty();
      }
    },
    //编辑
    edit(uid) {
      this.$emit("edit", uid);
// this.form.password.length==0?(this.form.password=this.form.password):this.form.password=""
      // console.log(this.form.password);
    },
    //记住密码

    look(uid) {
      // 发请求
      reqMemberDetail(uid).then((res) => {
        
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.password=""
          
        } else {
          warningAlert(res.data.msg);
        }
      });
      
    },
    update() {
      reqMemberUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqMemberList();
          
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
  },
};
</script>
<style scoped>
</style>