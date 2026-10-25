import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, TorusKnot } from '@react-three/drei';

const LuxuryObject = () => {
  const meshRef = useRef();

  // Rotate the object slowly on every frame
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <TorusKnot ref={meshRef} args={[1, 0.3, 128, 32]} scale={1.2}>
        {/* Luxurious Gold/Orange Material */}
        <meshStandardMaterial 
          color="#FF8C42" 
          metalness={0.9} 
          roughness={0.1} 
          envMapIntensity={1}
        />
      </TorusKnot>
    </Float>
  );
};

const ThreeScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* Environment adds realistic reflections */}
        <Environment preset="city" />
        <LuxuryObject />
      </Canvas>
    </div>
  );
};

export default ThreeScene;