import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'anonymous-board-posts'
const TAG_OPTIONS = ['축제', '음식', '공연', '기타']

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('localStorage 파싱 실패:', e)
    return []
  }
}

const posts = ref(loadPosts())

watch(
  posts,
  (newPosts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts))
  },
  { deep: true }
)

export function usePosts() {
  const keyword = ref('')
  const selectedTag = ref('전체')

  const filteredPosts = computed(() => {
    return posts.value
      .filter((p) => {
        if (!keyword.value) return true
        return (
          p.title.includes(keyword.value) || p.content.includes(keyword.value)
        )
      })
      .filter((p) => {
        if (selectedTag.value === '전체') return true
        return p.tag === selectedTag.value
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  })

  function addPost({ title, content, tag }) {
    posts.value.push({
      id: Date.now(),
      title,
      content,
      tag: tag || '기타',
      createdAt: Date.now(),
    })
  }

  function updatePost(id, { title, content, tag }) {
    const target = posts.value.find((p) => p.id === id)
    if (!target) return
    target.title = title
    target.content = content
    target.tag = tag
  }

  function deletePost(id) {
    posts.value = posts.value.filter((p) => p.id !== id)
  }

  return {
    posts,
    filteredPosts,
    keyword,
    selectedTag,
    tagOptions: TAG_OPTIONS,
    addPost,
    updatePost,
    deletePost,
  }
}