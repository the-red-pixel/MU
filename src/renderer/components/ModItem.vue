<template>
  <mu-list-item avatar button :ripple="false">
    <mu-list-item-action>
      <mu-icon v-if="isLoading" class="loading" value="sync"></mu-icon>
      <mu-icon v-else value="inbox"></mu-icon>
    </mu-list-item-action>

    <mu-list-item-content>
      <mu-list-item-title>{{ value.name }}</mu-list-item-title>
      <mu-list-item-sub-title>{{ value.desc || '-' }}</mu-list-item-sub-title>
    </mu-list-item-content>

    <mu-list-item-action>
      <mu-checkbox :input-value="value.installed" color="success" uncheck-icon="radio_button_unchecked" checked-icon="check_circle" :ripple="false"></mu-checkbox>
    </mu-list-item-action>
  </mu-list-item>
</template>

<script>

export default {
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isLoading: false
    }
  },
  created () {
    this.getModDetail()
  },
  methods: {
    getModDetail () {
      const { projectId, fileId } = this.value
      if (!projectId || !fileId) {
        return
      }
      this.$store.commit('increaseModItemLoading')
      this.isLoading = true
      this.$http.get(`https://cursemeta.dries007.net/${projectId}/${fileId}.json`).then(({ data }) => {
        this.isLoading = false
        this.$store.commit('decreaseModItemLoading')
        this.$store.commit('updateMod', {
          projectId,
          fileId,
          content: {
            name: this.value.name ? this.value.name : data.DisplayName,
            link: data.DownloadURL
          }
        })
      }).catch(err => {
        this.isLoading = false
        this.$store.commit('decreaseModItemLoading')
        this.$store.dispatch('showToast', err.message)
        throw err
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
