<template>
  <el-table :data="readerList" style="width: 100%;height: 500px;" :row-style="{ height: '60px' }">
    <el-table-column prop="readerName" label="姓名" sortable width="180">
    </el-table-column>
    <el-table-column prop="phone" sortable label="电话">
    </el-table-column>
    <el-table-column prop="email" sortable label="邮箱" width="200px">
    </el-table-column>
    <el-table-column sortable label="借阅次数">
      <template #default="props">
        <span style="margin-left:14px;margin-right: 5px;">{{ props.row.borrowTimes }}</span>次
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template #default="props">
        <el-popconfirm title="确认删除该人员吗？" @confirm="delPerson(props.$index, props.row)" width="170"
          confirm-button-text="OK" cancel-button-text="No" icon-color="#626AEF">
          <template #reference>
            <el-button type="danger" plain class="button del">删除用户</el-button>
          </template>
        </el-popconfirm>
      </template>

    </el-table-column>
  </el-table>
</template>

<script>
import { delPerson } from '@/api/admin'
import useStore from '@/store';
import { mapState, mapStores } from 'pinia';

export default {
  computed: {
    ...mapState(useStore.user, ['readerList']),
    ...mapStores(useStore.user)
  },
  methods: {
    delPerson(index, row) {
      console.log(index, row);
      let infoObj = { readerId: row.readerId }
      delPerson(infoObj).then(res => {
        console.log(res);
        if (res.data === '已删除用户！') {
          ElMessage({
            message: res.data,
            type: "success",
          });
          this.userStore.initReaderList()
        }
        else {
          ElMessage({
            message: res.data,
            type: "error",
          });
        }
      }, err => {
        console.log(err.message);
      })
    }
  },
  mounted() {
    this.userStore.initReaderList()
  }
};
</script>

<style  scoped>
.button {
  width: 56px;
  height: 28px;
  font-size: 12px;
  margin-left: -10px;
  border-radius: 3px;
  letter-spacing: 1px;
}

.del {
  width: 70px;
  /* position: absolute;
  right: 80px;
  bottom: 15px; */
  letter-spacing: 2px;
}
</style>