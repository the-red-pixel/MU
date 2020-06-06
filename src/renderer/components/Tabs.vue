<template>
  <div class="tabs">
    <mu-tabs :value="active" @update:value="onChange" inverse color="secondary" full-width text-color="rgba(0, 0, 0, .54)">
      <mu-tab @click="onTabClick(false)">
        <mu-icon value="new_releases"></mu-icon>
        <span>必装</span>
      </mu-tab>
      <mu-tab @click="onTabClick(true)">
        <mu-icon value="indeterminate_check_box"></mu-icon>
        可选
      </mu-tab>
    </mu-tabs>
  </div>
</template>

<script>
export default {
  props: {
    active: Number
  },
  data () {
    return {
      clickCount: 0
    }
  },
  computed: {
    fileList () {
      return this.$store.state.app.fileList
    }
  },
  watch: {
    clickCount () {
      if (this.clickCount === 5) {
        this.$utils.saveTemplateFile(this.fileList)
        this.clickCount = 0
      }
    }
  },
  methods: {
    onTabClick (last) {
      if (last) {
        this.clickCount++
      } else {
        this.clickCount = 0
      }
    },
    onChange (val) {
      this.$store.commit('updateActiveTab', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  position: relative;
}
</style>
