<template>
  <div v-loading.fullscreen="fullLoading" element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="正在加载...">
    <!-- 搜索 -->
    <el-input placeholder="请输入您要查找的用户昵称/图书名称" @keyup.enter.native="searchInfo" @blur="clear" v-model="info"
      style="margin-bottom: 10px;height: 45px;" class="top-el-input">
      <template #prefix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>
    <!-- 借阅列表 -->
    <el-table :data="flag == 0 ? borrowList : searchMessage" style="width: 100%;height: 500px;"
      :row-style="{ height: '60px' }">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template #default="props">
          <div style="height:140px">
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
              <el-form-item label="借阅日期：">
                <span>{{ props.row.borrowDate }}</span>
              </el-form-item>
              <el-form-item label="应还日期：">
                <span>{{ props.row.shouldReturnDate }}</span>
              </el-form-item>
              <el-form-item label="实际归还日期：" v-if="(props.row.status == '已还')">
                <span>{{ props.row.returnDate }}</span>
              </el-form-item>
              <el-form-item label="图书状态：">
                <span>{{ props.row.status }}</span>

              </el-form-item>
              <el-form-item v-if="props.row.status !== '已还'">
                <el-popconfirm title="确定发邮件提醒用户还书吗？" @confirm="alertPerson(props.$index, props.row)" width="170"
                  confirm-button-text="OK" cancel-button-text="No" icon-color="#626AEF">
                  <template #reference>
                    <el-button type="warning" plain style="position:absolute;left:-200px;">提醒用户还书</el-button>
                  </template>
                </el-popconfirm>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>

      <!-- 基本行 -->
      <el-table-column label="借阅日期" sortable prop="borrowDate">
        <template #default="props">
          <el-icon>
            <Clock />
          </el-icon>
          <span style="margin-left: 10px">{{ props.row.borrowDate }}</span>
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
  </div>
</template>

<script>
import { mapState, mapStores } from "pinia";
import useStore from "@/store";
import { deleteBorrow, searchBorrow, alertPerson } from "@/api/admin";
import qs from "qs";
export default {
  data() {
    return {
      loading: false,
      loadingtext: "查询中...",
      info: "",
      searchMessage: [],
      flag: 0,
      fullLoading: false
    };
  },
  computed: {
    fullLoaded: {
      get() {
        return this.fullLoading
      },
      set(value) {
        this.fullLoading = value
        if (value === true)
          setTimeout(() => {
            this.fullLoading = false
          }, 1500)
      },
    },
    ...mapState(useStore.borrow, ['borrowList']),
    ...mapStores(useStore.borrow)
  },
  methods: {
    // 删除记录
    handleDelete(index, row) {
      this.fullLoaded = true
      console.log(row);
      let borrowObj = {
        borrowId: row.borrowId,
      };
      deleteBorrow(borrowObj).then(
        (res) => {
          console.log(res);
          if (res.data === '已删除记录！') {
            this.fullLoaded = false
            ElMessage({
              message: res.data,
              type: "success",
            });
            this.borrowStore.initBorrowList()
          }
          else {
            ElMessage({
              message: res.data,
              type: "error",
            });
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    },
    // 查询指定记录
    searchInfo(e) {
      this.fullLoaded = true
      searchBorrow({ info: this.info }).then(
        (res) => {
          this.fullLoaded = false
          e.target.blur();
          console.log(res.data);
          this.searchMessage = res.data;
          this.flag = 1;
          // json中没有数据时返回空串
          if (res.data == "") {
            ElMessage({
              message: "查询结果为空！",
              type: "error",
            });
          }
        },
        (err) => {

          console.log(err.message);
        }
      );
    },
    clear() {
      this.flag = 0;
      this.searchMessage = [];
    },
    // 发邮件
    alertPerson(index, row) {
      this.fullLoaded = true
      console.log(index, row);
      alertPerson(qs.stringify({ readerId: row.readerId, bookName: row.bookName })).then(res => {
        this.fullLoaded = false
        ElMessage({
          message: "邮件发送成功！",
          type: "success",
        });
        console.log(res);
      }, err => {
        ElMessage({
          message: "发送失败！",
          type: "error",
        });
      })
    },
  },
  mounted() {
    this.borrowStore.initBorrowList()
  }
};
</script>

<style lang="less" scoped>
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
  // position: absolute;
  // right: 130px;
  // bottom: 15px;
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