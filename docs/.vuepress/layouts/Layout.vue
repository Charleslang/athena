<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="footer" id="app-page-bottom">
        <div class="footer-container">
          <div class="footer-text">
            <span class="left">[ 纸上得来终觉浅</span>
            <span class="footer-text-icon">
              <span class="iconfont icon-shandian1"></span>
            </span>
            <span class="right">绝知此事要躬行 ]</span>
          </div>
          Copyright © 2021-present Junfeng Dai <br> 
          <a href="https://beian.miit.gov.cn" class="record-num" target="_blank">蜀ICP备2021009537号</a>
        </div>
      </div>
    </template>
  </ParentLayout>
</template>

<script setup>
  import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
</script>

<style lang="css" scoped>
  #app-page-bottom {
    position: relative;
    padding: 1rem 0 0;
    max-width: var(--content-width);
    margin: 0 auto;
    text-align: center;
    overflow: auto;
    background: rgba(255, 255, 255, 0);
  }
  #app-page-bottom .footer-container {
    margin-bottom: 0;
  }
</style>