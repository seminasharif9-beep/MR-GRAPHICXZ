import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

function findMesh(character: THREE.Object3D, name: string) {
  const expectedName = name.replace(/[.\s_-]/g, "").toLowerCase();
  let match: THREE.Mesh | undefined;
  character.traverse((object) => {
    if (
      object instanceof THREE.Mesh &&
      object.name.replace(/[.\s_-]/g, "").toLowerCase() === expectedName
    ) {
      match = object;
    }
  });
  return match;
}

function setMeshProps(
  character: THREE.Object3D,
  name: string,
  color: string,
  roughness: number = 0.85,
  metalness: number = 0.0
) {
  const mesh = findMesh(character, name);
  if (!mesh) return;

  const updateMaterial = (material: THREE.Material) => {
    const updated = material.clone();
    if ("color" in updated && updated.color instanceof THREE.Color) {
      updated.color.set(color);
    }
    if ("roughness" in updated) updated.roughness = roughness;
    if ("metalness" in updated) updated.metalness = metalness;
    return updated;
  };

  mesh.material = Array.isArray(mesh.material)
    ? mesh.material.map(updateMaterial)
    : updateMaterial(mesh.material);
}

// 1. Fitted Waist & Baggy White Pants
function expandPants(character: THREE.Object3D) {
  const pants = findMesh(character, "Pant");
  if (!pants) return;

  const geometry = pants.geometry.clone();
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  const positions = geometry.getAttribute("position");
  if (!bounds || !positions) return;

  const sizeY = Math.max(bounds.max.y - bounds.min.y, Number.EPSILON);
  const centerX = (bounds.min.x + bounds.max.x) / 2;
  const centerZ = (bounds.min.z + bounds.max.z) / 2;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    const heightRatio = THREE.MathUtils.clamp((y - bounds.min.y) / sizeY, 0, 1);
    const lowerLegFactor = Math.max(0, 0.55 - heightRatio);
    const looseFit = 1.0 + Math.pow(lowerLegFactor, 1.2) * 0.3;

    const legCenterX =
      x >= centerX
        ? (centerX + bounds.max.x) * 0.5
        : (bounds.min.x + centerX) * 0.5;

    positions.setX(i, legCenterX + (x - legCenterX) * looseFit);
    positions.setZ(i, centerZ + (z - centerZ) * looseFit);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  pants.geometry = geometry;
}

// 2. Safe Natural Smile via blendshapes (Does not distort lip vertices)
function triggerNaturalFaceSmile(character: THREE.Object3D) {
  character.traverse((object) => {
    if (
      object instanceof THREE.SkinnedMesh &&
      object.morphTargetDictionary &&
      object.morphTargetInfluences
    ) {
      for (const [key, idx] of Object.entries(object.morphTargetDictionary)) {
        const lower = key.toLowerCase();
        if (
          lower.includes("smile") ||
          lower.includes("happy") ||
          lower.includes("mouth")
        ) {
          object.morphTargetInfluences[idx] = 0.75;
        }
      }
    }
  });
}

// 3. Outfit Setup
function setOutfit(character: THREE.Object3D) {
  // Full Sleeve Sky Blue Shirt
  setMeshProps(character, "BODYSHIRT", "#38b6ff", 0.85, 0.0);

  // Fitted Waist & Baggy White Pants
  expandPants(character);
  setMeshProps(character, "Pant", "#ffffff", 0.9, 0.0);

  // White Sneakers & Soles
  setMeshProps(character, "Shoe", "#f5f5f5", 0.35, 0.02);
  setMeshProps(character, "Sole", "#ffffff", 0.45, 0.0);

  // Warm Skin Tone
  setMeshProps(character, "Plane007", "#c68b59", 0.65, 0.0);
  setMeshProps(character, "Ear001", "#c68b59", 0.65, 0.0);
  setMeshProps(character, "Hand", "#c68b59", 0.65, 0.0);
  setMeshProps(character, "Neck", "#c68b59", 0.65, 0.0);

  // Original Normal Hair in Jet Black
  const hair = findMesh(character, "hair");
  if (hair) hair.visible = true;
  setMeshProps(character, "hair", "#111111", 0.85, 0.0);

  // Clean, straight, natural mouth
  triggerNaturalFaceSmile(character);
}

// 4. Mouse Cursor Head-Tracking
function setupMouseLookAt(character: THREE.Object3D) {
  const head =
    character.getObjectByName("spine006") ||
    character.getObjectByName("head") ||
    character.getObjectByName("Head");

  if (!head) return;

  let mouseX = 0;
  let mouseY = 0;

  const onMouseMove = (event: MouseEvent) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  window.addEventListener("mousemove", onMouseMove);

  const initialX = head.rotation.x;
  const initialY = head.rotation.y;

  const animateHead = () => {
    const maxLookX = 0.28;
    const maxLookY = 0.42;

    head.rotation.y = THREE.MathUtils.lerp(
      head.rotation.y,
      initialY + mouseX * maxLookY,
      0.06
    );
    head.rotation.x = THREE.MathUtils.lerp(
      head.rotation.x,
      initialX - mouseY * maxLookX,
      0.06
    );

    requestAnimationFrame(animateHead);
  };

  animateHead();
}

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;

            // Apply Straight Natural Lips & Outfit
            setOutfit(character);

            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });

            resolve(gltf);

            // GSAP Scroll Animations
            setCharTimeline(character, camera);
            setAllTimeline();

            // Cursor Tracking
            setupMouseLookAt(character);

            const footR = character.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;

            const footL = character.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;

            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;