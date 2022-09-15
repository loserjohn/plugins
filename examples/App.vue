<!--
 * @Author       : xh
 * @Date         : 2022-06-21 19:45:09
 * @LastEditors  : xh
 * @FileName     :   
-->
<template>
  <div id="app">
    <el-container direction="vertical">
      <!-- <YpDan title="默认" />
      <YpMounthPicker v-model="mounth" :yearlength="20" show-sum show-tips /> -->
      <el-header class="herader"> <h2>yl_plugins组件库</h2> </el-header>
      <el-container direction="horizontal">
        <el-aside width="200px">
          <el-menu default-active="2" class="el-menu-vertical-demo" style="height: 92vh">
            <!-- <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>常用组件 </span>
              </template> -->
            <el-menu-item index="1-1">
              <router-link :to="{ name: 'dan' }">子弹统计图</router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
              <router-link :to="{ name: 'multimounth' }">月份多选器</router-link>
            </el-menu-item>
            <el-menu-item index="1-3">
              <router-link :to="{ name: 'skus' }">skus生成器</router-link>
            </el-menu-item>
            <el-menu-item index="1-3">
              <router-link :to="{ name: 'citys' }">城市选择器</router-link>
            </el-menu-item>
            <el-menu-item index="1-4">
              <router-link :to="{ name: 'mounthRanges' }">月份范围选择器</router-link>
            </el-menu-item>
            <!-- </el-submenu> -->
            <!-- <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>页面模板 </span>
              </template>
              <el-menu-item index="1-1">1</el-menu-item>
              <el-menu-item index="1-2">2</el-menu-item>
            </el-submenu> -->
          </el-menu>
        </el-aside>
        <el-container direction="vertical" style="height: 92vh" class="markdown-body">
          <el-main height="">
            <router-view />
          </el-main>
          <!-- <el-footer height=""> xUI </el-footer> -->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import Test from './components/Test'
export default {
  name: 'App',
  components: {
    // Test
  },
  mounted() {
    // this.$request('http://rest.apizza.net/mock/8b3df8e547994a420afc353aafe94efd/pro')
    // this.$request('http://rest.apizza.net/mock/8b3df8e547994a420afc353aafe94efd/pro')
    // this.$request('http://rest.apizza.net/mock/8b3df8e547994a420afc353aafe94efd/pro')
    // this.$request('http://rest.apizza.net/mock/8b3df8e547994a420afc353aafe94efd/pro')
  }
}
</script>

<style>
.herader {
  border-bottom: 1px solid #eee;
}
</style>
