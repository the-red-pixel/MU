<template>
  <div class="appbar" @dblclick.stop="onDblClick">
    <div class="btn close" @click.stop="close"></div>
    <div class="btn min" @click.stop="minimize"></div>
    <div class="btn max" @click.stop="onDblClick"></div>
    <div class="title">
      TRP 模组更新器
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    close () {
      this.$electron.remote.BrowserWindow.getFocusedWindow().close()
    },
    minimize () {
      this.$electron.remote.BrowserWindow.getFocusedWindow().minimize()
    },
    maximize () {
      this.$electron.remote.BrowserWindow.getFocusedWindow().maximize()
    },
    fit () {
      const window = this.$electron.remote.BrowserWindow.getFocusedWindow()
      window.setSize(...window.getMinimumSize(), true)
      // 无动画，效果差
      // window.center()
    },
    onDblClick () {
      const isMaximized = this.$electron.remote.BrowserWindow.getFocusedWindow().isMaximized()
      if (isMaximized) {
        this.fit()
      } else {
        this.maximize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.appbar {
  position: relative;
  display: flex;
  height: 28px;
  align-items: center;
  padding: 0 6px;
  user-select: none;
  .title {
    position: absolute;
    color: 333;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
  .btn {
    width: 12px;
    height: 12px;
    border-radius: 12px;
    margin: 0 4px;
    cursor: pointer;
    -webkit-app-region: no-drag;
  }
  .close {
    background: #ed6659;
  }
  .min {
    background: #e0c04c;
  }
  .max {
    background: #72be46;
  }
}
</style>
