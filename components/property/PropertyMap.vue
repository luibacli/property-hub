<script setup lang="ts">
const props = defineProps<{
  lat: number
  lng: number
  title: string
}>()

const mapEl = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!mapEl.value) return

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  // Fix default icon paths broken by bundlers
  delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  const map = L.map(mapEl.value, {
    center: [props.lat, props.lng],
    zoom: 14,
    scrollWheelZoom: false,
    zoomControl: true,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  L.marker([props.lat, props.lng])
    .addTo(map)
    .bindPopup(`<strong>${props.title}</strong>`, { closeButton: false })
    .openPopup()
})
</script>

<template>
  <div ref="mapEl" class="h-64 rounded-2xl overflow-hidden z-0" />
</template>
