<template>
  <mu-dialog width="360" :open="isLoading">
    正在读取本地文件...
    <mu-linear-progress mode="determinate" :value="progress"></mu-linear-progress>
  </mu-dialog>
</template>

<script>

export default {
  computed: {
    isLoading () {
      return this.$store.getters.isLoading
    },
    fileCount () {
      return this.$store.state.app.fileCount
    },
    loadedFileCount () {
      return this.$store.state.app.loadedFileCount
    },
    progress () {
      if (!this.fileCount) {
        return 0
      }
      return (this.loadedFileCount / this.fileCount) * 100
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
