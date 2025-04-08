import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import ThreeScene from './ThreeScene';

const SalesChart = ({
  data = [],
  width = '100%',
  height = '300px',
  title = 'Monthly Sales'
}) => {
  const [chartObjects, setChartObjects] = useState([]);

  // Create a simple label using a sprite
  const createTextSprite = (text, position, size = 0.25, color = '#333333') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    // Draw text on canvas
    context.font = `bold ${Math.floor(size * 100)}px Arial`;
    context.textAlign = 'center';
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create sprite material and sprite
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(position.x, position.y, position.z);
    sprite.scale.set(1, 0.5, 1);

    return sprite;
  };

  // Create 3D line chart
  const createLineChart = (scene) => {
    if (!data || data.length === 0) return [];

    const objects = [];
    const totalItems = data.length;
    const spacing = 1.2;
    const maxValue = Math.max(...data.map(item => item.value));
    const startX = -((totalItems - 1) * spacing) / 2;

    // Create points for line
    const points = [];
    const spheres = [];

    data.forEach((item, index) => {
      const normalizedValue = item.value / maxValue;
      const height = Math.max(normalizedValue * 4, 0.1);
      const x = startX + index * spacing;
      const y = height;

      points.push(new THREE.Vector3(x, y, 0));

      // Create sphere at data point
      const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x0ea5e9,
        shininess: 50
      });

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(x, y, 0);
      scene.add(sphere);
      spheres.push(sphere);
      objects.push(sphere);

      // Add label
      const labelSprite = createTextSprite(item.label, new THREE.Vector3(x, -0.5, 0));
      scene.add(labelSprite);
      objects.push(labelSprite);

      // Add value label
      const valueSprite = createTextSprite(item.value.toString(), new THREE.Vector3(x, y + 0.5, 0));
      scene.add(valueSprite);
      objects.push(valueSprite);
    });

    // Create line connecting points
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      linewidth: 2
    });

    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    objects.push(line);

    // Create area under the line
    const areaPoints = [...points];
    areaPoints.push(new THREE.Vector3(startX + (totalItems - 1) * spacing, 0, 0));
    areaPoints.push(new THREE.Vector3(startX, 0, 0));

    const areaShape = new THREE.Shape();
    areaShape.moveTo(areaPoints[0].x, areaPoints[0].y);

    for (let i = 1; i < points.length; i++) {
      areaShape.lineTo(areaPoints[i].x, areaPoints[i].y);
    }

    areaShape.lineTo(areaPoints[points.length].x, areaPoints[points.length].y);
    areaShape.lineTo(areaPoints[points.length + 1].x, areaPoints[points.length + 1].y);

    const areaGeometry = new THREE.ShapeGeometry(areaShape);
    const areaMaterial = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    const area = new THREE.Mesh(areaGeometry, areaMaterial);
    scene.add(area);
    objects.push(area);

    // Add title
    const titleSprite = createTextSprite(title, new THREE.Vector3(0, 4.5, 0), 0.5, '#075985');
    titleSprite.scale.set(2, 1, 1);
    scene.add(titleSprite);
    objects.push(titleSprite);

    // Animate spheres
    spheres.forEach((sphere, index) => {
      // Start with zero scale
      sphere.scale.set(0, 0, 0);

      // Animate to full scale
      const delay = 300 + index * 150;

      setTimeout(() => {
        const animate = () => {
          if (sphere.scale.x < 1) {
            sphere.scale.x += 0.1;
            sphere.scale.y += 0.1;
            sphere.scale.z += 0.1;
            requestAnimationFrame(animate);
          }
        };

        animate();
      }, delay);
    });

    return objects;
  };

  // Handle scene creation - using useRef to prevent infinite updates
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleSceneCreated = ({ scene, camera }) => {
    // Store references
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Position camera to view chart
    camera.position.set(0, 2, 8);

    // Only create chart objects if they don't exist yet
    if (chartObjects.length === 0) {
      // Create chart objects
      const objects = createLineChart(scene);
      setChartObjects(objects);
    }
  };

  // Handle animations separately
  useEffect(() => {
    if (chartObjects.length > 0 && sceneRef.current) {
      // Animate spheres
      const spheres = chartObjects.filter(obj => obj.type === 'Mesh' && obj.geometry.type === 'SphereGeometry');

      spheres.forEach((sphere, index) => {
        // Start with zero scale
        sphere.scale.set(0, 0, 0);

        // Animate to full scale
        const delay = 300 + index * 150;

        setTimeout(() => {
          const animate = () => {
            if (sphere.scale.x < 1) {
              sphere.scale.x += 0.1;
              sphere.scale.y += 0.1;
              sphere.scale.z += 0.1;
              animationFrameRef.current = requestAnimationFrame(animate);
            }
          };

          animate();
        }, delay);
      });
    }

    // Clean up animations
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [chartObjects]);

  // Update chart when data changes
  useEffect(() => {
    // If scene exists and data changes, recreate the chart
    if (sceneRef.current && data) {
      // Clean up old objects
      chartObjects.forEach(object => {
        if (sceneRef.current) {
          sceneRef.current.remove(object);
        }
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      // Create new chart objects
      const objects = createLineChart(sceneRef.current);
      setChartObjects(objects);
    }

    // Clean up on unmount
    return () => {
      chartObjects.forEach(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [data]);

  return (
    <ThreeScene
      width={width}
      height={height}
      backgroundColor="#f0fdfa"
      onSceneCreated={handleSceneCreated}
      controlsEnabled={true}
    />
  );
};

export default SalesChart;
