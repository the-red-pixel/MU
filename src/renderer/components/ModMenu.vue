<template>
  <div class="menu">
    <mu-list full-width textline="two-line">
      <!-- TODO: 这里最好加个缓存 -->
      <mod-item v-for="(mod, index) in items" :key="index" :value="mod"></mod-item>
      <no-data v-if="!items.length"></no-data>
    </mu-list>
  </div>
</template>

<script>
import ModItem from './ModItem.vue'
import NoData from './NoData.vue'
import { MenuType } from '@/utils/'

export default {
  components: {
    ModItem,
    NoData
  },
  props: {
    type: Number
  },
  computed: {
    requiredMods () {
      return this.$store.getters.requiredMods
    },
    optionalMods () {
      return this.$store.getters.optionalMods
    },
    items () {
      switch (this.type) {
        case MenuType.REQUIRED:
          return this.requiredMods
        case MenuType.OPTIONAL:
          return this.optionalMods
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  height: 100%;
  overflow: auto;
}
</style>
