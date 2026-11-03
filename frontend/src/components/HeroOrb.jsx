import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const Core = () => {
  const group = useRef();
  const core = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.15;
      const targetX = state.pointer.y * 0.2;
      const targetY = state.pointer.x * 0.3;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.03;
      group.current.rotation.z += (targetY - group.current.rotation.z) * 0.03;
    }
    if (core.current) {
      core.current.rotation.y = t * 0.3;
      core.current.rotation.x = t * 0.2;
    }
  });

  const nodeRadius = 2.3;
  const nodes = [0, 1, 2, 3, 4].map((i) => {
    const angle = (i / 5) * Math.PI * 2;
    return [Math.cos(angle) * nodeRadius, Math.sin(angle * 1.3) * 0.6, Math.sin(angle) * nodeRadius];
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          color="#7C6FF0"
          emissive="#7C6FF0"
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.4}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#141829" roughness={0.4} metalness={0.6} />
      </mesh>

      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#F2B441" : "#2DD4BF"}
            emissive={i % 2 === 0 ? "#F2B441" : "#2DD4BF"}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

const HeroOrb = () => (
  <div className="h-full w-full">
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#F2B441" />
      <pointLight position={[-4, -2, -3]} intensity={0.8} color="#7C6FF0" />
      <Suspense fallback={null}>
        <Core />
      </Suspense>
    </Canvas>
  </div>
);

export default HeroOrb;
