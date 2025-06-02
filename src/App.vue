<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import SidebarMenu from './components/SidebarMenu.vue';
</script>

<template>
  <div id="layout-wrapper" v-if="$route.meta.navbar">
      <Header></Header>
      <SidebarMenu></SidebarMenu>
      <router-view></router-view>
      <Footer v-if="$route.meta.footer"></Footer>
  </div>
  <router-view v-else></router-view>
</template>

<script>
export default {
  mounted() {
  }
}
</script>