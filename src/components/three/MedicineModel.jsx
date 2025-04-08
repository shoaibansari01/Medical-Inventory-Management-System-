import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeScene from './ThreeScene';

const MedicineModel = ({
  width = '100%',
  height = '300px',
  type = 'pill', // 'pill', 'bottle', 'box'
  color = '#38bdf8',
  rotate = true
}) => {
  const modelRef = useRef(null);

  // Create medicine model based on type
  const createMedicineModel = (scene) => {
    let medicineModel;

    switch (type) {
      case 'pill':
        medicineModel = createPillModel();
        break;
      case 'bottle':
        medicineModel = createBottleModel();
        break;
      case 'box':
        medicineModel = createBoxModel();
        break;
      default:
        medicineModel = createPillModel();
    }

    scene.add(medicineModel);
    modelRef.current = medicineModel;

    return medicineModel;
  };

  // Create pill model
  const createPillModel = () => {
    const group = new THREE.Group();

    // Create pill body (capsule shape)
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const sphereGeometry1 = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereGeometry2 = new THREE.SphereGeometry(0.5, 32, 32);

    const material = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 100
    });

    const cylinder = new THREE.Mesh(cylinderGeometry, material);
    const sphere1 = new THREE.Mesh(sphereGeometry1, material);
    const sphere2 = new THREE.Mesh(sphereGeometry2, material);

    sphere1.position.y = 1;
    sphere2.position.y = -1;

    group.add(cylinder);
    group.add(sphere1);
    group.add(sphere2);

    // Add highlight
    const highlightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2.2, 32);
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });

    const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    highlight.position.z = 0.3;
    group.add(highlight);

    // Rotate to horizontal position
    group.rotation.z = Math.PI / 2;

    return group;
  };

  // Create bottle model
  const createBottleModel = () => {
    const group = new THREE.Group();

    // Create bottle body
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });

    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Create bottle neck
    const neckGeometry = new THREE.CylinderGeometry(0.4, 0.6, 0.5, 32);
    const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
    neck.position.y = 1.25;
    group.add(neck);

    // Create bottle cap
    const capGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 32);
    const capMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 100
    });

    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 1.7;
    group.add(cap);

    // Create label
    const labelGeometry = new THREE.PlaneGeometry(1.7, 1.2);
    const labelMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.z = 0.85;
    label.rotation.x = Math.PI / 2;
    label.rotation.z = Math.PI / 2;
    group.add(label);

    return group;
  };

  // Create box model
  const createBoxModel = () => {
    const group = new THREE.Group();

    // Create box
    const boxGeometry = new THREE.BoxGeometry(2, 1, 3);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 50
    });

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    group.add(box);

    // Create label on top
    const topLabelGeometry = new THREE.PlaneGeometry(1.8, 2.8);
    const labelMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    const topLabel = new THREE.Mesh(topLabelGeometry, labelMaterial);
    topLabel.position.y = 0.51;
    topLabel.rotation.x = -Math.PI / 2;
    group.add(topLabel);

    // Create label on front
    const frontLabelGeometry = new THREE.PlaneGeometry(1.8, 0.8);
    const frontLabel = new THREE.Mesh(frontLabelGeometry, labelMaterial);
    frontLabel.position.z = 1.51;
    group.add(frontLabel);

    return group;
  };

  // Memoize the handleSceneCreated function to prevent unnecessary re-renders
  const handleSceneCreated = ({ scene, camera }) => {
    // Position camera
    camera.position.set(0, 0, 5);

    // Create medicine model
    createMedicineModel(scene);
  };

  // Update model when type or color changes
  useEffect(() => {
    if (modelRef.current) {
      // Remove old model from scene
      const parent = modelRef.current.parent;
      if (parent) {
        parent.remove(modelRef.current);

        // Create new model
        const newModel = createMedicineModel(parent);
        modelRef.current = newModel;
      }
    }
  }, [type, color]);

  // Animate model rotation
  useEffect(() => {
    if (!rotate) return;

    const animate = () => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01;
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [rotate]);

  return (
    <ThreeScene
      width={width}
      height={height}
      backgroundColor="#f0f9ff"
      onSceneCreated={handleSceneCreated}
      controlsEnabled={true}
    />
  );
};

export default MedicineModel;
