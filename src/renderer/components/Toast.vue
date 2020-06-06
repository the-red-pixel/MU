<template>
  <div class="wrapper">
    <div class="toast" :class="{ hide: !status }">
      {{ text }}
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    text () {
      return this.$store.state.toast.text
    },
    status () {
      return this.$store.state.toast.status
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  .toast {
    position: absolute;
    text-align: center;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 10px;
    background: rgba(0, 0, 0, 0.5);
    color:white;
    border-radius: 4px;
    transition: all 0.5s ease-in-out;
  }
  .toast.hide {
    opacity: 0;
  }
}
</style>
