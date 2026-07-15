<template>
  <div class="community-view">
    <h1>익명 게시판</h1>

    <PostForm
      :tag-options="tagOptions"
      :editing-post="editingPost"
      @submit="handleSubmit"
      @cancel-edit="editingPost = null"
    />

    <SearchBar v-model="keyword" />
    <TagFilter v-model="selectedTag" :tag-options="tagOptions" />

    <p class="count">총 {{ filteredPosts.length }}건</p>

    <PostList
      :posts="filteredPosts"
      @edit="editingPost = $event"
      @delete="deletePost"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePosts } from '../composables/usePosts'
import PostForm from '../components/community/PostForm.vue'
import PostList from '../components/community/PostList.vue'
import SearchBar from '../components/community/SearchBar.vue'
import TagFilter from '../components/community/TagFilter.vue'

const {
  filteredPosts,
  keyword,
  selectedTag,
  tagOptions,
  addPost,
  updatePost,
  deletePost,
} = usePosts()

const editingPost = ref(null)

function handleSubmit({ title, content, tag }) {
  if (editingPost.value) {
    updatePost(editingPost.value.id, { title, content, tag })
    editingPost.value = null
  } else {
    addPost({ title, content, tag })
  }
}
</script>

<style scoped>
.community-view {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
}
.count {
  color: #666;
  font-size: 13px;
  margin-bottom: 8px;
}
</style>