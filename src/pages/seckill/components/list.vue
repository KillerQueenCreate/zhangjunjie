<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="title" label="活动名称"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="dele(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqSeckDel } from "../../../utils/request";
export default {
  grops: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "seckill/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "seckill/reqListAction",
    }),
    //编辑
    edit(id) {
      this.$emit("edit", id);
    },

    //删除2
    dele(id) {
      reqSeckDel({ id: id }).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //获取list
    this.reqListAction();
  },
};
</script>
<style scoped>
</style>