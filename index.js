import {
  AmbientLight,
  AxesHelper,
  Color,
  DirectionalLight,
  FogExp2,
  LinearEncoding,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { Source, Map, MapPicker } from 'map33/src/index'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { getRouteVertices, vertices } from './modules/route'

const renderer = new WebGLRenderer({ antialias: true, alpha: true })
renderer.outputEncoding = LinearEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.bias = 0.001
renderer.shadowMap.type = PCFSoftShadowMap
renderer.shadowMap.autoUpdate = true
renderer.physicallyCorrectLights = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1e6)
const controls = new MapControls(camera, renderer.domElement)
controls.maxPolarAngle = Math.PI * 0.3

camera.position.set(0, -1000, 700)
camera.up = new Vector3(0, 0, 1)
camera.updateMatrixWorld()
camera.updateProjectionMatrix()

scene.background = new Color(0x91abb5)
scene.fog = new FogExp2(0x91abb5, 0.0000001)

const ambientLight = new AmbientLight(0x404040, 2.5) // soft white light
const dirLight = new DirectionalLight(0xffffff, 3.5)
dirLight.castShadow = false
dirLight.position.set(10000, 10000, 10000)
scene.add(ambientLight)
scene.add(dirLight)

// Helpers
const axesHelper = new AxesHelper(2000)
scene.add(axesHelper)

//Map
const position = [vertices[0], vertices[1]]

const source = new Source('maptiler', process.env.API_KEY)
const map = new Map(scene, camera, source, position, 3, 10)

//Route
const lineMaterial = new LineMaterial()
lineMaterial.color = new Color('blue')
lineMaterial.linewidth = 4
lineMaterial.resolution = new Vector2(window.innerWidth, window.innerHeight)

const routeVertices = getRouteVertices(10)
console.log(routeVertices)

const lineGeometry = new LineGeometry()
lineGeometry.setPositions(routeVertices)

const line = new Line2(lineGeometry, lineMaterial)
scene.add(line)

const animateLoop = function () {
  requestAnimationFrame(animateLoop)

  controls.update()

  renderer.render(scene, camera)
}

animateLoop()
