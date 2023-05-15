import { defineStore } from "pinia";
import { initReaderList } from '@/api/admin'

const useUserStore = defineStore('user', {
  state: () => {
    return {
      readerInfo: {},
      adminName: '',
      isAdmin: false,
      readerList: [],
    }
  },
  actions: {
    // 设置管理员信息
    setAdminInfo(data) {
      console.log(data);
      this.adminName = data.adminName
      this.isAdmin = data.admin
      this.readerInfo = {};
      // console.log("adminName", this.adminName);
      // console.log("isAdmin", this.isAdmin);
    },

    // 设置读者信息
    setReaderInfo(data) {
      console.log("传入actions", data);
      let { readerId, readerName, phone, borrowTimes, email } = data
      this.readerInfo = { readerId, readerName, phone, borrowTimes, email }
      this.isAdmin = data.admin
      this.adminName = ''
      // console.log("传入store的数据", this.readerInfo);
      // console.log("传入store的数据", this.isAdmin);
    },

    // 获取读者列表
    initReaderList() {
      initReaderList().then(res => {
        this.readerList = res.data
        console.log(this.readerList)
      }).catch(err => console.log(err.message))
    },

    deleteLoginMessage() {
      this.$patch((state) => {
        state.adminName = ''
        state.isAdmin = ''
        state.readerInfo = {}
        state.readerList = []
      })
    }
  },
  persist: true,
})

export default useUserStore;