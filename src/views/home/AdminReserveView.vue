<template>
  <el-table :data="reserveList" style="width: 100%;height: 500px;" :row-style="{ height: '60px' }">

    <el-table-column type="expand">
      <template #default="props">
        <el-form label-position="left" class="expand_form">

          <el-form-item label="图书 ID：">&nbsp;
            <span>{{ props.row.bookId }}</span>
          </el-form-item>
          <el-form-item label="图书名称：">
            <span>{{ props.row.bookName }}</span>
          </el-form-item>
          <el-form-item label="读者编号：">
            <span>{{ props.row.readerId }}</span>
          </el-form-item>
          <el-form-item label="读者姓名：">
            <span>{{ props.row.readerName }}</span>
          </el-form-item>
          <el-form-item label="预约日期：">
            <span>{{ props.row.date }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>

    <el-table-column label="预约日期" sortable>
      <template #default="props">
        <el-icon>
          <Clock />
        </el-icon>
        <span style="margin-left: 10px">{{ props.row.date }}</span>
      </template>
    </el-table-column>

    <el-table-column label="图书名称" sortable prop="bookName">

    </el-table-column>

    <el-table-column label="读者姓名" sortable prop="readerName">

    </el-table-column>
    <el-table-column label="操作">
      <template #default="props">
        <el-popconfirm title="确认删除该记录吗？" @confirm="handleDelete(props.$index, props.row)" width="170"
          confirm-button-text="OK" cancel-button-text="No" icon-color="#626AEF">
          <template #reference>
            <el-button type="danger" plain class="button del">删除记录</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
import { mapState, mapStores } from 'pinia'
import { deleteReserve } from '@/api/reader'
import useStore from '@/store';

export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapState(useStore.reserve, ['reserveList']),
    ...mapStores(useStore.reserve)
  },
  mounted() {
    this.reserveStore.initReserveList()
  },

  methods: {
    handleDelete(index, row) {
      console.log(index, row);
      let reserveObj = { reserveId: row.reserveId }
      deleteReserve(reserveObj).then((res) => {
        console.log(res);
        if (res.data == "已取消预约！") {
          ElMessage({
            message: "已删除预约记录！",
            type: "success",
          })
          this.reserveStore.initReserveList()
        }
        else {
          ElMessage({
            message: res.data,
            type: "error",
          })
        }
      }
        , (err) => {
          console.log(err.message);
        })
    }
  },
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
  right: 130px;
  bottom: 15px; */
  letter-spacing: 2px;
}
</style>


<style>
.expand_form .el-form-item__label {
  color: #99a9bf;
}

.expand_form {

  display: flex;
  width: 85%;
  flex-flow: wrap;
  margin: 0 auto;
}

.expand_form .el-form-item {
  width: 50%;
  margin-bottom: 0;
}
</style>