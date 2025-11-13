<template >
  <div class="layout">
    <MyMenu></MyMenu>
    <MyContent></MyContent>
  </div>
</template>
<script>
import MyMenu from './MyMenu.vue'
import MyContent from './MyContent.vue'
export default {
  components:{
    MyMenu,
    MyContent
  }
}
</script>
<style>
.layout{
  display: flex;
  height: 100vh;
}
</style>
