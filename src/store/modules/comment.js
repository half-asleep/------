import { defineStore } from 'pinia'
import { initCommentList } from '@/api/reader'

const useCommentStore = defineStore('comment', {
  state: () => {
    return {
      commentList: []
    }
  },

  actions: {
    // 保存评论列表
    initCommentList() {
      initCommentList().then(res => {
        this.commentList = res.data
        console.log(this.commentList)
      }).catch(err => console.log(err.message))
    }
  }
})

export default useCommentStore



