<template>
  <li class="post-item">
    <div class="head">
      <span class="tag">#{{ post.tag }}</span>
      <span class="date">{{ formatDate(post.createdAt) }}</span>
    </div>
    <h3>{{ post.title }}</h3>
    <p>{{ post.content }}</p>
    <div class="actions">
      <button @click="$emit('edit', post)">수정</button>
      <button @click="handleDelete">삭제</button>
    </div>
  </li>
</template>

<script setup>
const props = defineProps({
  post: { type: Object, required: true },
})
const emit = defineEmits(['edit', 'delete'])

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('ko-KR')
}

function handleDelete() {
  if (confirm('정말 삭제하시겠습니까?')) {
    emit('delete', props.post.id)
  }
}
</script>

<style scoped>
.post-item {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  list-style: none;
}
.head {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}
.actions {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}
.actions button {
  font-size: 12px;
  cursor: pointer;
}
</style>