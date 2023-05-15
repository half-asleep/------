<template>
  <div>
    <!-- 预约列表 -->
    <el-table :data="reserve" style="width: 100%;height: 500px;" :row-style="{ height: '55px' }">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" class="expand_form">
            <el-form-item label="预约日期：">
              <span>{{ props.row.date }}</span>
            </el-form-item>
            <el-form-item label="书籍名称：">
              <span>{{ props.row.bookName }}</span>
            </el-form-item>
            <el-form-item label="图书作者：">
              <span>{{ props.row.author }}</span>
            </el-form-item>
            <el-form-item label="图书状态：">
              <span>{{ props.row.status }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <!-- 初始行 -->
      <el-table-column prop="date" label="预约日期"> </el-table-column>
      <el-table-column prop="bookName" label="书籍名称"> </el-table-column>
      <el-table-column prop="author" label="图书作者"> </el-table-column>

      <el-table-column label="操作" width="200" class="op">
        <template #default="props">
          <el-popconfirm width="170" confirm-button-text="OK" cancel-button-text="No" icon-color="#626AEF"
            title="确定取消预约吗?" @confirm="cancelReserve(props.$index, props.row)">
            <template #reference>
              <span class="left"><el-button type="warning" plain v-if="props.row.status == '已预约'"
                  class="button">取消预约</el-button></span>
            </template>
          </el-popconfirm>
          <el-popconfirm width="170" confirm-button-text="OK" cancel-button-text="No" icon-color="#626AEF"
            title="确认借阅该书籍吗？" @confirm="confirmBorrow(props.$index, props.row)">
            <template #reference>
              <span><el-button type="primary" plain v-if="props.row.status == '已预约'"
                  class="button">确认借书</el-button></span>
            </template>
          </el-popconfirm>
          <el-button type="success" plain v-if="props.row.status == '已借阅'" disabled
            class="button success">已借阅</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import useStore from '@/store';
import { deleteReserve, addBorrow } from '@/api/reader'
import qs from 'qs'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState(useStore.reserve, ['reserve']),
    ...mapState(useStore.user, {
      readerId: store => store.readerInfo.readerId
    })
  },
  methods: {
    // 取消预约
    cancelReserve(index, row) {
      console.log(index, row);
      let obj = { reserveId: row.reserveId };
      console.log(obj);

      deleteReserve(obj).then(
        (res) => {

          console.log(res);
          if (res.data == "已取消预约！") {
            ElMessage({
              message: res.data,
              type: "success",
            })
            useStore.reserve().initReserve(this.readerId)
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
        }
      );
    },
    // 确认借书
    confirmBorrow(index, row) {
      console.log(index, row);
      let readerId = this.readerId;
      let bookId = row.bookId;
      let reserveId = row.reserveId
      this.loading = true;

      let borrowObj = { reserveId, readerId, bookId };
      //  添加借书记录
      addBorrow(qs.stringify(borrowObj)).then(
        (res) => {
          this.loading = false;
          console.log(res);

          if (res.data == "借书成功！") {
            ElMessage({
              message: res.data,
              type: "success",
            });
          }
          else {
            ElMessage({
              message: res.data,
              type: "error",
            });
          }
          useStore.reserve().initReserve(this.readerId)
        },
        (err) => {
          this.loading = false;
          console.log(err.message);
          ElMessage({
            message: "借书失败！",
            type: "error",
          });
        }
      );
    },
  },
  mounted() {
    useStore.reserve().initReserve(this.readerId)
  }
}
</script>

<style scoped>
.button {
  width: 80px;
  height: 28px;
  font-size: 12px;
  border-radius: 3px;

}

.success[disabled] {
  color: #5fd128;
  letter-spacing: 2px;
  margin-left: -10px;
}

.success[disabled]:hover {
  color: #5fd128
}

.left {
  margin-right: 10px;
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
