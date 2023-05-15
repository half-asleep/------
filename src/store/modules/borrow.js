import { defineStore } from 'pinia'
import { initBorrows } from '@/api/reader'
import { initBorrowList } from '@/api/admin'

const useBorrowStore = defineStore('borrow', {
  state: () => {
    return {
      // 管理员接收所有记录
      borrowList: [],
      //读者只接收自己的借阅记录   
      borrows: []
    }
  },

  getters: {

  },

  actions: {
    // 查询个人借阅记录
    initBorrows(readerId) {
      console.log('borrow', readerId);
      initBorrows({ readerId: readerId }).then(res => {
        console.log(res);
        this.borrows = res.data
        this.borrows.forEach((element) => {
          element.bookName = '《' + element.bookName + '》'
        })
      }, err => {
        console.log(err.message);
      })
    },

    // 查询全部借阅记录
    initBorrowList() {
      initBorrowList().then(res => {
        console.log(res);
        this.borrowList = res.data
        this.borrowList.forEach((element) => {
          element.bookName = '《' + element.bookName + '》'
        })
      }, err => {
        console.log(err.message);
      })
    },
  }
})

export default useBorrowStore