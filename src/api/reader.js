// 读者请求
import requests from './request'

// 注册
export const register = (readerInfo) => requests({
  url: '/register',
  method: 'post',
  data: readerInfo
})

//登录验证
export const login = (readerInfo) => requests({
  url: '/login',
  method: 'get',
  params: readerInfo
})

//查询全部书籍
export const initBookList = () => requests({
  url: '/books',
  method: 'get'
})

// 查询所有评论
export const initCommentList = () => requests({
  url: '/comments',
  method: 'get'
})

// 添加预约记录
export const addReserve = (reserveObj) => requests({
  url: '/addreserve',
  method: 'post',
  data: reserveObj
})

// 书名查找
export const searchBook = (bookNameObj) => requests({
  url: '/searchbook',
  method: 'get',
  params: bookNameObj
})

// 查询读者自己的预约记录
export const initReserve = (readerObj) => requests({
  url: '/reserve',
  method: 'get',
  params: readerObj
})

//取消预约
export const deleteReserve = (reserveObj) => requests({
  url: '/cancelreserve',
  method: 'delete',
  params: reserveObj
})

// 借书
export const addBorrow = (borrowObj) => requests({
  url: '/addborrow',
  method: 'post',
  data: borrowObj
})

// 查询读者自己的借阅记录
export const initBorrows = (readerId) => requests({
  url: '/borrows',
  method: 'get',
  params: readerId
})

// 还书
export const returnBook = (infoObj) => requests({
  url: '/returnbook',
  method: 'patch',
  data: infoObj
})

// 续借
export const continueBorrow = (infoObj) => requests({
  url: '/continueborrow',
  method: 'patch',
  data: infoObj
})

// 发表评论
export const addComment = (dataObj) => requests({
  url: '/addcomment',
  method: 'post',
  data: dataObj
})

// 点赞
export const addPraise = (dataObj) => requests({
  url: '/addpraise',
  method: 'patch',
  data: dataObj
})

// 删评论
export const delComment = (infoObj) => requests({
  url: '/delcomment',
  method: 'delete',
  params: infoObj
})