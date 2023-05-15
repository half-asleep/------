<template>
  <div>
    <div class="header">
      <el-page-header @back="goBack" class="back">
        <template #title>
          <span>返回</span>
        </template>
        <template #content>
          <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="content"> &nbsp;图书管理系统</span>
        </template>
      </el-page-header>
      <img src="@/assets/library.png" alt="">
    </div>

    <el-container>
      <el-aside width="23%" class="aside">
        <AdminBanner v-if="isAdmin" ref="admin" class="aside-Banner" />
        <ReaderBanner v-else ref="reader" class="aside-Banner" />
      </el-aside>
      <el-main style="padding:0;">
        <div class="tablemain">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import useStore from '@/store';
import { mapState } from 'pinia';
import AdminBanner from '@/components/AdminBanner.vue';
import ReaderBanner from '@/components/ReaderBanner.vue';
export default {
  components: { AdminBanner, ReaderBanner },
  data() {
    return {

    }
  },
  computed: {
    ...mapState(useStore.user, ['isAdmin'])
  },
  methods: {
    goBack() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.header {
  margin-left: 8px;
  margin-top: 10px;
  text-align: center;
  color: rgb(16, 148, 93);

}

.back {
  position: fixed;
  top: 10px;
}

.content {
  font-weight: bold;
  vertical-align: 8px;
}

.header>img {
  height: 120px;
  margin-left: 70px;
}

/* .aside {
  position: relative;
} */

.aside-Banner {
  position: fixed;
}

.tablemain {
  width: 73%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  border-radius: 1px;
  margin: 20px 0px 30px 30px;
  padding: 20px;
  min-height: 450px
}
</style>