
import {each} from 'underline'

import walk from 'walk'

import mklog from '../../util/log'
const log = mklog('configure/compute-size')

async function computeFolderSize (opts, appPath) {
  log(opts, `computing size of ${appPath}`)
  const walker = walk.walk(appPath, {followLinks: false})

  let totalSize = 0
  walker.on('file', (root, fileStats, next) => {
    totalSize += fileStats.size
    next()
  })

  walker.on('errors', (root, nodeStatsArray, next) => {
    nodeStatsArray::each((n) => {
      log(opts, `error while walking ${n.name}:`)
      log(opts, n.error.message || (n.error.code + ': ' + n.error.path))
    })
    next()
  })

  await new Promise((resolve, reject) => {
    walker.on('end', resolve)
  })
  return totalSize
}

export default {computeFolderSize}
