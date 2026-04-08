<template>
  <div class="cursor">
    <div class="cursor-dot"  ref="cursorDot"></div>
    <div class="cursor-ring" ref="cursorRing" :class="{ hovering: isHovering }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Props
 * ─────
 * autoHover  (Boolean, default true)
 *   When true  → component auto-attaches mouseenter/mouseleave to every
 *                <a> and <button> on the page (homepage / contact style).
 *   When false → parent drives hover state by v-model or :modelValue +
 *                @update:modelValue, or by calling expose'd setHover().
 */
const props = defineProps({
  autoHover: { type: Boolean, default: true },
})

// v-model support so parent pages can do <AppCursor v-model="isHovering" :auto-hover="false" />
const isHovering = defineModel({ default: false })

const cursorDot  = ref(null)
const cursorRing = ref(null)
let mx = 0, my = 0, rx = 0, ry = 0, rafId = null

function onMouseMove(e) { mx = e.clientX; my = e.clientY }

function animCursor() {
  rx += (mx - rx) * 0.15
  ry += (my - ry) * 0.15
  if (cursorDot.value)  { cursorDot.value.style.left  = mx + 'px'; cursorDot.value.style.top  = my + 'px' }
  if (cursorRing.value) { cursorRing.value.style.left = rx + 'px'; cursorRing.value.style.top = ry + 'px' }
  rafId = requestAnimationFrame(animCursor)
}

function onLinkEnter() { isHovering.value = true  }
function onLinkLeave() { isHovering.value = false }

// Expose setHover so parent pages can call it imperatively if needed
defineExpose({ setHover: (v) => { isHovering.value = v } })

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  animCursor()

  if (props.autoHover) {
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onLinkEnter)
      el.addEventListener('mouseleave', onLinkLeave)
    })
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
  if (props.autoHover) {
    document.querySelectorAll('a, button').forEach(el => {
      el.removeEventListener('mouseenter', onLinkEnter)
      el.removeEventListener('mouseleave', onLinkLeave)
    })
  }
})
</script>

<style scoped>
/* ── Custom Cursor ── */
.cursor { position: fixed; top: 0; left: 0; z-index: 10000; pointer-events: none; }
.cursor-dot {
  width: 6px; height: 6px;
  background: var(--warm);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
.cursor-ring {
  width: 32px; height: 32px;
  border: 1px solid rgba(200,169,126,0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
}
.cursor-ring.hovering {
  width: 48px; height: 48px;
  border-color: rgba(200,169,126,0.8);
}
</style>
