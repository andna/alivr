import * as THREE from 'three'
import { forwardRef, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CubeCamera, Float, MeshReflectorMaterial, OrbitControls, Cylinder, Stars } from '@react-three/drei'
import { EffectComposer, GodRays, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 7, 10], fov: 35, near: 1, far: 120 }} gl={{ antialias: false }}>
      <color attach="background" args={['#050505']} />
      <ambientLight />
      {/** The screen uses postpro godrays */}
      <Screen />
      {/** The sphere reflects the screen with a cube-cam 
      <Float rotationIntensity={3} floatIntensity={3} speed={1}>
        <CubeCamera position={[-3, -1, -5]} resolution={256} frames={Infinity}>
          {(texture) => (
            <mesh>
              <sphereGeometry args={[2, 32, 32]} />
              <meshStandardMaterial metalness={1} roughness={0.1} envMap={texture} />
            </mesh>
          )}
        </CubeCamera>
      </Float>
      */}
      {/** The floor uses drei/MeshReflectorMaterial */}
      <Floor />
      <Stars />
      <Stadium />
      <OrbitControls />
    </Canvas>
  )
}

const Floor = () => (
  <mesh position={[0, -1, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
    <circleGeometry args={[6, 50]} />
    <MeshReflectorMaterial
      blur={[300, 50]}
      resolution={1024}
      mixBlur={1}
      mixStrength={300}
      roughness={1}
      depthScale={1.2}
      minDepthThreshold={0.4}
      maxDepthThreshold={1.4}
      color="#202020"
      metalness={0.8}
    />
  </mesh>
)

const Stadium = () => (
  <mesh position={[0, 0.5, 0]} receiveShadow rotation={[0, 0, 0]}>
    <cylinderGeometry args={[10, 6, 3, 16, 1, true]} />
    <MeshReflectorMaterial
      side={THREE.BackSide}
      blur={[300, 500]}
      resolution={1024}
      mixBlur={133}
      mixStrength={100}
      roughness={1}
      depthScale={1.2}
      minDepthThreshold={0.4}
      maxDepthThreshold={1.4}
      color="#202020"
      metalness={3}
    />
  </mesh>
)

const Emitter = forwardRef((props, fRef) => {
  const [video] = useState(() => Object.assign(document.createElement('video'), { src: '/10.mp4', crossOrigin: 'Anonymous', loop: true, muted: true }))
  useEffect(() => void video.play(), [video])
  return (
    <mesh ref={fRef} position={[0, 1.5, 0]} {...props}>
      <mesh>
        <cylinderGeometry args={[3, 1.5, 2, 16, 1, true]} />
        <meshBasicMaterial side={THREE.DoubleSide}>
          <videoTexture attach="map" args={[video]} colorSpace={THREE.SRGBColorSpace} />
        </meshBasicMaterial>
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0, 1]}>
          <circleGeometry args={[3, 16]} />
          <meshPhongMaterial color="black" opacity="0.995" transparent />
        </mesh>

        <mesh position={[0, 0, -1]}>
          <circleGeometry args={[1.5, 16]} />
          <meshPhongMaterial color="black" opacity="0.995" transparent side={THREE.BackSide} />
        </mesh>
      </mesh>
    </mesh>
  )
})

function Screen() {
  const [material, set] = useState()
  const ref = useRef()

  let isUpwards = true

  useFrame(() => {
    //const y = ref.current.position.y
    //ref.current.position.y += 0.01 * (isUpwards ? -1 : 1)
    //console.log(ref.current.position.y, isUpwards)
  })

  return (
    <mesh ref={ref}>
      <Emitter ref={set} />
      {material && (
        <EffectComposer disableNormalPass multisampling={8}>
          <GodRays sun={material} exposure={0.34} decay={0.8} blur />
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
        </EffectComposer>
      )}
    </mesh>
  )
}
