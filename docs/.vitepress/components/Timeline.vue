<template>
  <div class="timeline">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="timeline-item"
    >
      <div class="timeline-marker">
        <slot name="marker" :item="item" :index="index">
          <div class="default-marker"></div>
        </slot>
      </div>
      <div class="timeline-content">
        <div class="timeline-title">
          <slot name="title" :item="item" :index="index">
            {{ item.title }}
          </slot>
        </div>
        <div class="timeline-date">
          <slot name="date" :item="item" :index="index">
            {{ item.date }}
          </slot>
        </div>
        <div class="timeline-description">
          <slot name="content" :item="item" :index="index">
            {{ item.content }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimelineItem {
  title: string
  date: string
  content: string
}

interface Props {
  items: TimelineItem[]
}

defineProps<Props>()
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-border);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-marker {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: var(--vp-c-brand);
  border: 2px solid var(--vp-c-bg);
}

.timeline-content {
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
}

.timeline-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.timeline-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
}

.timeline-description {
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
