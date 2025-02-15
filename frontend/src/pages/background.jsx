// This file is used for Login and Signup Pages

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

export function Background() {
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1
      sphereRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Sphere ref={sphereRef} args={[1.5, 64, 64]} position={[0, 0, -5]}>
        <MeshDistortMaterial color="#4F46E5" attach="material" distort={0.3} speed={2} roughness={0.5} />
      </Sphere>
    </>
  )
}

