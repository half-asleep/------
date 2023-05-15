// axios管理员的请求
import requests from './request'

// 管理员删除图书
export const delBook = (infoObj) => requests({
  url: '/delbook',
  method: 'delete',
  params: infoObj
})

// 修改图书信息
export const changeBookInfo = (infoObj) => requests({
  url: '/changebookinfo',
  method: 'patch',
  data: infoObj
})

//添加图书
export const addBook = (infoObj) => requests({
  url: '/adminaddbook',
  method: 'post',
  data: infoObj
})

// 获取全部读者信息
export const initReaderList = () => requests({
  url: '/initreaderlist',
  method: 'get',
})

// 删除用户
export const delPerson = (infoObj) => requests({
  url: '/delperson',
  method: 'delete',
  params: infoObj
})

// 查询全部预约记录
export const initReserveList = () => requests({
  url: '/reservelist',
  method: 'get'
})

// 查询全部借阅记录
export const initBorrowList = () => requests({
  url: '/borrowslist',
  method: 'get'
})

// 删除借阅记录
export const deleteBorrow = (borrowObj) => requests({
  url: '/deleteborrow',
  method: 'delete',
  params: borrowObj
})

// 通过读者ID或书籍ID查询借阅记录
export const searchBorrow = (infoObj) => requests({
  url: '/searchborrow',
  method: 'get',
  params: infoObj
})

// 管理员提醒读者还书
export const alertPerson = (infoObj) => requests({
  url: '/alertperson',
  method: 'post',
  data: infoObj
})