<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full"
    style="touch-action: none; outline: none; z-index: 0;"
    @mousedown.prevent="onMouseDown"
    @mousemove="onMouseMove"
    @touchstart.prevent="onTouchStart"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'dark' }
})

const canvasRef = ref(null)

let ctx = null
let animId = null
let W = 0, H = 0
let dpr = 1

// Physics config
const springStiffness = 0.95
const friction = 0.88
const angularFriction = 0.9
const bendStiffness = 150
const pullLimit = 300
const pushLimit = 400

// State
const basePos = { x: 0, y: 0 }
let restLength = 250
let knobPos = { x: 0, y: 0 }
let isDragging = false
let mousePos = { x: 0, y: 0 }
let lastTime = 0

// Polar physics
let currentLength = 0
let currentAngle = 0
let lengthVelocity = 0
let angularVelocity = 0

const targetFrameTime = 1000 / 60

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.parentElement.getBoundingClientRect()
  dpr = window.devicePixelRatio || 1
  W = rect.width
  H = rect.height
  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'
  ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  basePos.x = 0
  basePos.y = H * 0.48
  restLength = Math.min(W * 0.38, 280)

  knobPos.x = basePos.x + restLength
  knobPos.y = basePos.y
  currentLength = restLength
  currentAngle = 0
  lengthVelocity = 0
  angularVelocity = 0
}

function getPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0
  return { x: clientX - rect.left, y: clientY - rect.top }
}

function onMouseDown(e) {
  const pos = getPos(e)
  const dist = Math.hypot(pos.x - knobPos.x, pos.y - knobPos.y)
  if (dist < 40) {
    isDragging = true
    mousePos = pos
    canvasRef.value.style.cursor = 'grabbing'
  }
}

function onMouseMove(e) {
  const pos = getPos(e)
  if (isDragging) {
    mousePos = pos
  } else {
    const dist = Math.hypot(pos.x - knobPos.x, pos.y - knobPos.y)
    canvasRef.value.style.cursor = dist < 40 ? 'grab' : 'default'
  }
}

function onGlobalMouseMove(e) {
  if (isDragging) {
    e.preventDefault()
    mousePos = getPos(e)
  }
}

function onGlobalMouseUp() {
  if (isDragging) {
    isDragging = false
    canvasRef.value && (canvasRef.value.style.cursor = 'default')
  }
}

function onTouchStart(e) {
  if (e.touches.length > 0) {
    const pos = getPos(e.touches[0])
    const dist = Math.hypot(pos.x - knobPos.x, pos.y - knobPos.y)
    if (dist < 50) {
      isDragging = true
      mousePos = pos
    }
  }
}

function onTouchMove(e) {
  if (isDragging && e.touches.length > 0) {
    e.preventDefault()
    mousePos = getPos(e.touches[0])
  }
}

function onTouchEnd() {
  isDragging = false
}

function updatePhysics(deltaTime) {
  const maxStep = 16
  const steps = Math.ceil(deltaTime / maxStep)
  const stepTime = deltaTime / steps
  for (let i = 0; i < steps; i++) physicsStep(stepTime)
}

function physicsStep(deltaTime) {
  const timeScale = deltaTime / targetFrameTime

  if (isDragging) {
    let dx = mousePos.x - basePos.x
    let dy = mousePos.y - basePos.y
    if (dx < 0) dx = 0

    const mouseDist = Math.hypot(dx, dy)
    const angle = Math.atan2(dy, dx)

    const offset = mouseDist - restLength
    let newDist = restLength
    if (offset > 0) {
      newDist = restLength + offset / (1 + offset / pullLimit)
    } else {
      const abs = Math.abs(offset)
      newDist = restLength - abs / (1 + abs / pushLimit)
      if (newDist < 16) newDist = 16
    }

    knobPos.x = basePos.x + Math.cos(angle) * newDist
    knobPos.y = basePos.y + Math.sin(angle) * newDist

    const minX = basePos.x + 16
    if (knobPos.x < minX) knobPos.x = minX

    currentLength = Math.hypot(knobPos.x - basePos.x, knobPos.y - basePos.y)
    currentAngle = Math.atan2(knobPos.y - basePos.y, knobPos.x - basePos.x)
    lengthVelocity = 0
    angularVelocity = 0
  } else {
    const lengthAccel = (restLength - currentLength) * springStiffness * timeScale
    lengthVelocity += lengthAccel
    lengthVelocity *= Math.pow(friction, timeScale)
    currentLength += lengthVelocity * timeScale

    const angleAccel = -currentAngle * 0.9 * timeScale
    angularVelocity += angleAccel
    angularVelocity *= Math.pow(angularFriction, timeScale)
    currentAngle += angularVelocity * timeScale

    if (currentLength < 16) {
      currentLength = 16
      lengthVelocity *= -0.5
    }

    knobPos.x = basePos.x + Math.cos(currentAngle) * currentLength
    knobPos.y = basePos.y + Math.sin(currentAngle) * currentLength

    const minX = basePos.x + 16
    if (knobPos.x < minX) {
      knobPos.x = minX
      if (Math.abs(currentAngle) > Math.PI / 2) {
        currentAngle = Math.sign(currentAngle) * Math.PI - currentAngle
        angularVelocity *= -0.5
      }
      currentLength = Math.hypot(knobPos.x - basePos.x, knobPos.y - basePos.y)
      lengthVelocity *= -0.5
    }
  }

  // Sanity
  if (!Number.isFinite(currentLength) || !Number.isFinite(currentAngle) ||
      Math.abs(lengthVelocity) > 10000 || Math.abs(angularVelocity) > 1000) {
    knobPos.x = basePos.x + restLength
    knobPos.y = basePos.y
    currentLength = restLength
    currentAngle = 0
    lengthVelocity = 0
    angularVelocity = 0
  }
}

