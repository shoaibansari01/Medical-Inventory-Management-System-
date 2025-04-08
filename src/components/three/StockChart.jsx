import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import ThreeScene from './ThreeScene';

const StockChart = ({
  data = [],
  width = '100%',
  height = '300px',
  colorScale = ['#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985']
}) => {
  const [chartObjects, setChartObjects] = useState([]);

  // Create a simple label using a sprite
  const createTextSprite = (text, position, size = 0.3, color = '#333333') => {
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

  // Create 3D bar chart
  const createBarChart = (scene) => {
    if (!data || data.length === 0) return [];

    const objects = [];
    const totalItems = data.length;
    const spacing = 1.5;
    const maxValue = Math.max(...data.map(item => item.value));
    const startX = -((totalItems - 1) * spacing) / 2;

    // Create bars
    data.forEach((item, index) => {
      const normalizedValue = item.value / maxValue;
      const height = Math.max(normalizedValue * 4, 0.1);
      const colorIndex = index % colorScale.length;

      // Create bar geometry
      const geometry = new THREE.BoxGeometry(1, height, 1);
      const material = new THREE.MeshPhongMaterial({
        color: colorScale[colorIndex],
        transparent: true,
        opacity: 0.8,
        shininess: 30
      });

      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(startX + index * spacing, height / 2, 0);
      scene.add(bar);
      objects.push(bar);

      // Add label
      const labelSprite = createTextSprite(item.label, new THREE.Vector3(startX + index * spacing, -0.5, 0));
      scene.add(labelSprite);
      objects.push(labelSprite);

      // Add value label
      const valueSprite = createTextSprite(item.value.toString(), new THREE.Vector3(startX + index * spacing, height + 0.3, 0));
      scene.add(valueSprite);
      objects.push(valueSprite);
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
      const objects = createBarChart(scene);
      setChartObjects(objects);
    }
  };

  // Handle animations separately
  useEffect(() => {
    if (chartObjects.length > 0 && sceneRef.current) {
      // Add animation
      chartObjects.forEach((object, index) => {
        if (object.type === 'Mesh' && object.geometry.type === 'BoxGeometry') {
          // Start with zero height
          object.scale.y = 0;

          // Animate to full height
          const targetScale = 1;
          const delay = index * 100;

          setTimeout(() => {
            const animate = () => {
              if (object.scale.y < targetScale) {
                object.scale.y += 0.05;
                animationFrameRef.current = requestAnimationFrame(animate);
              }
            };

            animate();
          }, delay);
        }
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
      const objects = createBarChart(sceneRef.current);
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
      backgroundColor="#f0f9ff"
      onSceneCreated={handleSceneCreated}
      controlsEnabled={true}
    />
  );
};

export default StockChart;
