<template>
  <div>
    <el-dialog title="活动添加" :visible.sync="info.isshow">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称" required>
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限">
          <!-- 时间 -->
          <div class="block">
            <el-date-picker
              v-model="value1"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" @change="changeFirst">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" @change="changeSecond">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="form.goodsid">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in thirdGoodsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
import E from "wangeditor";
import { mapGetters, mapActions } from "vuex";
import {
  reqCateList,
  reqGoodsList,
  reqSeckAdd,
  reqSeckList,
  reqSeckDetail,
  reqSeckUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        title: "king",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "12",
        status: 1,
      },

      value1: [],

      //二级分类的list
      secondCateList: [],
      //三级分类的list
      thirdGoodsList: [],
    };
  },
  computed: {
    ...mapGetters({
      //商品分类list
      cateList: "cate/list",
      //商品管理list
      goodsList: "goods/list",
      //秒杀活动list
      seckillList: "seckill/list",
    }),
  },
  methods: {
    ...mapActions({
      //请求商品分类list
      reqCateList: "cate/reqListAction",
      //请求商品管理list
      reqGoodsList: "goods/reqListAction",
      //请求秒杀活动管理list
      reqListAction: "seckill/reqListAction",
    }),

    changeFirst() {
      this.getSecondList();

      //一级分类变了，二级分类的值置空
      this.form.second_cateid = "";
      //一级分类变了，三级分类的值置空
      this.form.goodsid = "";
    },
    getSecondList() {
      reqCateList({ pid: this.form.first_cateid }).then((res) => {
        //二级分类list数据
        this.secondCateList = res.data.list;
      });
    },

    changeSecond() {
      this.getThirdList();
      //二级分类修改，获取三级分类的list

      //二级分类变了，三级分类的值置空
      this.form.goodsid = "";
    },
    getThirdList() {
      reqGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        //二级分类list数据
        this.thirdGoodsList = res.data.list;
      });
    },

    cancel() {
      this.info.isshow = false;
    },
    //数据重置
    empty() {
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      this.secondCateList = [];
      this.thirdGoodsList = [];
    },
    //弹框消失完成
    close() {
      //如果添加开的弹框则不变，编辑的就清除form
      if (this.info.isAdd) {
        this.empty();
      }
    },

    add() {
      this.form.begintime = this.value1[0].getTime();
      this.form.endtime = this.value1[1].getTime();
      
      reqSeckAdd(this.form).then((res) => {
        
        if (res.data.code == 200) {
          //success
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          //列表数据要刷新
          this.reqListAction();

          //获取时间
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情
    look(id) {
      //   发请求
      reqSeckDetail(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.value1 = [
            new Date(parseInt(this.form.begintime)),
            new Date(parseInt(this.form.endtime)),
          ];
          this.form.id = id;
          // this.value1.push(
          //   new Date(Number(this.form.begintime)),
          //   new Date(Number(this.form.endtime))
          // );
          // console.log(this.value1);
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.begintime = Number(this.form.begintime);
      this.form.endtime = Number(this.form.endtime);
      console.log(this.form,"--------------------")
      reqSeckUpdate(this.form).then((res) => {
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
  mounted() {
    //如果商品一级分类没有请求过，就请求一次
    if (this.cateList.length == 0) {
      this.reqCateList();
    }
    //如果商品二级分类没有请求过，就请求一次
    if (this.goodsList.length == 0) {
      this.reqGoodsList();
    }
  },
};
</script>
<style scoped>
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
</style>