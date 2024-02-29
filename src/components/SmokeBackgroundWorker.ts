import * as THREE from "three"

interface ConfigBackground {
  canvas: HTMLCanvasElement
  h: number
  w: number
  themePreference: ReturnType<typeof window["getThemePreference"]>
}

const init = async (config: ConfigBackground) => {
  const { canvas, h, themePreference, w } = config

  console.log({ config }, "hola")

  let delta = 0
  const clock = new THREE.Clock()
  const interval = 1 / 30 // fps

  let animationFrameId: number = 0

  const THEME = {
    dark: {
      background: 0x666666,
      opacity: 0.1,
    },
    light: {
      background: 0xeeeeee,
      opacity: 0.1,
    },
  } as const

  const currentTheme = THEME[themePreference]

  // inicializar Three.js
  // 3 cosas básicas: escena, cámara, renderizador

  // escena 🖼️
  const scene = new THREE.Scene()

  // camara 📹
  // 75 -> ángulo de visión
  const camera = new THREE.PerspectiveCamera(75, w / h, 1, 1000)
  camera.position.z = 500
  scene.add(camera)

  // ▶️ renderizador
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: "high-performance",
    precision: "lowp",
    canvas,
  })

  if (!canvas.style) canvas.style = { width: w, height: h }
  renderer.setSize(w, h)

  // color de fondo
  scene.background = new THREE.Color(currentTheme.background)

  // $bkg?.appendChild(renderer.domElement)

  const smokeParticles: THREE.Mesh[] = []

  const smokeTexture = ((await new Promise((resolve) => {
    new THREE.ImageBitmapLoader().load("/smoke.webp", (img) =>
      resolve(new THREE.CanvasTexture(img))
    )
  })) as any) as THREE.Texture

  // 1. geometria
  // crear un plano geométrico de 300x300
  const smokeGeo = new THREE.PlaneGeometry(300, 300)

  // 2. material
  const smokeMaterial = new THREE.MeshLambertMaterial({
    map: smokeTexture,
    transparent: true,
    opacity: currentTheme.opacity,
  })

  const NUM_OF_PARTICLES = 100

  for (let p = 0; p < NUM_OF_PARTICLES; p++) {
    // crear la malla con la geometria y el material
    const particle = new THREE.Mesh(smokeGeo, smokeMaterial)
    // posicionar aleatoriamente
    // en la x, y, z
    particle.position.set(
      Math.random() * 500 - 250, // X (de -250 a 250)
      Math.random() * 500 - 250, // Y (de -250 a 250)
      Math.random() * 1000 - 100 // Z (de -100 a 900)
    )
    // aleatoriamente la z
    particle.rotation.z = Math.random() * 360
    // añadimos la particula en la escena
    scene.add(particle)
    // añadimos la particula al array
    smokeParticles.push(particle)
  }

  // $bkg?.classList.remove("opacity-0");

  // function resize() {
  // 	h = window.innerHeight + 150
  // 	w = window.innerWidth
  // 	camera.aspect = w / h
  // 	camera.updateProjectionMatrix() // este metodo lo tenéis que ejecutar siempre que cambiais los parámetros de la cámara
  // 	renderer.setSize(w, h)
  // }

  function animate() {
    animationFrameId = requestAnimationFrame(animate)
    delta += clock.getDelta()

    if (delta > interval) {
      let count = smokeParticles.length
      while (count--) {
        smokeParticles[count].rotation.z += delta * 0.2
      }

      renderer.render(scene, camera)

      delta = 0
    }
  }

  animate()

  // document.addEventListener("visibilitychange", () => {
  // 	if (document.hidden && animationFrameId !== 0) {
  // 		cancelAnimationFrame(animationFrameId)
  // 		animationFrameId = 0
  // 		return
  // 	}

  // 	if (animationFrameId === 0) {
  // 		animate()
  // 	}
  // })

  // se va a disparar continuamente mientras hace el resize
  // window.addEventListener("resize", resize)

  // window.addEventListener("theme-changed", () => {
  // 	const themePreference = window.getThemePreference()
  // 	currentTheme = THEME[themePreference]
  // 	scene.background = new THREE.Color(currentTheme.background)

  // 	smokeParticles.forEach((particle) => {
  // 		const smokeMaterial = particle.material as THREE.MeshLambertMaterial
  // 		smokeMaterial.opacity = currentTheme.opacity
  // 	})
  // })
}

addEventListener("message", (e: MessageEvent<ConfigBackground>) => {
  if (e.data.canvas) {
    init(e.data)
  }
})