const cssVarCache = {}
function getVar(name, fallback = 'rgba(201,168,76,0.3)') {
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (val) { cssVarCache[name] = val; return val }
  return cssVarCache[name] || fallback
}

function drawSpring() {
  const p0 = basePos
  const p2 = knobPos
  const curLen = Math.hypot(p2.x - p0.x, p2.y - p0.y)
  const dynamicStiffness = Math.min(bendStiffness, curLen * 0.5)
  const p1 = { x: basePos.x + dynamicStiffness, y: basePos.y }

  ctx.beginPath()
  ctx.moveTo(basePos.x, basePos.y)

  const coils = 22
  const steps = 100

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const omt = 1 - t
    const bx = omt * omt * p0.x + 2 * omt * t * p1.x + t * t * p2.x
    const by = omt * omt * p0.y + 2 * omt * t * p1.y + t * t * p2.y

    const tx = 2 * omt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
    const ty = 2 * omt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)

    const len = Math.hypot(tx, ty)
    const nx = -ty / len
    const ny = tx / len

    let width = 18 * (1.15 - t)
    if (curLen < restLength) {
      width *= 1 + (restLength - curLen) / restLength
    }

    const sine = Math.sin(t * coils * Math.PI * 2)
    ctx.lineTo(bx + nx * sine * width, by + ny * sine * width)
  }

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 2
  ctx.strokeStyle = getVar('--v-spring-stroke')
  ctx.shadowColor = getVar('--v-spring-glow')
  ctx.shadowBlur = 6
  ctx.shadowOffsetY = 2
  ctx.stroke()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
}

function drawKnob() {
  const r = 12
  ctx.beginPath()
  ctx.arc(knobPos.x, knobPos.y, r, 0, Math.PI * 2)

  const grad = ctx.createRadialGradient(
    knobPos.x - 3, knobPos.y - 3, 1,
    knobPos.x, knobPos.y, r
  )
  grad.addColorStop(0, getVar('--v-knob-hi'))
  grad.addColorStop(0.6, getVar('--v-knob-mid'))
  grad.addColorStop(1, getVar('--v-knob-lo'))
  ctx.fillStyle = grad
  ctx.fill()

  ctx.strokeStyle = getVar('--v-knob-border')
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.beginPath()
  ctx.ellipse(knobPos.x - 4, knobPos.y - 4, 3, 1.5, Math.PI / 4, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.fill()
}

function drawWallAnchor() {
  ctx.beginPath()
  ctx.arc(basePos.x, basePos.y, 3, -Math.PI / 2, Math.PI / 2)
  ctx.fillStyle = getVar('--v-knob-border')
  ctx.fill()
}

function draw(currentTime) {
  if (!ctx) return
  if (lastTime === 0) lastTime = currentTime
  const deltaTime = Math.min(currentTime - lastTime, 50)
  lastTime = currentTime

  ctx.clearRect(0, 0, W, H)

  drawWallAnchor()
  drawSpring()
  drawKnob()

  // Tension line while dragging
  if (isDragging) {
    ctx.beginPath()
    ctx.moveTo(knobPos.x, knobPos.y)
    ctx.lineTo(mousePos.x, mousePos.y)
    ctx.setLineDash([3, 3])
    ctx.strokeStyle = getVar('--v-drag-line')
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.setLineDash([])
  }

  updatePhysics(deltaTime)
  animId = requestAnimationFrame(draw)
}

onMounted(() => {
  resize()
  animId = requestAnimationFrame(draw)

  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onGlobalMouseMove)
  window.addEventListener('mouseup', onGlobalMouseUp)
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', onTouchEnd)
  window.addEventListener('touchcancel', onTouchEnd)

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      knobPos.x = basePos.x + restLength
      knobPos.y = basePos.y
      currentLength = restLength
      currentAngle = 0
      lengthVelocity = 0
      angularVelocity = 0
      isDragging = false
    }
  })
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onGlobalMouseMove)
  window.removeEventListener('mouseup', onGlobalMouseUp)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('touchcancel', onTouchEnd)
})
</script>
