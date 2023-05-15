<template>
  <div>
    <div class="top">
      <el-link :underline="false" class="all" @click.prevent="flag = 0">全部图书</el-link>
      <!-- https://blog.csdn.net/qq_29468573/article/details/80771625 -->
      <el-input placeholder="请输入您要搜索的书名/作者" @keyup.enter.native="searchBook" @blur="clear" v-model="name"
        style="height:38px;" class="top-el-input">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div>
    <hr style="border:none; border-top:solid 1px #dcdfe6;" />

    <el-table :data="flag == 0 ? bookList : searchBooks" style="width: 100%;height: 500px;"
      :row-style="{ height: '60px' }">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" class="expand_form">
            <el-form-item label="图书名称：">
              <span>{{ props.row.bookName }}</span>&nbsp;
              <el-button v-show="isAdmin" @click="changeBookName(props.row)" link type="primary" class="edit">
                <el-icon>
                  <EditPen />
                </el-icon>修改</el-button>
            </el-form-item>

            <el-form-item label="图书作者：">
              <span>{{ props.row.author }}</span>&nbsp;
              <el-button v-show="isAdmin" @click="changeBookAuthor(props.row)" link type="primary" class="edit">
                <el-icon>
                  <EditPen />
                </el-icon>修改</el-button>
            </el-form-item>

            <el-form-item label="出版社：">
              <span>{{ props.row.publisher }}</span>
              &nbsp;<el-button v-show="isAdmin" @click="changeBookPublisher(props.row)" link type="primary"
                class="edit">
                <el-icon>
                  <EditPen />
                </el-icon>修改</el-button>
            </el-form-item>

            <el-form-item label="标准书号（ISBN）:">
              <span>{{ props.row.isbn }}</span>
              &nbsp;<el-button v-show="isAdmin" @click="changeBookISBN(props.row)" link type="primary" class="edit">
                <el-icon>
                  <EditPen />
                </el-icon>修改</el-button>
            </el-form-item>

            <el-form-item label="当前库存：">
              <span style="margin-right:5px">{{ props.row.currentAmount }}</span>本
              &nbsp;<el-button v-show="isAdmin" @click="changeCurrentAmount(props.row)" link type="primary"
                class="edit">
                <el-icon>
                  <EditPen />
                </el-icon>修改</el-button>
            </el-form-item>

            <el-form-item label="总库存：">
              &nbsp;&nbsp; <span style="margin-right:5px">{{ props.row.amount }}</span>本
              <el-button v-show="isAdmin" @click="changeAmount(props.row)" link type="primary" class="edit">
                <el-icon>
                  <EditPen />
                </el-icon>修改</el-button>
            </el-form-item>

            <el-form-item label="简介：">
              &nbsp;&nbsp; <span style="margin-right:5px">{{ props.row.introduction }}</span>
              <el-button v-show="isAdmin" @click="changeIntroduction(props.row)" link type="primary" class="edit">
                <el-icon>
                  <EditPen />
                </el-icon>修改</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <!-- 原始行 -->
      <el-table-column label="图书名称" prop="bookName" sortable>
      </el-table-column>
      <el-table-column label="图书作者" prop="author" sortable>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" sortable>
      </el-table-column>
      <el-table-column label="当前库存" prop="currentAmount" sortable>
        <template #default="props">
          <span style="margin-left:10px">{{ props.row.currentAmount }}&nbsp;</span>本
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="props">
          <el-button v-if="!isAdmin" type="primary" plain @click="bookReserve(props.$index, props.row)"
            class="button">预约</el-button>
          <el-popconfirm title="确认删除该书籍吗？" v-else @confirm="delBook(props.row)" width="170" confirm-button-text="OK"
            cancel-button-text="No" icon-color="#626AEF">
            <template #reference>
              <el-button type="danger" plain class="button del">删除图书</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { addReserve, searchBook } from '@/api/reader'
import { delBook, changeBookInfo } from '@/api/admin';
import useStore from '@/store';
import { mapState, mapStores } from 'pinia';

