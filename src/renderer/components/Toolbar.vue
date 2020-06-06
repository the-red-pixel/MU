<template>
  <div class="toolbar">
    <mu-button icon color="secondary" @click="onQuestionMarkClick">
      <mu-icon value="help_outline"></mu-icon>
    </mu-button>
    <div style="padding: 0 10px; width: 100%;">
      <mu-linear-progress :value="progress" mode="determinate" color="primary"></mu-linear-progress>
    </div>
    <mu-button color="secondary" small :disabled="isButtonDisabled" @click="download">
      <mu-icon left :value="isButtonDisabled ? 'sync' : btn.icon" :class="{ loading: isButtonDisabled }"></mu-icon>
      {{ isDownloading ? '下载中...' : btn.text }}
    </mu-button>
  </div>
</template>

<script>
import { MenuType } from '@/utils'
import path from 'path'

const btnStatus = {
  DL_REQUIRED: {
    icon: 'get_app',
    text: '下载必装模组'
  },
  DL_OPTIONAL: {
    icon: 'get_app',
    text: '下载可选模组'
  }
}

export default {
  data () {
    return {
      btn: btnStatus.DL_REQUIRED
    }
  },
  computed: {
    isDownloading () {
      return this.$store.state.download.isDownloading
    },
    totalCount () {
      return this.$store.state.download.totalCount
    },
    finishedCount () {
      return this.$store.state.download.finishedCount
    },
    progress () {
      return (this.finishedCount / this.totalCount) * 100
    },
    activeTab () {
      return this.$store.state.app.activeTab
    },
    requiredMods () {
      return this.$store.getters.requiredMods
    },
    optionalMods () {
      return this.$store.getters.optionalMods
    },
    modsPath () {
      return this.$store.state.app.modsPath
    },
    downloadList () {
      let list
      switch (this.activeTab) {
        case MenuType.REQUIRED:
          list = this.requiredMods
          break
        case MenuType.OPTIONAL:
          list = this.optionalMods
          break
        default:
          list = []
          break
      }
      return list.filter(it => !it.installed).map(it => {
        const split = it.link.split('/')
        const fileName = split.length <= 1 ? `${it.hash || this.$utils.randomString(8)}.jar` : split[split.length - 1]
        return {
          path: path.join(this.modsPath, fileName),
          link: it.link
        }
      })
    },
    hasModItemLoading () {
      return this.$store.getters.hasModItemLoading
    },
    isButtonDisabled () {
      return this.hasModItemLoading || this.isDownloading
    }
  },
  watch: {
    activeTab () {
      this.updateBtnState()
    }
  },
  methods: {
    download () {
      if (this.isDownloading) {
        this.$store.dispatch('showToast', '正在下载')
        return
      }
      if (!this.downloadList.length) {
        this.$store.dispatch('showToast', '下载清单为空')
        return
      }
      this.$store.commit('clearDlStore')
      this.$store.dispatch('startDownload', this.downloadList)
    },
    onQuestionMarkClick () {
      this.$store.commit('updateShowTutorial', true)
    },
    updateBtnState () {
      if (this.activeTab === MenuType.REQUIRED) {
        this.btn = btnStatus.DL_REQUIRED
        return
      }
      if (this.activeTab === MenuType.OPTIONAL) {
        this.btn = btnStatus.DL_OPTIONAL
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  height: 48px;
  padding: 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-around;
  box-shadow: 0 5px 5px 5px rgba(0, 0, 0, 0.1);
}
.loading {
  animation-name: rotate;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(-359deg);
  }
}
</style>
