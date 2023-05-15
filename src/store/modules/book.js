import { defineStore } from "pinia";
import { initBookList } from '@/api/reader'
const useBookStore = defineStore('book', {
  state: () => {
    return {
      bookList: []
    }
  },
  actions: {
    // 保存全部图书列表
    initBookList() {
      initBookList().then(res => {
        this.bookList = res.data
        console.log(this.bookList)
      }).catch(err => console.log(err.message))
    }
  },
  persist: true,
})

export default useBookStore



