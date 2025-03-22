import {
  ref,
} from 'vue'

/**
 * @description 设置state
 * @param {*} defaultVal 初始值
 * @returns {[{value: any}, (any)=>void]}
 */
export const useState = (defaultVal) => {
  const showKeyWord = ref(defaultVal)
  const setShowKeyWord = (val) => showKeyWord.value = val
  return [showKeyWord, setShowKeyWord]
}

/**
 * @description 获取元素位置
 * @param { ComponentInternalInstance } vueInstance vue实例
 * @param { string } selector demo元素选择器
 * @returns { Promise<{
    bottom: number
    height: number
    left: number
    right: number
    scrollHeight: number
    scrollLeft: number
    scrollTop: number
    scrollWidth: number
    top: number
    width: number
    }> }
 */
export const useRect = (vueInstance, selector) => {
  return new Promise((resolve, reject) => {
    try {
      const view = uni.createSelectorQuery().in(vueInstance).select(selector)
      view.fields({
        size: true,
        rect: true,
        scrollOffset: true
      },
        res => resolve(res)
      ).exec()

    } catch (e) {
      reject(e)
    }
  })
}
