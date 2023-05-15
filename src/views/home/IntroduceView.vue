<template>
  <div>

    <el-descriptions size="large" class="descriptions" title="个人信息">

      <el-descriptions-item label="用户名：" v-if="isAdmin">
        {{ adminName }}
      </el-descriptions-item>
      <el-descriptions-item label="昵称：" v-else>{{ readerInfo.readerName }}</el-descriptions-item>
      <el-descriptions-item label="手机号：" v-if="!isAdmin">{{ readerInfo.phone }}</el-descriptions-item>
      <el-descriptions-item label="邮箱：" v-if="!isAdmin">{{ readerInfo.email }}</el-descriptions-item>
      <el-descriptions-item label="备注：" v-if="isAdmin">
        <el-tag>管理员</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="备注：" v-else>
        <el-tag>学生用户</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="借书次数：" v-if="!isAdmin">{{ readerInfo.borrowTimes }}</el-descriptions-item>

    </el-descriptions>

  </div>
</template>

<script>
import useStore from '@/store';
import { mapState } from 'pinia';
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState(useStore.user, {
      isAdmin: 'isAdmin',
      adminName: 'adminName',
      readerInfo: 'readerInfo'
    }),
  }
}
</script>

<style scoped>

</style>