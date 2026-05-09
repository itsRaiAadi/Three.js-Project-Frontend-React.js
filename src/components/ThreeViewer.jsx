import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function ThreeViewer({ modelUrl, initialCameraState, onSaveState }) {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const [viewerError, setViewerError] = useState('');

  const getCameraState = useCallback(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!camera || !controls) return null;

    return {
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      target: {
        x: controls.target.x,
        y: controls.target.y,
        z: controls.target.z,
      },
      zoom: camera.zoom,
    };
  }, []);

  const handleSaveState = async () => {
    const cameraState = getCameraState();

    if (cameraState) {
      await onSaveState(cameraState);
    }
  };

  const handleResetView = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!camera || !controls) return;

    camera.position.set(0, 2, 5);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !modelUrl) return undefined;

    let animationFrameId;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(
      initialCameraState?.position?.x ?? 0,
      initialCameraState?.position?.y ?? 2,
      initialCameraState?.position?.z ?? 5
    );
    camera.zoom = initialCameraState?.zoom ?? 1;
    camera.updateProjectionMatrix();
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
    directionalLight.position.set(4, 6, 8);
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(
      initialCameraState?.target?.x ?? 0,
      initialCameraState?.target?.y ?? 0,
      initialCameraState?.target?.z ?? 0
    );
    controls.update();
    controlsRef.current = controls;

    const loader = new GLTFLoader();

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.x += model.position.x - center.x;
        model.position.y += model.position.y - center.y;
        model.position.z += model.position.z - center.z;

        const maxDimension = Math.max(size.x, size.y, size.z);
        const fitDistance = maxDimension * 2.5 || 5;

        if (!initialCameraState) {
          camera.position.set(0, maxDimension || 2, fitDistance);
          controls.target.set(0, 0, 0);
          controls.update();
        }
      },
      undefined,
      () => {
        setViewerError('Unable to load model. Please verify the GLB file.');
      }
    );

    const handleResize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;

      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [modelUrl, initialCameraState]);

  return (
    <section className="viewer-section">
      <div className="viewer-toolbar">
        <div>
          <h2>3D Viewer</h2>
          <p className="muted">Use mouse drag to rotate, scroll to zoom, right-drag to pan.</p>
        </div>
        <div className="toolbar-actions">
          <button type="button" className="btn btn-outline" onClick={handleResetView}>
            Reset View
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveState}>
            Save Camera State
          </button>
        </div>
      </div>

      {viewerError && <p className="error-message">{viewerError}</p>}
      <div ref={containerRef} className="three-container" />
    </section>
  );
}

export default ThreeViewer;
