<template>
  <div>
    <!-- 表格 -->
    <v-list @edit="edit"></v-list>

    <!-- 添加组件 -->

    <v-add :info="info" ref="add"></v-add>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vAdd from "./components/add";

export default {
  grops: [],
  components: {
    vList,
    vAdd,
  },
  data() {
    return {
      //添加弹框的状态
      info: {
        isshow: false,
        //true添加,false编辑
        isAdd: true,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqListAction: "member/reqListAction",
    }),
    //编辑
    edit(uid) {
      this.info.isshow = true;
      this.info.isAdd = false;
      //让add组件发起获取详情的请求
      this.$refs.add.look(uid);
    },
  },
  mounted() {
    this.reqListAction();
  },
};
</script>
<style scoped>
</style>