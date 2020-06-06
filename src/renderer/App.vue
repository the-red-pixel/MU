<template>
  <div id="app">
    <div class="app-wrapper">
      <app-bar class="app-bar"></app-bar>
      <tabs class="app-tabs" :value="activeTab"></tabs>
      <mod-menu class="app-menu" :type="activeTab"></mod-menu>
      <toolbar class="app-toolbar"></toolbar>
    </div>
    <toast></toast>
    <loading></loading>
    <tutorial></tutorial>
  </div>
</template>

<script>
import Tabs from '@/components/Tabs.vue'
import Loading from '@/components/Loading.vue'
import Tutorial from '@/components/Tutorial.vue'
import Toast from '@/components/Toast.vue'
import ModMenu from '@/components/ModMenu.vue'
import Toolbar from '@/components/Toolbar.vue'
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'modpack-updater',
  components: {
    Tabs,
    Loading,
    Toast,
    ModMenu,
    Toolbar,
    Tutorial,
    AppBar
  },
  computed: {
    activeTab () {
      return this.$store.state.app.activeTab
    }
  },
  created () {
    this.$store.dispatch('updateModsInfo')
    this.$store.dispatch('loadNativeFiles', true)
  }
}
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
  margin: 0;
}
.app-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  .app-bar {
    position: relative;
    flex-shrink: 0;
    -webkit-app-region: drag;
  }
  .app-tab {
    position: relative;
    flex-shrink: 0;
  }
  .app-menu {
    position: relative;
    flex-grow: 1;
  }
  .app-toolbar {
    position: relative;
    flex-shrink: 0;
  }
}
</style>
