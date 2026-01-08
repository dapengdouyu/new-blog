<template>
  <div class="blog-audio-player">
    <audio 
      :src="src" 
      controls 
      :loop="loop" 
      :autoplay="autoplay"
      class="audio-element"
    >
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  loop: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.blog-audio-player {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.blog-audio-player:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.audio-element {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
}
</style>