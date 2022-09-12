<template>
  <div>
    <!-- keep-alive路由缓存 -->
    <keep-alive exclude="Search,SearchResult,ArticleDetail,Chat">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
