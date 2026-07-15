<template>
  <div class="map-container-wrapper">
    <div class="map-header">
      <h2 class="map-title">📍 서울 축제 실시간 혼잡도 지도</h2>
      <div class="map-legend">
        <span class="legend-item"><span class="dot green"></span>여유</span>
        <span class="legend-item"><span class="dot yellow"></span>보통</span>
        <span class="legend-item"><span class="dot red"></span>혼잡</span>
      </div>
    </div>
    <div id="map" class="festival-map"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 서울 축제 데이터 로드
import festivalData from '@/assets/data/서울_축제공연행사.json'

let map = null
const markersMap = new Map() // 마커 인스턴스들을 관리할 공간

// 💡 1. 혼잡도 상태에 따라 동적으로 알록달록한 SVG 마커 아이콘을 생성하는 함수입니다.
function createCongestionIcon(status) {
  let color = '#10b981' // 기본값: 초록색 (여유)
  if (status === '보통') color = '#f59e0b' // 노랑색
  if (status === '혼잡') color = '#ef4444' // 빨강색

  // 예쁜 물방울 모양 마커를 만드는 SVG 코드
  const svgHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" style="filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.3));">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `
  return L.divIcon({
    html: svgHtml,
    className: 'custom-congestion-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32], // 마커 끝 뾰족한 부분이 좌표에 정확히 찍히도록 앵커를 조절합니다.
    popupAnchor: [0, -32] // 말풍선 팝업이 마커 위쪽에 예쁘게 뜨도록 설정합니다.
  })
}

// 💡 2. 사용자가 전역적으로 버튼을 클릭했을 때 호출할 "혼잡도 제보 처리 함수"를 만듭니다.
// (팝업 내 HTML 버튼 클릭 이벤트를 Vue 스크립트 영역과 연결하기 위해 window 객체에 임시 저장합니다.)
window.reportCongestion = (id, status) => {
  const markerInfo = markersMap.get(id)
  if (markerInfo) {
    // 마커의 혼잡도 데이터 갱신
    markerInfo.item.congestion = status
    // 마커 아이콘 새로 적용
    markerInfo.marker.setIcon(createCongestionIcon(status))
    // 말풍선 내용도 최신화하고 다시 열어주기
    const newPopupContent = generatePopupContent(markerInfo.item)
    markerInfo.marker.setPopupContent(newPopupContent)
    markerInfo.marker.openPopup()
    
    alert(`🎉 '${markerInfo.item.title}' 축제의 혼잡도가 [${status}]로 제보되었습니다!`)
  }
}

// 💡 3. 말풍선 팝업창 안에 들어갈 HTML 코드를 완성하는 함수입니다. (혼잡도 제보 버튼들 포함)
function generatePopupContent(festival) {
  const currentStatus = festival.congestion || '여유'
  let badgeColor = '#10b981'
  if (currentStatus === '보통') badgeColor = '#f59e0b'
  if (currentStatus === '혼잡') badgeColor = '#ef4444'

  return `
    <div style="font-family: sans-serif; padding: 6px; width: 220px;">
      <strong style="font-size: 14px; color: #1e293b; display: block; margin-bottom: 4px;">🎉 ${festival.title || festival.fstvlNm}</strong>
      <span style="display: inline-block; background-color: ${badgeColor}; color: white; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-bottom: 8px;">
        현재 혼잡도: ${currentStatus}
      </span>
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; line-height: 1.4;">
        <strong>기간:</strong> ${festival.startDate || '상세내용 참조'}<br>
        <strong>장소:</strong> ${festival.addr || '서울 일대'}
      </p>
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 8px;">
        <span style="font-size: 11px; color: #475569; font-weight: bold; display: block; margin-bottom: 6px;">실시간 혼잡도 제보하기</span>
        <div style="display: flex; gap: 4px;">
          <button onclick="window.reportCongestion('${festival.id}', '여유')" style="flex: 1; border: none; background: #e6f4ea; color: #137333; font-size: 11px; padding: 5px 0; border-radius: 4px; cursor: pointer; font-weight: bold;">여유</button>
          <button onclick="window.reportCongestion('${festival.id}', '보통')" style="flex: 1; border: none; background: #fef7e0; color: #b06000; font-size: 11px; padding: 5px 0; border-radius: 4px; cursor: pointer; font-weight: bold;">보통</button>
          <button onclick="window.reportCongestion('${festival.id}', '혼잡')" style="flex: 1; border: none; background: #fce8e6; color: #c5221f; font-size: 11px; padding: 5px 0; border-radius: 4px; cursor: pointer; font-weight: bold;">혼잡</button>
        </div>
      </div>
    </div>
  `
}

onMounted(() => {
  // 서울 중심 좌표로 지도 초기화
  map = L.map('map').setView([37.5665, 126.9780], 11)

  // 지도 배경 타일 추가
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // JSON 데이터를 돌며 마커 뿌리기
  if (festivalData && festivalData.items) {
    festivalData.items.forEach((festival, index) => {
      const lat = parseFloat(festival.lat || festival.mapy)
      const lng = parseFloat(festival.lng || festival.mapx)

      if (lat && lng) {
        // 각 축제 데이터에 고유 ID를 생성해 부여하고 초기 혼잡도를 '여유'로 세팅합니다.
        festival.id = `fest-${index}`
        festival.congestion = festival.congestion || '여유'

        // 💡 4. 동적 SVG 아이콘(초록색)으로 마커를 생성합니다.
        const marker = L.marker([lat, lng], {
          icon: createCongestionIcon(festival.congestion)
        }).addTo(map)

        // 클릭 시 보여줄 말풍선 콘텐츠를 바인딩합니다.
        marker.bindPopup(generatePopupContent(festival))

        // 추후 실시간 업데이트를 위해 마커 인스턴스를 저장해 둡니다.
        markersMap.set(festival.id, { marker, item: festival })
      }
    })
  }

  // 브라우저 리사이즈 보정
  setTimeout(() => {
    map.invalidateSize()
  }, 200)
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
  // 메모리 누수 방지를 위해 글로벌 이벤트 함수 삭제
  delete window.reportCongestion
})
</script>

<style scoped>
.map-container-wrapper {
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 20px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.map-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* 지도 범례 스타일 */
.map-legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.green { background-color: #10b981; }
.dot.yellow { background-color: #f59e0b; }
.dot.red { background-color: #ef4444; }

.festival-map {
  width: 100%;
  height: 450px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

/* Leaflet 내 커스텀 SVG 마커 컨테이너 스타일 */
:deep(.custom-congestion-icon) {
  background: none;
  border: none;
}
</style>