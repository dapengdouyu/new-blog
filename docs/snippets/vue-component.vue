<template>
  <div class="hello-world">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Hello World'
  }
})

const message = ref('Welcome to Vue!')
const count = ref(0)
</script>

<style scoped>
.hello-world {
  text-align: center;
  padding: 2rem;
}

button {
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #359c6d;
}
</style>
