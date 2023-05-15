import { defineStore } from 'pinia'
import { initReserve } from '@/api/reader'
import { initReserveList } from '@/api/admin'
const useReserveStore = defineStore('reserve', {
  state: () => {
    return {
      // 全部读者的预约记录
      reserveList: [],
      // 某个读者的预约记录
      reserve: [],
    }
  },

  getters: {

  },

  actions: {
    // 读者查询预约记录
    initReserve(readerId) {
      initReserve({ readerId: readerId }).then(res => {
        console.log(res);
        this.reserve = res.data
        this.reserve.forEach((element) => {
          element.bookName = '《' + element.bookName + '》'
        })
        console.log(this.reserve);
      }, err => {
        console.log(err.message);
        console.log(readerId);
      })
    },
    initReserveList() {
      initReserveList().then(res => {
        console.log(res);
        this.reserveList = res.data
        this.reserveList.forEach((element) => {
          element.bookName = '《' + element.bookName + '》'
        })
        console.log(this.reserveList);

      }, err => console.log(err.message))
    },
  }
})

export default useReserveStore