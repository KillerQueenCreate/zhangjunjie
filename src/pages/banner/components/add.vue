<template>
  <div class="add">
    <el-dialog
      :title="info.isAdd ? '添加商品分类' : '编辑商品分类'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item  label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <!-- 原生上传文件 start -->
        <!-- <el-form-item label="图片" v-if="form.pid!=0">
          <div class="my-upload">
            <h3>+</h3>
            <img :src="imgUrl" v-if="imgUrl" alt="" class="img" />
            <input v-if="info.isshow" type="file" class="my-input" @change="getFile" />
          </div>
        </el-form-item> -->
        <!-- 原生上传文件 end -->
        <el-form-item lable="图片">
            
                <el-upload class="avatar-uploader" action="#" 
                :show-file-list="false" :on-change="getFile2"
                >
                <img v-if="imgUrl" :src="imgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            
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
  reqBannerAdd,
  reqBannerDetail,
  reqBannerUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      imgUrl: "",
      form: {
        title: "",
        img: null,
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "banner/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "banner/reqListAction",
    }),
    cancel() {
      this.info.isshow = false;
    },
    //获取文件
    // getFile(e) {
    //   // console.log(e);
    //   let file = e.target.files[0];

      
    // //   console.log(file);
    //   this.imgUrl = URL.createObjectURL(file);

    //   this.form.img = file;
    // },
    //数据重置
    empty() {
      this.form = {
        title: "",
        img: null,
        status: 1,
      };
      this.imgUrl = "";
    },
    //弹框消失完成
    close() {
      //如果添加开的弹框则不变，编辑的就清除form
      if (this.info.isAdd) {
        this.empty();
      }
    },
    getFile2(e){
        let file=e.raw
        // console.log(file);
        //1大小不超过2M
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件超过2M");
        return;
      }
      //2是图片
      let imgExtArr = [".jpg", ".png", ".jpeg", ".gif"];
      let extname = file.name.slice(file.name.lastIndexOf("."));
      // console.log(extname);
      if (!imgExtArr.some((item) => item == extname)) {
        warningAlert("图片格式错误");
        return;
      }
        //通过文件生成地址
        this.imgUrl=URL.createObjectURL(file);
        this.form.img=file;
    },
    //修改pid
    changePid() {
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    add() {
      // console.log(this.form);
      reqBannerAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //success
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          //列表数据要刷新
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情
    look(id) {
      //发请求
      reqBannerDetail(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
          this.imgUrl = this.$imgPre + this.form.img;
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      reqBannerUpdate(this.form).then((res) => {
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
<style lang="stylus" scoped>
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}

.my-upload h3 {
  text-align: center;
  line-height: 150px;
  font-size: 30px;
  font-weight: 400;
}

.my-upload .my-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  opacity: 0;
}

.my-upload .img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.add>>>.avatar-uploader .el-upload{
    border:1px dashed #d9d9d9;
    border-radius:6px;
    cursor:pointer;
    position :relative;
    overflow :hidden;
}
.avatar-uploader .el-upload:hover{
    border-color:#409EFF;
}
.avatar-uploader-icon{
    font-size:28px;
    color:#8c939d;
    width:178px;
    height:178px;
    line-height :178px;
    text-align:center;
}
.avatar{
    width:178px;
    height:178px;
    display :block;
}
</style>