<template>
  <div class="tutorial">
    <mu-dialog width="480" title="使用说明" :open="isShowTutorial" @update:open="onClose">
      使用方法就和界面一样简单，模组分成两类，"必装"和"可选"，安装了"必装"的模组后就能进入服务器了
      <mu-button slot="actions" flat color="primary" @click="onClose">确定</mu-button>
    </mu-dialog>
  </div>
</template>

<script>

export default {
  computed: {
    isShowTutorial () {
      return this.$store.state.tutorial.isShowTutorial
    }
  },
  methods: {
    onClose () {
      this.$store.commit('updateShowTutorial', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
