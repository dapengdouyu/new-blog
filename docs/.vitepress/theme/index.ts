import DefaultTheme from 'vitepress/theme'
import Counter from '../components/Counter.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import CodeSnippet from '../components/CodeSnippet.vue'
import Tabs from '../components/Tabs.vue'
import Alert from '../components/Alert.vue'
import Card from '../components/Card.vue'
import Timeline from '../components/Timeline.vue'
import PythonRunner from '../components/PythonRunner.vue'
import JupyterLite from '../components/JupyterLite.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('Counter', Counter)
    app.component('ReadingProgress', ReadingProgress)
    app.component('CodeSnippet', CodeSnippet)
    app.component('Tabs', Tabs)
    app.component('Alert', Alert)
    app.component('Card', Card)
    app.component('Timeline', Timeline)
    app.component('PythonRunner', PythonRunner)
    app.component('JupyterLite', JupyterLite)
  }
}