import qs from 'qs'
export default {
  data() {
    return {
      flag: 0,
      name: "",
      searchBooks: [],
    }
  },
  computed: {
    ...mapState(useStore.book, ['bookList']),
    ...mapState(useStore.user, {
      isAdmin: 'isAdmin',
      readerId: store => store.readerInfo.readerId
    }),
    ...mapStores(useStore.book)
  },
  methods: {
    // 预约
    bookReserve(index, row) {
      console.log("索引", index)
      console.log("行数据", row)
      console.log("readerId:", this.readerId)
      let readerId = this.readerId;
      let bookId = row.bookId;
      let reserveObj = { readerId, bookId };
      console.log(reserveObj);
      //  添加预约记录
      addReserve(qs.stringify(reserveObj)).then(
        (res) => {

          console.log(res);
          if (res.data == "预约成功！") {
            ElMessage({
              message: res.data,
              type: "success",
            });
          } else {
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

    //搜索指定书籍
    searchBook(e) {
      searchBook({ name: this.name }).then(
        (res) => {
          e.target.blur();
          this.flag = 1;
          this.searchBooks = res.data;
          console.log(res);
          e.target.value = ""
          if (res.data == "") {
            ElMessage({
              type: 'error',
              message: "未找到书籍"
            })
            e.target.value = ""
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    },

    clear() {
      this.flag = 0;
      this.searchBooks = [];
    },

    // 删除图书
    delBook(row) {
      console.log(row);
      let bookId = row.bookId;
      delBook({ bookId }).then(res => {
        console.log(res);
        if (res.data === '删除成功！')
          ElMessage({
            message: res.data,
            type: "success"
          });
        this.bookStore.initBookList()
      }, err => {
        console.log(err.message);
      })
    },

    // 修改书名
    changeBookName(row) {
      console.log(row.bookId);
      var bookId = row.bookId;
      var status = 1;

      ElMessageBox.prompt("请输入书名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.bookName,
        draggable: true
      })
        .then(({ value }) => {
          // 修改信息
          var infoObj = { bookId, value, status };
          console.log(infoObj)
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res.data);
              this.bookStore.initBookList()
              ElMessage({
                type: 'success',
                message: "你修改的书名是: " + value,
              });
            },
            (err) => {
              console.log(err.message);
            }
          );

        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消输入",
          });
        });
    },

    // 修改作者
    changeBookAuthor(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 2;
      ElMessageBox.prompt("请输入作者", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.author,
        draggable: true
      })
        .then(({ value }) => {
          // 修改信息
          var infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              this.bookStore.initBookList()
              ElMessage({
                type: 'success',
                message: "你修改的作者名是: " + value,
              });
            },
            (err) => {
              console.log(err.message);
            }
          );
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消输入",
          });
        });
    },

    // 修改出版社
    changeBookPublisher(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 3;
      ElMessageBox.prompt("请输入出版社", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.publisher,
        draggable: true
      })
        .then(({ value }) => {
          // 修改信息
          var infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              this.bookStore.initBookList()
              ElMessage({
                type: 'success',
                message: "你修改的出版社是: " + value,
              });
            },
            (err) => {
              console.log(err.message);
            }
          );
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消输入",
          });
        });
    },

    // 修改ISBN
    changeBookISBN(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 4;
      ElMessageBox.prompt("请输入ISBN", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.isbn,
        draggable: true
      })
        .then(({ value }) => {
          // 修改信息
          var infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              this.bookStore.initBookList()
              ElMessage({
                type: 'success',
                message: "你修改的ISBN是: " + value,
              });
            },
            (err) => {
              console.log(err.message);
            }
          );
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消输入",
          });
        });
    },

    // 修改当前库存
    changeCurrentAmount(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 5;
      ElMessageBox.prompt("请输入出版社", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.currentAmount,
        draggable: true
      })
        .then(({ value }) => {
          // 修改信息
          var infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              this.bookStore.initBookList()
              ElMessage({
                type: 'success',
                message: "你修改的当前库存是: " + value,
              });
            },
            (err) => {
              console.log(err.message);
            }
          );
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消输入",
          });
        });
    },

    // 修改总库存
    changeAmount(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 6;
      ElMessageBox.prompt("请输入总库存", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.amount,
        draggable: true
      })
        .then(({ value }) => {
          // 修改信息
          var infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              this.bookStore.initBookList()
              ElMessage({
                type: 'success',
                message: "你修改的总库存是: " + value,
              });
            },
            (err) => {
              console.log(err.message);
            }
          );
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消输入",
          });
        });
    },

    // 修改简介
    changeIntroduction(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 7;
      ElMessageBox.prompt("请输入简介内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        draggable: true,
        inputType: 'textarea',
      })
        .then(({ value }) => {
          // 修改信息
          var infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              this.bookStore.initBookList()
              ElMessage({
                type: 'success',
                message: "你修改的简介是: " + value,
              });
            }
          );
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消输入",
          });
        });
    },
  }
}
</script>

<style scoped>
.top {
  display: flex;
  height: 40px;
  width: 100%;
  flex-flow: column wrap;
  align-items: flex-start;
}

.top-el-input {
  width: 240px;
  align-self: flex-end;
  position: relative;
  right: 5px;
}

.edit {
  margin-left: 15px;

}

.all {
  font-size: 19px;
  position: relative;
  left: 8px;
  top: 13px;
}

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
  right: 90px;
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