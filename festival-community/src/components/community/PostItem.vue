<template>
  <li class="post-item">
    <div class="head">
      <span class="tag">#{{ post.tag }}</span>
      <span class="generation">{{ post.generation }}</span>
      <span class="date">{{ formatDate(post.createdAt) }}</span>
    </div>
    <h3>{{ post.title }}</h3>
    <p>{{ post.content }}</p>
    <div class="actions">
      <button @click="handleEdit">수정</button>
      <button @click="handleDelete">삭제</button>
    </div>
  </li>
</template>

<script setup>
import { usePosts } from '../../composables/usePosts'

const props = defineProps({
  post: { type: Object, required: true },
})
const emit = defineEmits(['edit', 'delete'])

const { verifyPassword } = usePosts()

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('ko-KR')
}

function handleEdit() {
  const input = prompt('비밀번호를 입력하세요')
  if (input === null) return // 취소 버튼 누른 경우
  if (verifyPassword(props.post.id, input)) {
    emit('edit', props.post)
  } else {
    alert('비밀번호가 일치하지 않습니다.')
  }
}

function handleDelete() {
  const input = prompt('비밀번호를 입력하세요')
  if (input === null) return
  if (verifyPassword(props.post.id, input)) {
    if (confirm('정말 삭제하시겠습니까?')) {
      emit('delete', props.post.id)
    }
  } else {
    alert('비밀번호가 일치하지 않습니다.')
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