import DefaultTheme from 'vitepress/theme'
import Counter from '../components/Counter.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import CodeSnippet from '../components/CodeSnippet.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('Counter', Counter)
    app.component('ReadingProgress', ReadingProgress)
    app.component('CodeSnippet', CodeSnippet)
  }
}
