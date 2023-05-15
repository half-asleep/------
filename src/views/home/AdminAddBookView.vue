<template>
  <span class="all">添加图书</span>
  <hr class="hr" />
  <el-form ref="form" label-width="80px" size="large" class="form-add" :model="form">
    <el-form-item label="书籍名称" label-width="80px">
      <el-col :span="12">
        <el-input v-model="form.bookName"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="书籍作者" label-width="80px">
      <el-col :span="12">
        <el-input v-model="form.author"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="出版社" label-width="80px">
      <el-col :span="12">
        <el-select v-model="form.publisher" filterable placeholder="请选择或输入出版社名称">
          <el-option v-for="item in bookList" :key="item.bookId" :label="item.publisher" :value="item.publisher" />
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item label="ISBN" label-width="80px">
      <el-col :span="8">
        <el-input v-model="form.ISBN"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item></el-form-item>
    <el-form-item label="简介" label-width="80px" style="margin:-20px 0 0px;">
      <el-col :span="12">
        <el-input v-model="form.introduction" placeholder="请输入内容" type="textarea" :rows="3" show-word-limit
          maxlength="70" />
      </el-col>
    </el-form-item>
    <el-form-item></el-form-item>
    <el-form-item label="数量" label-width="80px">
      <el-col :span="8">
        <el-input-number v-model="form.amount" />
      </el-col>
    </el-form-item>
    <el-form-item>

      <el-button type="primary" @click="addBook" class="button">添加</el-button>

      <el-button @click="reset()" class="button reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addBook } from '@/api/admin'
import qs from 'qs'
import useStore from '@/store';
import { mapStores, mapState } from 'pinia';
export default {
  data() {
    return {
      form: {
        bookName: '',
        author: '',
        amount: 0,
        position: '',
        introduction: '',
        publisher: '',
        ISBN: ''
      }
    }
  },
  computed: {
    ...mapState(useStore.book, ['bookList']),
    ...mapStores(useStore.book)
  },

  methods: {
    reset() {
      document.querySelector('form').reset()
      this.form.amount = 0
    },
    // 添加书籍 
    addBook() {
      let book = this.form
      addBook(qs.stringify(book)).then(res => {
        console.log(res);
        if (res.data === '添加成功！') {
          ElMessage({
            message: res.data,
            type: 'success',
          });
          this.reset()
        } else {
          ElMessage({
            message: res.msg,
            type: 'error',
          });
        }
      }, err => {
        console.log(err.message);

      })
    }
  }

};
</script>

<style  scoped>
.hr {
  border: none;
  border-top: solid 1px #dcdfe6;
}

.all {
  display: block;
  height: 40px;
  font-size: 19px;
  position: relative;
  left: 8px;
  top: 13px;
  color: #606266;
}

.form-add {
  position: relative;
  left: 50px;
  top: 10px;
}

.button {
  border-radius: 5px;
  letter-spacing: 5px;
}

.reset {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #a0cfff;
}
</style>