<template>
  <div v-loading="fullLoading" element-loading-background="rgba(0, 0, 0, 0.7)" :element-loading-text="loadingTest"
    :element-loading-spinner="svg" element-loading-svg-view-box="-10, -10, 50, 50" class="background">
    <h1 class="h1">欢迎登录图书管理系统</h1>
    <div class="container" :class="{ 'right-panel-active': flag }">
      <!-- 注册 -->
      <div class="container_form container_signup">
        <form class="form" id="form1">
          <h2 class="form_title">注册</h2>
          <input type="text" placeholder="readerName" class="input" v-model="registerMsg.readerName" />
          <input type="tel" placeholder="phoneNumber" class="input" v-model="registerMsg.phone" />
          <input type="email" placeholder="email" class="input" v-model="registerMsg.email" />
          <input type="password" placeholder="Password" class="input" v-model="registerMsg.pwd" />
          <el-button class="btn" @click="sendRegisterMsg">Sign Up</el-button>
        </form>
      </div>

      <!-- 登录 -->
      <div class="container_form container_signin">
        <form action="" class="form">
          <h2 class="form_title" v-html="isAdmin ? '管理员登录' : '学生登录'"></h2>
          <el-button type="primary" v-if="isAdmin" plain class="button"
            @click="isAdmin = false; loginMsg.phone = ''; loginMsg.pwd = '';">学生登录</el-button>
          <el-button type="primary" v-else plain class="button"
            @click="isAdmin = true; loginMsg.phone = ''; loginMsg.pwd = '';">管理员登录</el-button>
          <input type="text" placeholder="PhoneNumber" class="input" v-model="loginMsg.phone">
          <input type="password" placeholder="password" class="input" v-model="loginMsg.pwd">
          <a href="#" class="link">Forgot your password?</a>
          <el-button class="btn" @click="sendLoginMsg">Sign In</el-button>
        </form>
      </div>

      <!-- 切换登录注册 -->
      <div class="container_overlay">
        <div class="overlay">
          <div class="overlay_panel overlay_left">
            <el-button class="btn" @click="flag = 0; registerMsg.readerName = ''; registerMsg.phone = '';
            registerMsg.email = ''; registerMsg.pwd = '';">sign in</el-button>
          </div>
          <div class="overlay_panel overlay_right">
            <el-button class="btn" @click="flag = 1; loginMsg.phone = ''; loginMsg.pwd = '';">sign up</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { register, login } from '@/api/reader'
