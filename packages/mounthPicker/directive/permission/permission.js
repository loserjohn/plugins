import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const userBtnList = store.getters.userBtnList
  let hasPermission
  if (typeof value === 'string') {
    hasPermission = userBtnList.some((item) => {
      return item.component === value
    })
  } else if (value instanceof Array) {
    value.forEach((v) => {
      hasPermission = userBtnList.some((item) => {
        return item.component === v
      })
    })
  } else {
    throw new Error(`格式错误，应为：v-permission="aaa" 或 v-permission="['aaa','bbb']"`)
  }

  if (!hasPermission) {
    el.style.display = 'none'
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
