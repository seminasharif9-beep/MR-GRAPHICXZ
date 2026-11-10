import { Canvas, useFrame } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  BallCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import { useMemo, useRef } from "react";

// Tech stack texture paths from public/images/
const TECH_TEXTURES = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];

// Single 3D Physics Sphere
function TechBall({
  texture,
  scale = 1,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
}: {
  texture: THREE.Texture;
  scale?: number;
  vec?: THREE.Vector3;
  r?: (range: number) => number;
}) {
  const api = useRef<RapierRigidBody>(null);

  useFrame((_state, delta) => {
    const clampedDelta = Math.min(0.1, delta);
    if (!api.current) return;

    // Gentle central gravity pull: Keeps all balls clustered together in space
    const currentTranslation = api.current.translation();
    vec.set(currentTranslation.x, currentTranslation.y, currentTranslation.z);
    api.current.applyImpulse(vec.negate().multiplyScalar(0.25 * clampedDelta * 60), true);
  });

  return (
    <RigidBody
      ref={api}
      colliders={false}
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(12), r(12), r(10)]}
    >
      <BallCollider args={[scale]} />
      <mesh scale={scale} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.28}
          roughness={0.25}
          metalness={0.45}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </RigidBody>
  );
}

// Invisible Pointer: Pushes balls away when mouse hovers over them
function PointerCollider({ vec = new THREE.Vector3() }: { vec?: THREE.Vector3 }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    // Map mouse coordinates (-1 to 1) directly to 3D space
    vec.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0);
    ref.current?.setNextKinematicTranslation(vec);
  });

  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1.6]} />
    </RigidBody>
  );
}

// Main TechStack Component
const TechStack = () => {
  // Preload textures
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return TECH_TEXTURES.map((url) => {
      const tex = loader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });
  }, []);

  // Generate 30 floating balls with varying scales
  const spheres = useMemo(() => {
    const scales = [0.75, 1.0, 0.85, 1.15, 0.95];
    return Array.from({ length: 30 }, (_, index) => ({
      scale: scales[index % scales.length],
      texture: textures[index % textures.length],
    }));
  }, [textures]);

  return (
    <div
      className="techstack"
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <h2 className="techstack-title">My Techstack</h2>
      <Canvas
        camera={{ position: [0, 0, 22], fov: 35, near: 0.1, far: 100 }}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
        }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-10, -10, -10]} intensity={0.8} />
        <pointLight position={[0, 0, 5]} intensity={1.2} color="#a855f7" />

        {/* Zero Gravity Physics Space */}
        <Physics gravity={[0, 0, 0]}>
          <PointerCollider />
          {spheres.map((props, i) => (
            <TechBall key={i} {...props} />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
};

export default TechStack;