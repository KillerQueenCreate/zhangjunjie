<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '商品添加' : '编辑商品'"
      :visible.sync="info.isshow"
      @closed="close"
      @opened="opened"
    >
      <el-form ref="form" :model="form" label-width="80px">
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
          <el-select v-model="form.second_cateid">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <div class="my-upload">
            <h3>+</h3>
            <img alt="" class="img" v-if="imgUrl" :src="imgUrl" />
            <input
              type="file"
              v-if="info.isshow"
              class="my-input"
              @change="getFile"
            />
          </div>
        </el-form-item>
        <el-form-item label="商品规格">
          <el-select v-model="form.specsid" @change="changeSpecs">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品属性">
          <el-select v-model="form.specsattr" multiple>
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in goodsAttrList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>

        <el-form-item label="商品描述">
          <!-- <textarea v-model="form.description" cols="30" rows="10"></textarea> -->
          <!-- 富文本 -->
          <div v-if="info.isshow" id="editor"></div>
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
  reqGoodsAdd,
  reqGoodsDetail,
  reqGoodsUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      //二级分类的list
      secondCateList: [],
      //图片地址
      imgUrl: "",
      //商品属性list
      goodsAttrList: [],
    };
  },
  computed: {
    ...mapGetters({
      //商品分类list
      cateList: "cate/list",
      //商品规格list
      specsList: "specs/list",
    }),
  },
  methods: {
    opened() {
      //富文本
      this.editor = new E("#editor");
      this.editor.create();
      //给富文本编辑器赋值
      this.editor.txt.html(this.form.description);
    },
    ...mapActions({
      //请求商品分类list
      reqCateList: "cate/reqListAction",
      //商品规格list
      reqSpecsList: "specs/reqListAction",
      //goods list
      reqListAction: "goods/reqListAction",
      //goods count
      reqTotalAction: "goods/reqTotalAction",
    }),

    changeFirst() {
      //一级分类变了，二级分类的值置空
      this.form.second_cateid = "";
      //一级分类修改，获取二级分类的list
      this.getSecondList();
    },
    //获得二级分类list
    getSecondList() {
      reqCateList({ pid: this.form.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },

    //图片操作
    getFile(e) {
      let file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件不能超过2M");
        return;
      }
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    //商品规格发生了改变，计算商品属性的数组
    changeSpecs() {
      //商品规格变了，商品属性先置空
      this.form.specsattr = [];
      this.getAttrsArr();
    },
    //获得商品属性数组
    getAttrsArr() {
      //在specsList中找到 哪一条数据的id和当前this.form.specsid是一样的
      //将这条数据的attrs赋值给goodsAttrList
      let obj = this.specsList.find((item) => item.id == this.form.specsid);
      this.goodsAttrList = obj.attrs;
    },

    cancel() {
      this.info.isshow = false;
    },
    //数据重置
    empty() {
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      this.secondCateList = [];
      this.imgUrl = "";
      this.goodsAttrList = [];
    },
    //弹框消失完成
    close() {
      //如果添加开的弹框则不变，编辑的就清除form
      if (this.info.isAdd) {
        this.empty();
      }
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
      //将富文本编辑器的内容取出来给form.description
      this.form.description = this.editor.txt.html();
      // console.log(this.form);
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };
      // console.log(data);

      reqGoodsAdd(data).then((res) => {
        if (res.data.code == 200) {
          //success
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          //列表数据要刷新
          this.reqListAction();
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情
    look(id) {
      //发请求
      reqGoodsDetail({ id: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          //补id
          this.form.id = id;
          //需要请求一个二级分类的list
          this.getSecondList();
          //图片
          this.imgUrl = this.$imgPre + this.form.img;
          //商品属性从字符串转为数组
          this.form.specsattr = JSON.parse(this.form.specsattr);
          //获取商品属性的数组
          this.getAttrsArr();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };
      reqGoodsUpdate(data).then((res) => {
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
    //如果规格list没有请求过就请求一次

    this.reqSpecsList(true);
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