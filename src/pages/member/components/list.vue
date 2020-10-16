<template>
  <div>
    <div class="a1">
      <el-table
        :data="list"
        style="width: 100%; margin-bottom: 20px"
        row-key="uid"
        border
        :tree-props="{ children: 'children' }"
      
      >
        <el-table-column prop="uid" label="用户编号" sortable width="180">     
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" sortable width="180">
         
        </el-table-column>
        <el-table-column prop="phone" label="手机号" sortable width="180">
         
        </el-table-column>

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
            <el-button type="primary" @click="edit(scope.row.uid)"
              >编辑</el-button
            >

          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  grops: [],
  components: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      list: "member/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "member/reqListAction",
    }),
    edit(uid) {
      this.$emit("edit", uid);
    },
    
    mounted() {
      //获取list
      // this.reqListAction();
      
    },
  },
};
</script>
<style scoped>
.a1 {
  height: 320px;
}
</style>