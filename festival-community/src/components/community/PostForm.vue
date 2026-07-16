<template>
  <form class="post-form" @submit.prevent="handleSubmit">
    <input
      v-model="title"
      type="text"
      placeholder="제목을 입력하세요"
      required
    />
    <textarea
      v-model="content"
      rows="4"
      placeholder="내용을 입력하세요"
      required
    ></textarea>
    <label class="generation-label">
      SSAFY 기수 (선택)
      <select v-model="generation" size="1">
        <option v-for="g in generationOptions" :key="g" :value="g">
          {{ g }}
        </option>
      </select>
    </label>

    <input
      v-if="!isEditMode"
      v-model="password"
      type="password"
      placeholder="비밀번호 (수정/삭제 시 필요)"
      required
    />
    <button type="submit">{{ isEditMode ? '수정 완료' : '게시글 등록' }}</button>
    <button v-if="isEditMode" type="button" @click="$emit('cancel-edit')">
      취소
    </button>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  generationOptions: { type: Array, required: true },
  editingPost: { type: Object, default: null },
})

const emit = defineEmits(['submit', 'cancel-edit'])

const title = ref('')
const content = ref('')
const generation = ref(props.generationOptions[props.generationOptions.length - 1])
const password = ref('')

const isEditMode = computed(() => !!props.editingPost)

watch(
  () => props.editingPost,
  (post) => {
    if (post) {
      title.value = post.title
      content.value = post.content
      generation.value = post.generation
    } else {
      title.value = ''
      content.value = ''
      generation.value = props.generationOptions[props.generationOptions.length - 1]
      password.value = ''
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', {
    title: title.value,
    content: content.value,
    generation: generation.value,
    password: password.value,
  })
  if (!isEditMode.value) {
    title.value = ''
    content.value = ''
    generation.value = props.generationOptions[props.generationOptions.length - 1]
    password.value = ''
  }
}
</script>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
.post-form input,
.post-form textarea,
.post-form select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.post-form button {
  align-self: flex-start;
  padding: 6px 14px;
  cursor: pointer;
}
.generation-label {
  font-size: 13px;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>