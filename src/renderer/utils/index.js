import electron from 'electron'
import fs from 'fs'
import path from 'path'
import md5 from 'md5'
import allSettled from 'promise.allsettled'
import store from '@/store'
import axios from 'axios'
// import { BrowserWindow } from 'electron'

export const MenuType = {
  REQUIRED: 0,
  OPTIONAL: 1
}

export const openDir = (window) => {
  return electron.remote.dialog.showOpenDialog(window, {
    properties: ['openDirectory', 'showHiddenFiles'],
    message: '选择 mods 目录'
  })
}

export const forceOpenDir = (window) => {
  let path = openDir(window)
  while (!path) {
    path = openDir(window)
  }
  return path[0]
}

export const getCurrentDir = () => electron.remote.app.getAppPath()

export const readDirPromise = (fullPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(fullPath, (err, nameList) => {
      if (err) {
        reject(err)
        return
      }
      resolve(nameList)
    })
  })
}

export const readFilePromise = (fullPath, name) => {
  return new Promise((resolve) => {
    fs.readFile(path.join(fullPath, name), (err, buf) => {
      if (err || !name.endsWith('.jar')) {
        // reject 只能携带 Error
        resolve({
          err: err || 'Not a jar file',
          name
        })
        return
      }
      resolve({
        buf,
        name
      })
    })
  })
}

export const md5Promise = (buf) => {
  return new Promise((resolve, reject) => {
    try {
      const hash = md5(buf)
      resolve(hash)
    } catch (err) {
      reject(err)
    }
  })
}

// export const createProcess = () => {
//   const workerWindow = new BrowserWindow({
//     show: false,
//     webPreferences: { nodeIntegration: true }
//   })
// }

export const scanFiles = (fullPath) => {
  // TODO: 解决一下同步造成的渲染卡顿
  return readDirPromise(fullPath).then(async nameList => {
    store.commit('updateFileCount', nameList.length)
    const list = []
    const errorList = []
    const promises = nameList.map(name => {
      return readFilePromise(fullPath, name)
    })
    const result = await allSettled(promises).then(results => {
      results.forEach(item => {
        // readFilePromise 会将失败也算作是 resolve
        if (item.value && item.value.buf instanceof Buffer) {
          // 使用 promise 没有意义，md5 计算是 cpu 密集型的
          const hash = md5(item.value.buf)
          list.push({
            hash,
            name: item.value.name
          })
          // TODO: 不应该这么做，但暂时没有更好的办法
          store.commit('increaseLoadedFileCount')
          return
        }
        errorList.push(item)
        store.commit('increaseLoadedFileCount')
      })
      return {
        fileList: list,
        errorList
      }
    })
    return result
  })
}

export const isFileExisted = (fullPath) => {
  return fs.existsSync(fullPath)
}

export const saveTemplateFile = (existedInfoList) => {
  const content = existedInfoList.map(item => ({
    projectId: '',
    fileId: '',
    required: true,
    desc: '',
    name: item.name,
    hash: item.hash
  }))
  const fullPath = electron.remote.dialog.showOpenDialog({
    properties: ['openDirectory', 'showHiddenFiles'],
    message: '选择模版文件储存目录',
    buttonLabel: '保存'
  })
  if (!fullPath || !fullPath.length) {
    return
  }
  fs.writeFile(path.join(fullPath[0], 'template.json'), JSON.stringify({
    mods: content
  }), () => {
    console.log('saved')
  })
}

export const writeFilePromise = (fullPath, data) => {
  return new Promise((resolve) => {
    fs.writeFile(fullPath, data, () => {
      resolve()
    })
  })
}

export const download = (link, fullPath) => {
  return new Promise((resolve, reject) => {
    axios.get(link, {
      responseType: 'blob'
    }).then(resp => {
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        fs.writeFile(fullPath, Buffer.from(new Uint8Array(event.target.result)), (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        })
      }
      fileReader.readAsArrayBuffer(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
  // await writeFilePromise(fullPath, resp.data)
}

// export const downloadWithElectron = (event, data) => {
//   const { link, fullPath } = data
//   const writer = fs.createWriteStream(fullPath)
//   axios.get(link, {
//     responseType: 'stream'
//   }).then(resp => {
//     resp.data.pipe(writer)
//     const totalSize = resp.headers['content-length']
//     let downloaded = 0
//     resp.data.on('data', (data) => {
//       downloaded += Buffer.byteLength(data)
//       event.sender.send('downloadProgress', { total: totalSize, loaded: downloaded })
//     })
//     resp.data.on('end', () => {
//       event.sender.send('downloadEnd')
//     })
//     resp.data.on('error', (error) => {
//       event.sender.send('downloadError', error)
//     }).catch((error) => {
//       event.sender.send('downloadError', error)
//     })
//   })
// }

// export const download = (link, fullPath) => {
//   return new Promise((resolve, reject) => {
//     electron.ipcRenderer.send('downloadFile', {
//       link,
//       fullPath
//     })
//     electron.ipcRenderer.on('downloadEnd', () => {
//       electron.ipcRenderer.removeAllListeners('downloadEnd')
//       electron.ipcRenderer.removeAllListeners('downloadError')
//       resolve()
//     })

//     electron.ipcRenderer.on('downloadError', (event, error) => {
//       electron.ipcRenderer.removeAllListeners('downloadEnd')
//       electron.ipcRenderer.removeAllListeners('downloadError')
//       reject(error)
//     })
//   })
// }

export const randomString = (length) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