import qs from "qs"
import useStore from '@/store'
import { mapStores } from 'pinia'
export default {
  data() {
    return {
      loginloading: false,
      registerloading: false,
      svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `,
      flag: false,
      isAdmin: false,
      loginMsg: {
        phone: '',
        pwd: ''
      },
      registerMsg: {
        readerName: '',
        email: '',
        phone: '',
        pwd: ''
      },
    }
  },
  // 加载
  computed: {
    fullLoading() {
      if (this.loginloading || this.registerloading)
        return true
      else
        return false
    },
    loadingTest() {
      if (this.loginloading && !this.registerloading)
        return "正在登录..."
      if (!this.loginloading && this.registerloading)
        return "正在注册..."
      else
        return "拼命加载中..."
    },
    ...mapStores(useStore.user, useStore.book),
  },

  methods: {
    // 注册
    sendRegisterMsg() {
      if (this.registerMsg.userName === '') {
        ElMessage({
          message: '用户名不能为空',
          type: 'error',
        })
        return;
      }
      else if (this.registerMsg.phone === '') {
        ElMessage({
          message: '手机号不能为空',
          type: 'error',
        })
        return;
      }
      else if (this.registerMsg.email === '') {
        ElMessage({
          message: '邮箱不能为空',
          type: 'error',
        })
        return;
      }
      else if (this.registerMsg.pwd === '') {
        ElMessage({
          message: '密码不能为空',
          type: 'error',
        })
        return;
      }
      this.registerloading = true
      setTimeout(() => {
        this.registerloading = false
      }, 1500)
      let data = {
        readerName: this.registerMsg.readerName,
        email: this.registerMsg.email,
        phone: this.registerMsg.phone,
        password: this.registerMsg.pwd,
      }
      register(qs.stringify(data)).then(res => {
        console.log(res);
        if (res.data === "注册成功！") {
          ElMessage({
            message: res.data,
            type: 'success',
          })
          this.flag = 0
        } else {
          ElMessage({
            message: res.data,
            type: 'error',
          })
        }
      })
        .catch(err => {
          console.log(err.message);
          ElMessage({
            message: '注册失败！',
            type: 'error',
          })
        })
        .then(() => {
          this.registerloading = false
          this.registerMsg.readerName = ''
          this.registerMsg.phone = ''
          this.registerMsg.email = ''
          this.registerMsg.pwd = ''
        })
    },

    // 登录
    sendLoginMsg() {
      if (!this.loginMsg.phone) {
        ElMessage({
          message: '手机号不能为空',
          type: 'error',
        })
        return;
      } else if (!this.loginMsg.pwd) {
        ElMessage({
          message: '密码不能为空',
          type: 'error',
        })
        return;
      }
      this.loginloading = true
      setTimeout(() => {
        this.loginloading = false
      }, 1500)
      let data = {
        phone: this.loginMsg.phone,
        password: this.loginMsg.pwd,
        isAdmin: this.isAdmin
      }
      login(data).then(res => {
        console.log(res);
        if (res.data != "") {
          ElMessage({
            message: "登录成功！",
            type: 'success',
          })
          if (this.isAdmin) {
            this.userStore.setAdminInfo(res.data)
            localStorage.setItem('loginMessage', "管理员已登录")
          }
          else {
            this.userStore.setReaderInfo(res.data)
            localStorage.setItem('loginMessage', "读者已登录")
          }
          this.bookStore.initBookList()

          this.$router.push('/home')
        } else {
          ElMessage({
            message: '用户名或密码错误',
            type: 'error',
          })
        }
      })
        .catch(err => {
          console.log(err.message);
          ElMessage({
            message: '登录失败！',
            type: 'error',
          })
        })
        .then(() => {
          this.loginMsg.phone = ''
          this.loginMsg.pwd = ''
          this.loginloading = false
        })
    }
  }
}
</script>

<style scoped>
.background {
  /* 开启绝对定位后宽高百分比是相对于浏览器窗口的，而不是父级<div> */
  position: absolute;
  background: url("../assets/background.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.h1 {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  position: relative;
  z-index: 100;
  margin-top: -150px;
  margin-bottom: 50px;
  /* bottom: 10%; */
  /* bottom: 0; */
  font-size: 40px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  color: #0179b9;
}

.container {
  border-radius: 0.7rem;
  height: 420px;
  max-width: 758px;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.container_form {
  height: 100%;
  position: absolute;
  top: 0;
  /* 设置过渡效果： */
  transition: all 0.6s ease-in-out;
}

.container_signin {
  left: 0;
  width: 50%;
}

.container_signup {
  left: 0;
  /* 设置隐藏 */
  Visibility: hidden;
  width: 50%;
  z-index: 8;
}

.form {
  background-color: #e9e9e9;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
    0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  text-align: center;
}

.form_title {
  font-weight: 300;
  margin: 0;
  margin-bottom: 1.25rem;
}

.input {
  background-color: #fff;
  border: none;
  padding: 0.9rem 0.9rem;
  margin: 0.5rem 0;
  width: 100%;
}

.link {
  color: #333;
  font-size: 0.9rem;
  margin: 1.5rem 0;
  /* 去下划线 */
  text-decoration: none;
}

.btn {
  background-color: #095c91;
  background-image: linear-gradient(90deg, #095c91 0%, #0393a3 74%);
  border-radius: 20px;
  border: 0.2px solid #315a7491;
  color: #e9e9e9;
  height: 42px;
  /* 移入后鼠标的样式 */
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  /* 字间距 */
  letter-spacing: 0.1rem;
  padding: 0.9rem 4rem;
  /* 大写 */
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

.form>.btn {
  margin-top: 1.5rem;
}

.btn:active {
  /* 改变按钮比例 */
  transform: scale(0.95);
}

.btn:hover {
  background: #FFF;
  color: #409EFF;
}

.button {
  font-size: 12px;
  height: 28px;
}








/* 切换登录/注册样式 */
.container_overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  /* 以慢速开始和结束的过渡效果 */
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.right-panel-active .container_overlay {
  /* 可见浮层整体向左移动 */
  transform: translateX(-100%);
}

.overlay {
  /* 设置浮层背景颜色及透明度 */
  background-color: rgba(255, 255, 255, 0.25);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transition: transform 0.6s ease-in-out;
  width: 200%;
}


.right-panel-active .overlay {
  /* 浮层整体向右移动 */
  transform: translateX(50%);
}

/* 登录注册的移动 */
.right-panel-active .container_signup {
  Visibility: visible;
  transform: translateX(100%);
}

.right-panel-active .container_signin {
  Visibility: hidden;
  transform: translateX(100%);
}


/* 切换按钮的移动 */
.overlay_panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay_left {
  /* 实现登录按钮的移入移出，点击登录按钮时向左移动20% */
  transform: translateX(-20%);
}

.right-panel-active .overlay_left {
  /* 实现登录按钮的移入移出，点击注册按钮时向右移动20% */
  transform: translateX(0);
}

.overlay_right {
  right: 0;
  /* 实现注册按钮的移入移出，点击登录按钮时相对原来位置向左移动20% */
  transform: translateX(0);
}

.right-panel-active .overlay_right {
  /* 实现注册按钮的移入移出，点击注册按钮时相对原来位置向右移动20% */
  transform: translateX(20%);
}
</style>