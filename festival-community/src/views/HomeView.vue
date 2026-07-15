<script setup>
import festivalData from '@/data/서울_축제공연행사.json'
import { ref, computed } from 'vue'
import FestivalMap from '@/components/FestivalMap.vue'
// import ChatbotWidget from '@/components/ChatbotWidget.vue' 

// 게시판 관련
import { usePosts } from '../composables/usePosts'
import PostForm from '../components/community/PostForm.vue'
import PostList from '../components/community/PostList.vue'
import SearchBar from '../components/community/SearchBar.vue'
import TagFilter from '../components/community/TagFilter.vue'

// 축제 목록 관련
const festivals = festivalData.items
const isExpanded = ref(false)
const visibleCount = 8

const visibleFestivals = computed(() => {
  return isExpanded.value ? festivals : festivals.slice(0, visibleCount)
})

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

// 게시판 관련
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

<template>
  <div class="page">
    <!-- 1. 제목 + 안내 문구 -->
    <header class="site-header">
      <h1>서울 축제 실시간 혼잡도 커뮤니티</h1>
      <p>서울의 다양한 축제 정보와 실시간 혼잡도를 확인해보세요</p>
    </header>

    <!-- 2. 지도 -->
    <section class="map-section">
      <FestivalMap />
    </section>

    <!-- 3. 게시판 -->
    <section class="board-section">
      <h2>익명 게시판</h2>

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
    </section>

    <!-- 4. 축제 목록 -->
    <section class="festival-section">
      <h2>축제 목록</h2>
      <div class="festival-list">
        <div v-for="festival in visibleFestivals" :key="festival.contentid" class="festival-card">
          <img :src="festival.firstimage" :alt="festival.title" v-if="festival.firstimage" />
          <h3>{{ festival.title }}</h3>
          <p>📍 {{ festival.eventplace }}</p>
          <p>📅 {{ festival.eventstartdate }} ~ {{ festival.eventenddate }}</p>
          <p>💰 {{ festival.usetimefestival }}</p>
        </div>
      </div>
      <div class="more-btn-wrapper">
        <button class="more-btn" @click="toggleExpand">
          {{ isExpanded ? '접기' : '더보기' }}
          <span :class="{ 'arrow-up': isExpanded }">▼</span>
        </button>
      </div>
    </section>

    <!-- 5. AI 챗봇 (화면 오른쪽 아래에 고정으로 뜸) -->
    <!-- <ChatbotWidget /> --> 
  </div>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.site-header {
  text-align: center;
  margin-bottom: 32px;
}
.site-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
}
.map-section,
.board-section,
.festival-section {
  margin-bottom: 40px;
}
.festival-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.festival-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
}
.festival-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
.more-btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.more-btn {
  padding: 10px 24px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: white;
  cursor: pointer;
}
</style>