import useUserStore from './modules/user'
import useBookStore from './modules/book'
import useCommentStore from './modules/comment'
import useReserveStore from './modules/reserve'
import useBorrowStore from './modules/borrow'

const useStore = {
  user: useUserStore,
  book: useBookStore,
  comment: useCommentStore,
  reserve: useReserveStore,
  borrow: useBorrowStore,
}

export default useStore