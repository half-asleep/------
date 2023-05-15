<template>
  <div>
    <!-- 借阅列表 -->
    <el-table :data="borrows" style="width: 100%;height: 500px;" :row-style="{ height: '55px' }">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" class="expand_form">
            <el-form-item label="书籍名称：">
              <span>{{ props.row.bookName }}</span>
            </el-form-item>
            <el-form-item label="图书作者：">
              <span>{{ props.row.author }}</span>
            </el-form-item>
            <el-form-item label="借书日期：">
              <span>{{ props.row.borrowDate }}</span>
            </el-form-item>
            <el-form-item label="归还日期：" v-if="(props.row.status == '已还')">
              <span>{{ props.row.returnDate }}</span>
            </el-form-item>
            <el-form-item label="应还日期：">
              <span>{{ props.row.shouldReturnDate }}</span>
            </el-form-item>
            <el-form-item label="图书状态：">
              <span>{{ props.row.status }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <!-- 基本行 -->
      <el-table-column prop="borrowDate" label="借阅日期"> </el-table-column>
      <el-table-column prop="bookName" label="书籍名称"> </el-table-column>
      <el-table-column prop="author" label="图书作者"> </el-table-column>

      <el-table-column label="操作" width="200">
        <template #default="props">
          <el-popconfirm width="170" confirm-button-text="OK" cancel-button-text="No" icon-color="#626AEF"
            title="确定归还该书籍吗?" @confirm="returnBook(props.$index, props.row)">
            <template #reference>
              <span class="left"><el-button type="warning" plain v-if="props.row.status !== '已还'"
                  class="button">还书</el-button></span>
            </template>
          </el-popconfirm>
          <el-popconfirm width="170" confirm-button-text="OK" cancel-button-text="No" icon-color="#626AEF"
            title="确认续借该书籍吗？" @confirm="continueBorrowBook(props.$index, props.row)" v-if="props.row.status !== '已还'">
            <template #reference>
              <span><el-button type="primary" :plain="props.row.status == '未还'" :disabled="props.row.status == '已续借'"
                  class="button" v-text="props.row.status == '已续借' ? '已续借' : '续借'"></el-button></span>
            </template>
          </el-popconfirm>
          <el-button type="success" plain v-if="props.row.status == '已还'" disabled class="button success">已还</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import useStore from '@/store';
import { mapState, mapStores } from 'pinia';
import { returnBook, continueBorrow } from '@/api/reader'
import qs from 'qs'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState(useStore.user, {
      readerId: store => store.readerInfo.readerId
    }),
    ...mapState(useStore.borrow, ['borrows']),
    ...mapStores(useStore.borrow)
  },
  created() {
    this.borrowStore.initBorrows(this.readerId)
  },
  methods: {
    // 还书
    returnBook(index, row) {
      console.log(row);
      let infoObj = {
        borrowId: row.borrowId
      };
      returnBook(qs.stringify(infoObj)).then(
        (res) => {
          console.log(res);
          if (res.data == "还书成功！") {
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
          this.borrowStore.initBorrows(this.readerId)
        },
        (err) => {
          console.log(err.message);
          ElMessage({
            message: "请求发送错误",
            type: "error",
          });
        }
      );
    },
    // 续借
    continueBorrowBook(index, row) {
      console.log(row);
      this.loading = true;
      let infoObj = {
        borrowId: row.borrowId,
      };
      continueBorrow(qs.stringify(infoObj)).then((res) => {
        this.loading = false;
        console.log(res);
        if (res.data == "续借成功！") {
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
        this.borrowStore.initBorrows(this.readerId)
      },
        (err) => {
          console.log(err.message);
          this.loading = false;
          this.$message({
            showClose: true,
            message: "请求发送错误",
            type: "error",
          });
        });
    },
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