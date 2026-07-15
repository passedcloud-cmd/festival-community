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
    <select v-model="tag">
      <option v-for="t in tagOptions" :key="t" :value="t">{{ t }}</option>
    </select>
    <button type="submit">{{ isEditMode ? '수정 완료' : '게시글 등록' }}</button>
    <button v-if="isEditMode" type="button" @click="$emit('cancel-edit')">
      취소
    </button>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  tagOptions: { type: Array, required: true },
  editingPost: { type: Object, default: null },
})

const emit = defineEmits(['submit', 'cancel-edit'])

const title = ref('')
const content = ref('')
const tag = ref(props.tagOptions[0])

const isEditMode = computed(() => !!props.editingPost)

watch(
  () => props.editingPost,
  (post) => {
    if (post) {
      title.value = post.title
      content.value = post.content
      tag.value = post.tag
    } else {
      title.value = ''
      content.value = ''
      tag.value = props.tagOptions[0]
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', { title: title.value, content: content.value, tag: tag.value })
  if (!isEditMode.value) {
    title.value = ''
    content.value = ''
    tag.value = props.tagOptions[0]
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
</style>