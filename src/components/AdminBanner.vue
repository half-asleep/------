<template>
  <div class="main">
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px" size="large">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>

    <!-- 侧栏 -->
    <el-menu :default-active="activeIndex" :collapse="isCollapse" active-text-color="#febb00" class="menu" router>
      <el-menu-item index="/home/searchbook">
        <el-icon>
          <Document />
        </el-icon>
        <template #title><span>图书管理</span></template>
      </el-menu-item>

      <el-menu-item index="/home/adminaddbook">
        <el-icon>
          <DocumentAdd />
        </el-icon>
        <template #title><span>添加图书</span></template>
      </el-menu-item>

      <el-menu-item index="/home/person">
        <el-icon>
          <List />
        </el-icon>
        <template #title><span>人员管理</span></template>
      </el-menu-item>

      <el-menu-item index="/home/adminreserve">
        <el-icon>
          <Promotion />
        </el-icon>
        <template #title><span>预约记录</span></template>
      </el-menu-item>

      <el-menu-item index="/home/adminborrow">
        <el-icon>
          <el-icon>
            <DocumentCopy />
          </el-icon>
        </el-icon>
        <template #title><span>借阅记录</span></template>
      </el-menu-item>

      <el-menu-item index="/home/comment">
        <el-icon>
          <Comment />
        </el-icon>
        <template #title><span>交流社区</span></template>
      </el-menu-item>

      <el-menu-item index="/home/introduce">
        <el-icon>
          <User />
        </el-icon>
        <template #title><span>管理员信息</span></template>
      </el-menu-item>

      <el-sub-menu index="6">
        <template #title>
          <el-icon>
            <Setting />
          </el-icon>
          <span>设置</span>
        </template>
        <el-menu-item index="/">
          <template #title>
            <el-icon>
              <Expand />
            </el-icon>
            <span>切换账号</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/" @click="exit">
          <template #title>
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>退出账号</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
import useStore from '@/store';
export default {
  data() {
    return {
      isCollapse: false,
    }
  },
  methods: {
    exit() {
      localStorage.setItem('loginMessage', "退出登录")
      useStore.user().deleteLoginMessage();

    },
  },
  computed: {
    activeIndex() {
      return this.$route.path
    }
  },
}
</script>

<style scoped>

</style>