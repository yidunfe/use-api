export default function createFetch(...datas: any[]) {
  let count = 0
  let len = datas.length
  return function fetch() {
    const index = count % len
    const p = new Promise((resolve, reject) => {
      resolve(datas[index])
    })
    count++
    return p
  }
}

export function createErrorFetch(error: any) {
  return function() {
    return Promise.reject(error)
  }
}
