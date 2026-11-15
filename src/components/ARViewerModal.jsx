import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import katex from 'katex';
import {
  Camera,
  RotateCw,
  Box,
  Compass,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Video,
  VideoOff,
  Sparkles,
  TrendingUp,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Hand
} from 'lucide-react';

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17]
];

let sharedHandLandmarkerPromise = null;
function getOrLoadHandLandmarker() {
  if (!sharedHandLandmarkerPromise) {
    sharedHandLandmarkerPromise = (async () => {
      const wasmUrls = [
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm',
        'https://unpkg.com/@mediapipe/tasks-vision@1.2.3/wasm'
      ];
      let vision = null;
      for (const url of wasmUrls) {
        try {
          vision = await FilesetResolver.forVisionTasks(url);
          break;
        } catch (e) {}
      }
      if (!vision) throw new Error('Failed to load MediaPipe Vision WASM');

      const modelAssetPath =
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
      try {
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
      } catch (gpuErr) {
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath, delegate: 'CPU' },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
      }
    })().catch((err) => {
      sharedHandLandmarkerPromise = null;
      throw err;
    });
  }
  return sharedHandLandmarkerPromise;
}

export const AR_MODELS = [
  {
    id: 'revolution_vase',
    name: 'Khối Tròn Xoay Lọ Hoa (Chương IV)',
    shortName: '1. Khối Tròn Xoay (Tích Phân)',
    category: 'Nguyên Hàm & Tích Phân (Bài 13 - SGK 12 Tập 2)',
    formula: 'V = π ∫ [f(x)]² dx  với  f(x) = 0.45·sin(1.3x) + 1.25',
    latexFormula: 'V = \\pi \\int_{a}^{b} [f(x)]^2\\,dx \\;\\;\\text{với}\\;\\; f(x) = 0.45\\sin(1.3x) + 1.25',
    icon: Box,
    desc: 'Mặt tròn xoay sinh bởi đường cong f(x) quay 360° quanh trục hoành Ox, minh họa trực quan công thức thể tích khối tròn xoay.',
    defaultScale: 1.0,
    color: '#0284c7'
  },
  {
    id: 'sphere_plane_cut',
    name: 'Mặt Cầu & Thiết Diện Phẳng (Chương V)',
    shortName: '2. Mặt Cầu & Thiết Diện (Oxyz)',
    category: 'Phương Pháp Tọa Độ Không Gian Oxyz (Bài 17 - SGK 12 Tập 2)',
    formula: '(x - a)² + (y - b)² + (z - c)² = R²  &  r = √(R² - d²)',
    latexFormula: '(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2 \\;\\;\\&\\;\\; r = \\sqrt{R^2 - d^2}',
    icon: Compass,
    desc: 'Mô phỏng mặt cầu tâm I bán kính R bị cắt bởi mặt phẳng (α) theo giao tuyến là đường tròn thiết diện bán kính r = √(R² - d(I,(α))²).',
    defaultScale: 1.0,
    color: '#0d9488'
  },
  {
    id: 'vector_orthogonal',
    name: 'Tam Diện Oxyz & Tích Có Hướng [u, v]',
    shortName: '3. Tích Có Hướng [u, v] (Oxyz)',
    category: 'Vectơ & Hệ Trục Tọa Độ Không Gian (Chương II & V)',
    formula: 'n = [u, v] vuông góc với u, v  &  S_Δ = 1/2 |[u, v]|',
    latexFormula: '\\vec{n} = [\\vec{u}, \\vec{v}] \\perp \\vec{u}, \\vec{v} \\;\\;\\&\\;\\; S_{\\Delta} = \\frac{1}{2}|[\\vec{u}, \\vec{v}]|',
    icon: Compass,
    desc: 'Hệ trục tọa độ Oxyz trực chuẩn cùng hai vectơ u, v và vectơ tích có hướng [u, v] vuông góc với mặt phẳng hình bình hành.',
    defaultScale: 1.0,
    color: '#8b5cf6'
  },
  {
    id: 'cubic_surface',
    name: 'Đồ Thị Bậc Ba & Tiếp Tuyến Cực Trị (Chương I)',
    shortName: '4. Đường Cong Cực Trị 3D (Chương I)',
    category: 'Ứng Dụng Đạo Hàm Khảo Sát Hàm Số (Bài 1 & 4 - SGK 12 Tập 1)',
    formula: 'y = x³ - 3x  =>  y\' = 3x² - 3 = 0  <=>  x = ±1',
    latexFormula: 'y = x^3 - 3x \\implies y\' = 3x^2 - 3 = 0 \\iff x = \\pm 1',
    icon: TrendingUp,
    desc: 'Mô hình 3D đường cong hàm bậc ba y = x³ - 3x trong không gian cùng điểm cực đại (-1; 2), cực tiểu (1; -2) và tâm đối xứng O(0; 0).',
    defaultScale: 1.0,
    color: '#f59e0b'
  }
];

export default function ARViewerModal({
  initialModelId = 'revolution_vase',
  standalone = false,
  onExitStandalone
}) {
  const [selectedModelId, setSelectedModelId] = useState(
    AR_MODELS.some((m) => m.id === initialModelId) ? initialModelId : 'revolution_vase'
  );
  // Khởi tạo ở chế độ Hình 3D (false) để khi quét mã QR trên điện thoại luôn hiện ngay hình 3D rõ nét
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [scale, setScale] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [copied, setCopied] = useState(false);
  const [usdzUrl, setUsdzUrl] = useState('');
  const [hasStaticBg, setHasStaticBg] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [handGestureEnabled, setHandGestureEnabled] = useState(true);
  const [handStatus, setHandStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'active'
  const [gestureHint, setGestureHint] = useState('');
  // Mặc định là chế độ XOAY ('ROTATE'). Phải dùng tay chạm chọn vào nút ZOOM trên màn hình thì mới kích hoạt chức năng ZOOM ('ZOOM')
  const [handControlMode, setHandControlMode] = useState('ROTATE'); // 'ROTATE' | 'ZOOM'

  const scaleRef = useRef(scale);
  const isFullscreenRef = useRef(isFullscreen);
  const handGestureEnabledRef = useRef(handGestureEnabled);
  const handControlModeRef = useRef(handControlMode);
  const handLandmarkerRef = useRef(null);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    isFullscreenRef.current = isFullscreen;
  }, [isFullscreen]);

  useEffect(() => {
    handGestureEnabledRef.current = handGestureEnabled;
  }, [handGestureEnabled]);

  useEffect(() => {
    handControlModeRef.current = handControlMode;
  }, [handControlMode]);

  // Nạp mô hình AI HandLandmarker khi bật Camera & Cử chỉ tay trên Website (!standalone)
  useEffect(() => {
    if (standalone || !isCameraActive || !handGestureEnabled) {
      setHandStatus('idle');
      setGestureHint('');
      return;
    }
    let cancelled = false;
    if (handLandmarkerRef.current) {
      setHandStatus('ready');
      return;
    }
    setHandStatus('loading');
    getOrLoadHandLandmarker()
      .then((lm) => {
        if (cancelled) return;
        handLandmarkerRef.current = lm;
        setHandStatus('ready');
      })
      .catch((err) => {
        console.warn('HandLandmarker load error:', err);
        if (!cancelled) setHandStatus('idle');
      });
    return () => {
      cancelled = true;
    };
  }, [isCameraActive, handGestureEnabled]);

  const handleToggleHandGesture = () => {
    if (!isCameraActive) {
      setIsCameraActive(true);
      setHandGestureEnabled(true);
    } else {
      setHandGestureEnabled((prev) => !prev);
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(2.2, Number((prev + 0.15).toFixed(2))));
  const handleZoomOut = () => setScale((prev) => Math.max(0.4, Number((prev - 0.15).toFixed(2))));
  const handleWheelZoom = (e) => {
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setScale((prev) => Math.max(0.4, Math.min(2.2, Number((prev + delta).toFixed(2)))));
  };

  const videoRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const modelGroupRef = useRef(null);
  const streamRef = useRef(null);
  const staticBgImgRef = useRef(null);
  const fileInputRef = useRef(null);
  const isCameraActiveRef = useRef(isCameraActive);
  const hasCameraPermissionRef = useRef(hasCameraPermission);

  useEffect(() => {
    isCameraActiveRef.current = isCameraActive;
    hasCameraPermissionRef.current = hasCameraPermission;
  }, [isCameraActive, hasCameraPermission]);

  useEffect(() => {
    if (initialModelId && AR_MODELS.some((m) => m.id === initialModelId)) {
      setSelectedModelId(initialModelId);
    }
  }, [initialModelId]);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (staticBgImgRef.current) {
        drawSourceToBgCanvas(
          staticBgImgRef.current,
          staticBgImgRef.current.width,
          staticBgImgRef.current.height
        );
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const drawSourceToBgCanvas = (source, sw, sh, mirror = false) => {
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas || !source) return null;
    const bgCtx = bgCanvas.getContext('2d');
    if (!bgCtx) return null;
    const parent = bgCanvas.parentElement;
    const bw = (parent && parent.clientWidth) || bgCanvas.clientWidth || window.innerWidth || 640;
    const bh = (parent && parent.clientHeight) || bgCanvas.clientHeight || window.innerHeight || 480;
    if (bgCanvas.width !== bw || bgCanvas.height !== bh) {
      bgCanvas.width = bw;
      bgCanvas.height = bh;
    }
    const vw = sw || 1280;
    const vh = sh || 720;
    const scaleCover = Math.max(bw / vw, bh / vh);
    const dw = vw * scaleCover;
    const dh = vh * scaleCover;
    const dx = (bw - dw) / 2;
    const dy = (bh - dh) / 2;
    bgCtx.save();
    if (mirror) {
      bgCtx.translate(bw, 0);
      bgCtx.scale(-1, 1);
    }
    bgCtx.drawImage(source, dx, dy, dw, dh);
    bgCtx.restore();
    return { bgCtx, bw, bh, dx, dy, dw, dh, mirror };
  };

  // Camera lifecycle when user toggles Camera AR On/Off
  // Tạo thẻ video hoàn toàn trong bộ nhớ JS (không gắn autoPlay trong JSX) và chặn webkitbeginfullscreen trên iOS/Zalo
  useEffect(() => {
    let currentStream = null;
    let cancelled = false;
    let offscreenVid = null;

    const stopStream = () => {
      if (offscreenVid) {
        try {
          offscreenVid.pause();
          offscreenVid.srcObject = null;
        } catch (e) {}
      }
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      videoRef.current = null;
      setHasCameraPermission(false);
    };

    if (!isCameraActive) {
      stopStream();
      return;
    }

    const startCamera = async () => {
      try {
        setCameraError('');
        stopStream();

        const constraints = {
          video: {
            facingMode: { ideal: cameraFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        currentStream = stream;
        streamRef.current = stream;

        // Khởi tạo video trong JS với đầy đủ thuộc tính inline trước khi gán srcObject
        const vid = document.createElement('video');
        vid.playsInline = true;
        vid.muted = true;
        vid.defaultMuted = true;
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');
        vid.setAttribute('x5-playsinline', '');
        vid.setAttribute('x5-video-player-type', 'h5-page');
        vid.setAttribute('muted', '');

        // Nếu trình duyệt in-app (như Zalo iOS) cố ép mở trình phát video toàn màn hình che mất mô hình 3D:
        // Chụp ngay khung hình camera vào nền và đóng trình phát toàn màn hình ngay lập tức!
        const onForceFullscreen = () => {
          try {
            if (vid.videoWidth > 0) {
              const snap = document.createElement('canvas');
              snap.width = vid.videoWidth;
              snap.height = vid.videoHeight;
              snap.getContext('2d').drawImage(vid, 0, 0);
              staticBgImgRef.current = snap;
              setHasStaticBg(true);
              drawSourceToBgCanvas(snap, snap.width, snap.height);
            }
            if (vid.webkitExitFullscreen) {
              vid.webkitExitFullscreen();
            }
          } catch (e) {}
        };
        vid.addEventListener('webkitbeginfullscreen', onForceFullscreen);

        vid.srcObject = stream;
        offscreenVid = vid;
        videoRef.current = vid;

        await vid.play().catch(() => {});
        if (vid.webkitDisplayingFullscreen && vid.webkitExitFullscreen) {
          onForceFullscreen();
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.warn('Camera access error:', err);
        setHasCameraPermission(false);
        setIsCameraActive(false);
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Trình duyệt chưa được cấp quyền Camera. Bạn có thể bấm "Chụp nền bàn học" hoặc xoay mô hình 3D trực tiếp.'
            : 'Không tìm thấy thiết bị Camera trực tiếp. Hãy dùng nút "Chụp nền bàn học" hoặc chế độ 3D.'
        );
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [isCameraActive, cameraFacing]);

  const handleCaptureBgPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        staticBgImgRef.current = img;
        setHasStaticBg(true);
        setIsCameraActive(false);
        drawSourceToBgCanvas(img, img.width, img.height);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Helper tạo mũi tên 3D dày (Cylinder + Cone) để nhìn rõ nét trên nền Camera thực tế & tương thích USDZ
  const buildThickArrow = (dirVec, length, colorHex, shaftRadius = 0.045) => {
    const arrowGroup = new THREE.Group();
    const dir = dirVec.clone().normalize();
    const headLength = Math.min(length * 0.22, 0.42);
    const shaftLength = Math.max(0.1, length - headLength);

    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.2
    });

    const shaftGeom = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 16);
    shaftGeom.translate(0, shaftLength / 2, 0);
    arrowGroup.add(new THREE.Mesh(shaftGeom, mat));

    const headGeom = new THREE.ConeGeometry(shaftRadius * 2.5, headLength, 20);
    headGeom.translate(0, shaftLength + headLength / 2, 0);
    arrowGroup.add(new THREE.Mesh(headGeom, mat));

    const up = new THREE.Vector3(0, 1, 0);
    arrowGroup.quaternion.setFromUnitVectors(up, dir);
    return arrowGroup;
  };

  // Helper nối đoạn thẳng 3D dạng ống tròn mượt mà cho các liên kết hình học
  const buildCylinderSegment = (p1, p2, radius = 0.025, colorHex = 0xffffff) => {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const geom = new THREE.CylinderGeometry(radius, radius, len, 14);
    geom.translate(0, len / 2, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.45,
      roughness: 0.2
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    mesh.position.copy(p1);
    return mesh;
  };

  // Build 3D Three.js Mesh for the selected model (100% MeshStandardMaterial để tương thích cả WebGL & iOS ARKit USDZ)
  const buildModelMesh = (modelId) => {
    const group = new THREE.Group();

    if (modelId === 'revolution_vase') {
      const points = [];
      for (let i = 0; i <= 40; i++) {
        const x = (i / 40) * 4.4;
        const radius = 0.45 * Math.sin(x * 1.3) + 1.22 + 0.28 * Math.cos(x * 0.7);
        points.push(new THREE.Vector2(radius, x - 2.15));
      }
      const latheGeom = new THREE.LatheGeometry(points, 48);
      latheGeom.computeVertexNormals();

      const latheMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        emissive: 0x0369a1,
        emissiveIntensity: 0.35,
        metalness: 0.25,
        roughness: 0.2,
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
        wireframe: showWireframe
      });
      group.add(new THREE.Mesh(latheGeom, latheMat));

      if (!showWireframe) {
        const wireGeom = new THREE.LatheGeometry(points, 20);
        const wireMat = new THREE.MeshStandardMaterial({
          color: 0x7dd3fc,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.4,
          wireframe: true,
          transparent: true,
          opacity: 0.28
        });
        group.add(new THREE.Mesh(wireGeom, wireMat));
      }

      group.add(buildThickArrow(new THREE.Vector3(0, 1, 0), 2.6, 0x38bdf8, 0.035));

      [-1.5, -0.3, 0.9, 1.8].forEach((y) => {
        const x = y + 2.15;
        const r = 0.45 * Math.sin(x * 1.3) + 1.22 + 0.28 * Math.cos(x * 0.7);
        const ringGeom = new THREE.TorusGeometry(r + 0.02, 0.05, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xd97706,
          emissiveIntensity: 0.45,
          metalness: 0.6,
          roughness: 0.2
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = y;
        group.add(ringMesh);
      });
    } else if (modelId === 'sphere_plane_cut') {
      const R = 1.75;
      const d = 0.75; // Khoảng cách d(I, (P)) = 0.75 < R
      const r = Math.sqrt(R * R - d * d); // Bán kính đường tròn thiết diện chuẩn r = √(R² - d²) ≈ 1.581
      const rotX = Math.PI / 3; // Góc nghiêng của mặt phẳng cắt (60°)

      // Véc-tơ pháp tuyến đơn vị n của mặt phẳng: n = (0, -sin(rotX), cos(rotX))
      const ny = -Math.sin(rotX);
      const nz = Math.cos(rotX);

      // Tọa độ tâm thiết diện H = d * n (hình chiếu vuông góc của tâm cầu I lên mặt phẳng)
      const hx = 0;
      const hy = d * ny; // -0.75 * sin(60°) ≈ -0.6495
      const hz = d * nz; //  0.75 * cos(60°) = 0.375

      // 1. Mặt cầu tâm I(0, 0, 0) bán kính R = 1.75
      const sphereGeom = new THREE.SphereGeometry(R, 48, 48);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x075985,
        emissiveIntensity: 0.32,
        transparent: true,
        opacity: 0.62,
        roughness: 0.2,
        metalness: 0.2,
        side: THREE.DoubleSide,
        wireframe: showWireframe
      });
      group.add(new THREE.Mesh(sphereGeom, sphereMat));

      if (!showWireframe) {
        const wireMat = new THREE.MeshStandardMaterial({
          color: 0x7dd3fc,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.35,
          wireframe: true,
          transparent: true,
          opacity: 0.22
        });
        group.add(new THREE.Mesh(new THREE.SphereGeometry(R + 0.005, 20, 16), wireMat));
      }

      // 2. Mặt phẳng cắt (P) chứa H và vuông góc với IH
      const planeGeom = new THREE.PlaneGeometry(4.4, 4.4);
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.62,
        side: THREE.DoubleSide,
        roughness: 0.3
      });
      const planeMesh = new THREE.Mesh(planeGeom, planeMat);
      planeMesh.rotation.x = rotX;
      planeMesh.position.set(hx, hy, hz);
      group.add(planeMesh);

      // Khung viền mỏng bao quanh mặt phẳng
      const planeEdges = new THREE.EdgesGeometry(planeGeom);
      const planeLine = new THREE.LineSegments(
        planeEdges,
        new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.8 })
      );
      planeLine.rotation.x = rotX;
      planeLine.position.set(hx, hy, hz);
      group.add(planeLine);

      // 3. Đĩa tròn thiết diện phẳng (Circle Disk) tô màu vàng nhạt bán trong suốt
      const diskGeom = new THREE.CircleGeometry(r, 64);
      const diskMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xeab308,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide
      });
      const diskMesh = new THREE.Mesh(diskGeom, diskMat);
      diskMesh.rotation.x = rotX;
      diskMesh.position.set(hx, hy, hz);
      group.add(diskMesh);

      // 4. Đường tròn giao tuyến viền phát sáng (Torus Geometry) - KHỚP 100% VỚI VỎ MẶT CẦU
      const ringGeom = new THREE.TorusGeometry(r, 0.045, 16, 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfacc15,
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.4
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = rotX;
      ringMesh.position.set(hx, hy, hz);
      group.add(ringMesh);

      // 5. Điểm tâm cầu I(0, 0, 0)
      const ptMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9 });
      const ptGeomI = new THREE.SphereGeometry(0.09, 20, 20);
      group.add(new THREE.Mesh(ptGeomI, ptMatWhite));

      // 6. Điểm tâm thiết diện H(hx, hy, hz)
      const ptMatAmber = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.9 });
      const ptGeomH = new THREE.SphereGeometry(0.08, 20, 20);
      const ptMeshH = new THREE.Mesh(ptGeomH, ptMatAmber);
      ptMeshH.position.set(hx, hy, hz);
      group.add(ptMeshH);

      // 7. Điểm A nằm trên đường tròn giao tuyến: A = H + (r, 0, 0)
      const ptMatCyan = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 });
      const ptGeomA = new THREE.SphereGeometry(0.08, 20, 20);
      const ptMeshA = new THREE.Mesh(ptGeomA, ptMatCyan);
      ptMeshA.position.set(hx + r, hy, hz);
      group.add(ptMeshA);

      // 8. Các đoạn thẳng trực quan định lý Pythagore r = √(R² - d²):
      // - Đoạn IH (khoảng cách d, màu đỏ cam)
      group.add(buildCylinderSegment(new THREE.Vector3(0, 0, 0), new THREE.Vector3(hx, hy, hz), 0.025, 0xef4444));
      // - Đoạn HA (bán kính thiết diện r, màu vàng)
      group.add(buildCylinderSegment(new THREE.Vector3(hx, hy, hz), new THREE.Vector3(hx + r, hy, hz), 0.025, 0xfacc15));
      // - Đoạn IA (bán kính mặt cầu R, màu xanh dương)
      group.add(buildCylinderSegment(new THREE.Vector3(0, 0, 0), new THREE.Vector3(hx + r, hy, hz), 0.025, 0x38bdf8));
    } else if (modelId === 'cubic_surface') {
      group.add(buildThickArrow(new THREE.Vector3(1, 0, 0), 2.4, 0xef4444, 0.04));
      group.add(buildThickArrow(new THREE.Vector3(-1, 0, 0), 2.2, 0xef4444, 0.025));
      group.add(buildThickArrow(new THREE.Vector3(0, 1, 0), 2.4, 0x10b981, 0.04));
      group.add(buildThickArrow(new THREE.Vector3(0, -1, 0), 2.2, 0x10b981, 0.025));
      group.add(buildThickArrow(new THREE.Vector3(0, 0, 1), 2.2, 0x38bdf8, 0.035));

      const curvePoints = [];
      for (let t = -2.1; t <= 2.1; t += 0.06) {
        const y = 0.45 * (t * t * t - 3 * t);
        curvePoints.push(new THREE.Vector3(t, y, 0));
      }
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeom = new THREE.TubeGeometry(curve, 72, 0.11, 20, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.4,
        metalness: 0.3,
        roughness: 0.2,
        wireframe: showWireframe
      });
      group.add(new THREE.Mesh(tubeGeom, tubeMat));

      const sphereMax = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.5 })
      );
      sphereMax.position.set(-1, 0.9, 0);
      group.add(sphereMax);

      const sphereMin = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.5 })
      );
      sphereMin.position.set(1, -0.9, 0);
      group.add(sphereMin);
    } else {
      group.add(buildThickArrow(new THREE.Vector3(1, 0, 0), 2.4, 0xef4444, 0.035));
      group.add(buildThickArrow(new THREE.Vector3(0, 1, 0), 2.4, 0x10b981, 0.035));
      group.add(buildThickArrow(new THREE.Vector3(0, 0, 1), 2.4, 0x38bdf8, 0.035));

      group.add(buildThickArrow(new THREE.Vector3(1.6, 0.8, 1.2), 2.2, 0x06b6d4, 0.06));
      group.add(buildThickArrow(new THREE.Vector3(0.5, 1.8, 0.5), 2.0, 0xf59e0b, 0.06));
      group.add(buildThickArrow(new THREE.Vector3(-1.76, -0.2, 2.48), 2.6, 0xec4899, 0.07));

      const geom = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        1.6, 0.8, 1.2,
        2.1, 2.6, 1.7,
        0, 0, 0,
        2.1, 2.6, 1.7,
        0.5, 1.8, 0.5
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      group.add(new THREE.Mesh(geom, mat));
    }

    const baseRingOuter = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.035, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.5, transparent: true, opacity: 0.8 })
    );
    baseRingOuter.rotation.x = Math.PI / 2;
    baseRingOuter.position.y = -2.25;
    group.add(baseRingOuter);

    const baseDisk = new THREE.Mesh(
      new THREE.CircleGeometry(1.85, 48),
      new THREE.MeshStandardMaterial({
        color: 0x0891b2,
        emissive: 0x0e7490,
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      })
    );
    baseDisk.rotation.x = Math.PI / 2;
    baseDisk.position.y = -2.26;
    group.add(baseDisk);

    return group;
  };

  // Render Three.js Scene + 2D Background Camera Canvas + USDZ Export cho iOS ARKit
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const getStageSize = () => {
      const parent = canvas.parentElement;
      const w = (parent && parent.clientWidth) || canvas.clientWidth || window.innerWidth || 640;
      const h = (parent && parent.clientHeight) || canvas.clientHeight || window.innerHeight || 460;
      return { width: Math.max(1, w), height: Math.max(1, h) };
    };
    const { width, height } = getStageSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const initialDist = width < height ? 7.6 : 5.8;
    camera.position.set(0, 0.25, initialDist);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    // Truyền updateStyle = false để Three.js KHÔNG gắn cứng style width/height lên thẻ <canvas>,
    // giúp <canvas className="w-full h-full"> luôn tự động co giãn và phóng to theo khung chứa!
    renderer.setSize(width, height, false);

    scene.add(new THREE.AmbientLight(0xffffff, 1.35));
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(5, 8, 6);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    backLight.position.set(-5, -4, -4);
    scene.add(backLight);

    const modelGroup = buildModelMesh(selectedModelId);
    const effectiveScale = scale * (isFullscreen ? 1.15 : 1.0);
    modelGroup.scale.set(effectiveScale, effectiveScale, effectiveScale);
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Tạo file .usdz trong bộ nhớ để hỗ trợ ARKit gốc trên iPhone/iPad (hiển thị 3D thực tế trên Camera iOS)
    let activeUsdzObjectUrl = '';
    try {
      const exporter = new USDZExporter();
      const exportGroup = buildModelMesh(selectedModelId);
      exportGroup.scale.set(0.12, 0.12, 0.12);
      exportGroup.updateMatrixWorld(true);
      exporter.parseAsync(exportGroup).then((arraybuffer) => {
        const blob = new Blob([arraybuffer], { type: 'model/vnd.usdz+zip' });
        activeUsdzObjectUrl = URL.createObjectURL(blob);
        setUsdzUrl(activeUsdzObjectUrl);
      }).catch(() => {});
    } catch (e) {}

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let pinchStartDist = 0;
    let pinchStartScale = 1.0;
    let rotationY = 0;
    let rotationX = 0.12;

    const getTouchDist = (t1, t2) => Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

    const onPointerDown = (e) => {
      if (e.touches && e.touches.length === 2) {
        isDragging = false;
        pinchStartDist = getTouchDist(e.touches[0], e.touches[1]);
        pinchStartScale = scaleRef.current;
        return;
      }
      isDragging = true;
      prevMouse = {
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0
      };
    };

    const onPointerMove = (e) => {
      if (e.touches && e.touches.length === 2 && pinchStartDist > 0) {
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        const nextScale = Math.max(0.4, Math.min(2.2, Number((pinchStartScale * (dist / pinchStartDist)).toFixed(2))));
        scaleRef.current = nextScale;
        setScale(nextScale);
        return;
      }
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - prevMouse.x;
      const deltaY = clientY - prevMouse.y;

      rotationY += deltaX * 0.01;
      rotationX += deltaY * 0.01;
      rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationX));
      targetRotY = rotationY;
      targetRotX = rotationX;

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.y = rotationY;
        modelGroupRef.current.rotation.x = rotationX;
      }
      prevMouse = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
      pinchStartDist = 0;
    };

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    let lastW = width;
    let lastH = height;

    const syncViewportSize = () => {
      if (!canvas) return;
      const { width: w, height: h } = getStageSize();
      if (w !== lastW || h !== lastH) {
        lastW = w;
        lastH = h;
        camera.aspect = w / h;
        camera.position.z = w < h ? 7.6 : 5.8;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    };

    let lastVideoTime = -1;
    let lastLandmarks = [];
    let lastUiSync = 0;
    let handActiveNow = false;
    let prevPalmNorm = null;
    let targetRotY = rotationY;
    let targetRotX = rotationX;
    let hoveredBtnId = null;
    let hoverFrames = 0;

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      syncViewportSize();

      const vid = videoRef.current;
      const bgCanvas = bgCanvasRef.current;
      const isDesktopOrFrontCam =
        cameraFacing === 'user' ||
        (typeof navigator !== 'undefined' && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

      if (bgCanvas) {
        if (isCameraActiveRef.current && hasCameraPermissionRef.current && vid && vid.readyState >= 2) {
          const layout = drawSourceToBgCanvas(
            vid,
            vid.videoWidth || 1280,
            vid.videoHeight || 720,
            isDesktopOrFrontCam
          );

          // Nhận diện cử chỉ 1 bàn tay bằng AI MediaPipe HandLandmarker (chỉ sử dụng trên giao diện Website)
          if (!standalone && handGestureEnabledRef.current && handLandmarkerRef.current && layout) {
            const nowMs = performance.now();
            if (vid.currentTime !== lastVideoTime) {
              lastVideoTime = vid.currentTime;
              try {
                const res = handLandmarkerRef.current.detectForVideo(vid, nowMs);
                lastLandmarks = (res && res.landmarks) || [];
              } catch (e) {}
            }

            const { bgCtx, bw, bh, dx, dy, dw, dh, mirror } = layout;
            const toPx = (lm) => ({
              x: dx + (mirror ? 1 - lm.x : lm.x) * dw,
              y: dy + lm.y * dh,
              normX: mirror ? 1 - lm.x : lm.x,
              normY: lm.y
            });

            // Định nghĩa các NÚT ẢO TRÊN MÀN HÌNH để người dùng đưa ngón trỏ (hand[8]) vào chọn
            const currentMode = handControlModeRef.current;
            const btnW = 152;
            const btnH = 44;
            const topY = 52;
            const rightMargin = 16;
            const zoomBtnRect = {
              id: 'ZOOM_MODE',
              x: Math.max(16, bw - rightMargin - btnW),
              y: topY,
              w: btnW,
              h: btnH,
              label: currentMode === 'ZOOM' ? '🔍 ĐANG BẬT ZOOM' : '🔍 CHỌN ĐỂ ZOOM'
            };
            const rotateBtnRect = {
              id: 'ROTATE_MODE',
              x: Math.max(16, zoomBtnRect.x - btnW - 10),
              y: topY,
              w: btnW,
              h: btnH,
              label: currentMode === 'ROTATE' ? '🔄 ĐANG XOAY 3D' : '🔄 CHỌN ĐỂ XOAY'
            };
            const zoomInBtnRect = {
              id: 'ZOOM_IN_STEP',
              x: zoomBtnRect.x,
              y: topY + btnH + 10,
              w: btnW,
              h: 40,
              label: '➕ PHÓNG TO (+)'
            };
            const zoomOutBtnRect = {
              id: 'ZOOM_OUT_STEP',
              x: rotateBtnRect.x,
              y: topY + btnH + 10,
              w: btnW,
              h: 40,
              label: '➖ THU NHỎ (-)'
            };
            // Vùng nút Zoom ở góc dưới bên phải màn hình (khớp vị trí cụm nút Zoom dưới đáy)
            const bottomZoomZone = {
              id: 'ZOOM_MODE',
              x: Math.max(16, bw - 540),
              y: Math.max(100, bh - 64),
              w: 220,
              h: 56,
              label: ''
            };

            const virtualButtons =
              currentMode === 'ZOOM'
                ? [rotateBtnRect, zoomBtnRect, zoomOutBtnRect, zoomInBtnRect]
                : [rotateBtnRect, zoomBtnRect];
            const hitZones = [...virtualButtons, bottomZoomZone];

            // Vẽ các nút ảo trên màn hình Camera để tay chạm chọn
            const drawVirtualButton = (btn, isSelected, isHovering, progress) => {
              bgCtx.save();
              bgCtx.fillStyle = isSelected
                ? btn.id === 'ZOOM_MODE'
                  ? 'rgba(250, 204, 21, 0.92)'
                  : 'rgba(34, 211, 238, 0.92)'
                : isHovering
                  ? 'rgba(30, 41, 59, 0.95)'
                  : 'rgba(15, 23, 42, 0.82)';
              bgCtx.strokeStyle = isSelected
                ? '#ffffff'
                : isHovering
                  ? '#facc15'
                  : 'rgba(148, 163, 184, 0.55)';
              bgCtx.lineWidth = isSelected || isHovering ? 2.5 : 1.5;

              bgCtx.beginPath();
              if (bgCtx.roundRect) {
                bgCtx.roundRect(btn.x, btn.y, btn.w, btn.h, 12);
              } else {
                bgCtx.rect(btn.x, btn.y, btn.w, btn.h);
              }
              bgCtx.fill();
              bgCtx.stroke();

              // Thanh tiến trình khi đưa ngón tay chạm vào nút
              if (isHovering && progress > 0) {
                bgCtx.fillStyle = '#10b981';
                bgCtx.fillRect(btn.x + 4, btn.y + btn.h - 6, (btn.w - 8) * Math.min(1, progress), 4);
              }

              bgCtx.fillStyle = isSelected ? '#0f172a' : '#f8fafc';
              bgCtx.font = 'bold 12px sans-serif';
              bgCtx.textAlign = 'center';
              bgCtx.textBaseline = 'middle';
              bgCtx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
              bgCtx.restore();
            };

            let fingerCursor = null;
            if (lastLandmarks.length > 0) {
              fingerCursor = toPx(lastLandmarks[0][8]);
            }

            // Kiểm tra xem đầu ngón trỏ (hand[8]) có đang chạm vào nút ảo nào trên màn hình không
            let hitBtn = null;
            if (fingerCursor) {
              for (const b of hitZones) {
                if (
                  fingerCursor.x >= b.x &&
                  fingerCursor.x <= b.x + b.w &&
                  fingerCursor.y >= b.y &&
                  fingerCursor.y <= b.y + b.h
                ) {
                  hitBtn = b;
                  break;
                }
              }
            }

            if (hitBtn) {
              if (hoveredBtnId === hitBtn.id) {
                hoverFrames += 1;
              } else {
                hoveredBtnId = hitBtn.id;
                hoverFrames = 1;
              }

              // Chạm giữ nút ảo ~10 frames (0.3s) để kích hoạt
              if (hitBtn.id === 'ZOOM_MODE' && hoverFrames >= 10 && handControlModeRef.current !== 'ZOOM') {
                handControlModeRef.current = 'ZOOM';
                setHandControlMode('ZOOM');
                prevPalmNorm = null;
              } else if (
                hitBtn.id === 'ROTATE_MODE' &&
                hoverFrames >= 10 &&
                handControlModeRef.current !== 'ROTATE'
              ) {
                handControlModeRef.current = 'ROTATE';
                setHandControlMode('ROTATE');
                prevPalmNorm = null;
              } else if (hitBtn.id === 'ZOOM_IN_STEP' && hoverFrames >= 4) {
                const nextS = Math.min(2.2, scaleRef.current + 0.015);
                scaleRef.current = nextS;
                const eff = nextS * (isFullscreenRef.current ? 1.15 : 1.0);
                if (modelGroupRef.current) modelGroupRef.current.scale.set(eff, eff, eff);
              } else if (hitBtn.id === 'ZOOM_OUT_STEP' && hoverFrames >= 4) {
                const nextS = Math.max(0.4, scaleRef.current - 0.015);
                scaleRef.current = nextS;
                const eff = nextS * (isFullscreenRef.current ? 1.15 : 1.0);
                if (modelGroupRef.current) modelGroupRef.current.scale.set(eff, eff, eff);
              }
            } else {
              hoveredBtnId = null;
              hoverFrames = 0;
            }

            // Vẽ các nút ảo lên màn hình Camera
            virtualButtons.forEach((b) => {
              const isSel =
                (b.id === 'ZOOM_MODE' && handControlModeRef.current === 'ZOOM') ||
                (b.id === 'ROTATE_MODE' && handControlModeRef.current === 'ROTATE');
              const isHov = hitBtn && hitBtn.id === b.id;
              drawVirtualButton(b, isSel, isHov, isHov ? hoverFrames / 10 : 0);
            });

            if (lastLandmarks.length > 0) {
              handActiveNow = true;
              const hand = lastLandmarks[0];
              const palm = toPx(hand[9]);
              const thumbTip = toPx(hand[4]);
              const indexTip = toPx(hand[8]);

              // Kiểm tra nắm tay (✊) để nghỉ tay / đặt lại vị trí tay khi xoay
              const distToWrist = (pt) => Math.hypot(pt.x - hand[0].x, pt.y - hand[0].y);
              const isFingerExt = (tipIdx, pipIdx, mcpIdx) =>
                distToWrist(hand[tipIdx]) > distToWrist(hand[pipIdx]) * 1.07 &&
                distToWrist(hand[tipIdx]) > distToWrist(hand[mcpIdx]) * 1.14;
              const openFingersCount =
                (isFingerExt(8, 6, 5) ? 1 : 0) +
                (isFingerExt(12, 10, 9) ? 1 : 0) +
                (isFingerExt(16, 14, 13) ? 1 : 0) +
                (isFingerExt(20, 18, 17) ? 1 : 0);
              const isFistHold = openFingersCount === 0;

              // Vẽ khung xương 1 bàn tay 21 điểm + Con trỏ ngón trỏ (🎯) để chạm nút trên màn hình
              const skeletonColor =
                handControlModeRef.current === 'ZOOM'
                  ? 'rgba(250, 204, 21, 0.9)'
                  : 'rgba(34, 211, 238, 0.9)';

              bgCtx.save();
              bgCtx.strokeStyle = skeletonColor;
              bgCtx.lineWidth = 3;
              HAND_CONNECTIONS.forEach(([i, j]) => {
                const p1 = toPx(hand[i]);
                const p2 = toPx(hand[j]);
                bgCtx.beginPath();
                bgCtx.moveTo(p1.x, p1.y);
                bgCtx.lineTo(p2.x, p2.y);
                bgCtx.stroke();
              });

              hand.forEach((lm, idx) => {
                const p = toPx(lm);
                const isKeyFinger = idx === 8 || idx === 4;
                bgCtx.beginPath();
                bgCtx.arc(p.x, p.y, idx === 8 ? 10 : isKeyFinger ? 7.5 : 4.5, 0, Math.PI * 2);
                bgCtx.fillStyle = idx === 8 ? '#facc15' : '#10b981';
                bgCtx.fill();
                bgCtx.lineWidth = 2;
                bgCtx.strokeStyle = '#0f172a';
                bgCtx.stroke();
              });

              // Vòng tròn tâm ngắm ở đầu ngón trỏ (hand[8]) để chọn nút trên màn hình
              bgCtx.beginPath();
              bgCtx.arc(indexTip.x, indexTip.y, 16, 0, Math.PI * 2);
              bgCtx.strokeStyle = '#facc15';
              bgCtx.lineWidth = 2;
              bgCtx.stroke();
              bgCtx.restore();

              // Nếu đang đưa tay chạm vào vùng nút trên màn hình thì không xoay/zoom nhầm
              if (hitBtn) {
                prevPalmNorm = null;
              } else if (handControlModeRef.current === 'ROTATE') {
                // CHẾ ĐỘ XOAY 3D (Mặc định): Chỉ xoay hình 3D, chức năng Zoom hoàn toàn TẮT
                if (!isFistHold) {
                  if (prevPalmNorm) {
                    const dX = palm.normX - prevPalmNorm.x;
                    const dY = palm.normY - prevPalmNorm.y;
                    if (Math.hypot(dX, dY) > 0.0025) {
                      targetRotY += dX * Math.PI * 2.2;
                      targetRotX = Math.max(
                        -Math.PI / 2.4,
                        Math.min(Math.PI / 2.4, targetRotX + dY * Math.PI * 1.4)
                      );
                    }
                  }
                  prevPalmNorm = { x: palm.normX, y: palm.normY };
                } else {
                  prevPalmNorm = null;
                }
              } else if (handControlModeRef.current === 'ZOOM') {
                // CHẾ ĐỘ ZOOM (Chỉ hoạt động sau khi người dùng đã dùng tay chọn vào nút ZOOM trên màn hình!):
                // Khóa cứng góc xoay 3D, điều chỉnh Zoom bằng khoảng cách Ngón Cái & Ngón Trỏ (hoặc chạm nút +/- trên màn hình)
                prevPalmNorm = null;

                bgCtx.save();
                bgCtx.strokeStyle = '#facc15';
                bgCtx.lineWidth = 3.5;
                bgCtx.setLineDash([5, 4]);
                bgCtx.beginPath();
                bgCtx.moveTo(thumbTip.x, thumbTip.y);
                bgCtx.lineTo(indexTip.x, indexTip.y);
                bgCtx.stroke();

                const midPx = (thumbTip.x + indexTip.x) / 2;
                const midPy = (thumbTip.y + indexTip.y) / 2;
                bgCtx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                bgCtx.fillRect(midPx - 64, midPy - 15, 128, 24);
                bgCtx.fillStyle = '#facc15';
                bgCtx.font = 'bold 11px monospace';
                bgCtx.textAlign = 'center';
                bgCtx.fillText(`🔍 ZOOM: ${Math.round(scaleRef.current * 100)}%`, midPx, midPy + 1);
                bgCtx.restore();

                const pinchDist = Math.hypot(hand[4].x - hand[8].x, hand[4].y - hand[8].y);
                const palmSize = Math.max(0.06, Math.hypot(hand[0].x - hand[9].x, hand[0].y - hand[9].y));
                const pinchRatio = pinchDist / palmSize;
                const tZoom = Math.max(0, Math.min(1, (pinchRatio - 0.25) / 0.9));
                const rawTargetScale = 0.45 + tZoom * 1.7;

                if (Math.abs(rawTargetScale - scaleRef.current) > 0.02) {
                  const smoothedScale = Math.max(
                    0.4,
                    Math.min(2.2, scaleRef.current + (rawTargetScale - scaleRef.current) * 0.16)
                  );
                  scaleRef.current = smoothedScale;
                  const eff = smoothedScale * (isFullscreenRef.current ? 1.15 : 1.0);
                  if (modelGroupRef.current) {
                    modelGroupRef.current.scale.set(eff, eff, eff);
                  }
                }
              }

              // Nội suy mượt góc xoay 3D
              rotationY += (targetRotY - rotationY) * 0.22;
              rotationX += (targetRotX - rotationX) * 0.22;
              if (modelGroupRef.current) {
                modelGroupRef.current.rotation.y = rotationY;
                modelGroupRef.current.rotation.x = rotationX;
              }

              if (nowMs - lastUiSync > 120) {
                lastUiSync = nowMs;
                setScale(Number(scaleRef.current.toFixed(2)));
                setHandStatus('active');
                setGestureHint(
                  handControlModeRef.current === 'ZOOM'
                    ? `🔍 Đã chọn Nút ZOOM (${Math.round(scaleRef.current * 100)}%) • Chụm/mở tay hoặc chạm ➕/➖ để Zoom • Chạm "🔄 CHỌN ĐỂ XOAY" để quay lại xoay`
                    : `🔄 Đang ở chế độ XOAY 3D • Đưa ngón trỏ chạm vào nút "🔍 CHỌN ĐỂ ZOOM" góc phải trên màn hình để bật Zoom`
                );
              }
            } else {
              prevPalmNorm = null;
              hoveredBtnId = null;
              hoverFrames = 0;
              if (handActiveNow && nowMs - lastUiSync > 250) {
                handActiveNow = false;
                lastUiSync = nowMs;
                setHandStatus('ready');
                setGestureHint('');
              }
            }
          }
        } else if (staticBgImgRef.current) {
          drawSourceToBgCanvas(
            staticBgImgRef.current,
            staticBgImgRef.current.width || 1280,
            staticBgImgRef.current.height || 720,
            false
          );
        } else {
          const bgCtx = bgCanvas.getContext('2d');
          if (bgCtx) bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        }
      }

      if (autoRotate && !isDragging && !handActiveNow && modelGroupRef.current) {
        rotationY += 0.007;
        targetRotY = rotationY;
        modelGroupRef.current.rotation.y = rotationY;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      syncViewportSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvas.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (activeUsdzObjectUrl) URL.revokeObjectURL(activeUsdzObjectUrl);
      renderer.dispose();
    };
  }, [selectedModelId, showWireframe, autoRotate, standalone]);

  useEffect(() => {
    if (modelGroupRef.current) {
      const effectiveScale = scale * (isFullscreen ? 1.15 : 1.0);
      modelGroupRef.current.scale.set(effectiveScale, effectiveScale, effectiveScale);
    }
  }, [scale, isFullscreen]);

  const currentModelMeta = AR_MODELS.find((m) => m.id === selectedModelId) || AR_MODELS[0];
  const shortModelIndex = Math.max(1, AR_MODELS.findIndex((m) => m.id === selectedModelId) + 1);
  const baseOrigin = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? window.location.origin
    : 'https://mathmate-roan.vercel.app';
  // URL rút gọn (?m=1..4) giúp mã QR thưa, ô vuông to rõ, dễ quét từ khoảng cách xa 60-100cm và không bị dính cache cũ
  const liveUrl = `${baseOrigin}/?m=${shortModelIndex}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&ecc=L&margin=2&data=${encodeURIComponent(liveUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadModelSnapshot = () => {
    if (!canvasRef.current) return;
    try {
      const exportCanvas = document.createElement('canvas');
      const w = canvasRef.current.width || 800;
      const h = canvasRef.current.height || 600;
      exportCanvas.width = w;
      exportCanvas.height = h;
      const ctx = exportCanvas.getContext('2d');
      if ((isCameraActive && hasCameraPermission) || hasStaticBg) {
        if (bgCanvasRef.current) {
          ctx.drawImage(bgCanvasRef.current, 0, 0, w, h);
        }
      } else {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(canvasRef.current, 0, 0, w, h);
      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Mo-hinh-3D-${selectedModelId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.warn('Cannot export snapshot:', e);
    }
  };

  const showBgCanvas = (isCameraActive && hasCameraPermission) || hasStaticBg;

  // CHẾ ĐỘ ĐỘC LẬP KHI QUÉT MÃ QR TRÊN ĐIỆN THOẠI (?m=1..4):
  // Hiển thị duy nhất Hình 3D / AR toàn màn hình 100%, không hiện giao diện website
  if (standalone) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-slate-950 text-white overflow-hidden flex flex-col select-none">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCaptureBgPhoto}
          className="hidden"
        />

        {/* Nền Gradient khi chưa bật Camera */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />

        {/* Lớp Canvas 2D vẽ hình ảnh Camera ở z-0 (dưới mô hình 3D) */}
        <canvas
          ref={bgCanvasRef}
          className={`absolute inset-0 w-full h-full z-0 pointer-events-none ${
            showBgCanvas ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Lớp Canvas 3D WebGL ở z-10 (luôn nổi trên nền Camera) */}
        <canvas
          ref={canvasRef}
          onWheel={handleWheelZoom}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
        />

        {/* Vòng tâm mặt bàn thực tế 3D */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center gap-1 opacity-80">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-cyan-400/40 text-[10px] text-cyan-300 font-mono tracking-wider uppercase">
            Chạm vuốt để xoay 360° • Thu phóng {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Thanh nổi gọn phía trên: Tên hình 3D, Công thức & Nút Camera AR / Tải ảnh */}
        <div className="relative z-30 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent">
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3.5 py-2 max-w-md">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              {currentModelMeta.category}
            </div>
            <div className="text-sm font-extrabold text-white leading-snug">
              {currentModelMeta.name}
            </div>
            <div
              className="text-[11px] text-amber-300 mt-0.5"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(currentModelMeta.latexFormula || currentModelMeta.formula, {
                  throwOnError: false
                })
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                if (isCameraActive || hasStaticBg) {
                  setIsCameraActive(false);
                  staticBgImgRef.current = null;
                  setHasStaticBg(false);
                } else {
                  setIsCameraActive(true);
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer ${
                isCameraActive || hasStaticBg
                  ? 'bg-rose-500 text-white'
                  : 'bg-cyan-400 text-slate-950'
              }`}
            >
              {isCameraActive || hasStaticBg ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
              <span>{isCameraActive || hasStaticBg ? 'Tắt Camera' : 'Bật Camera AR'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-3 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Chụp nền AR</span>
            </button>

            {usdzUrl && (
              <a
                rel="ar"
                href={usdzUrl}
                download={`${selectedModelId}.usdz`}
                className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  alt=""
                  className="w-0 h-0 hidden"
                />
                <Box className="w-3.5 h-3.5" />
                <span>AR Gốc iOS</span>
              </a>
            )}

            <button
              onClick={handleDownloadModelSnapshot}
              className="px-3 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lưu PNG</span>
            </button>
          </div>
        </div>

        {/* Thanh điều khiển nổi dưới đáy: Đổi nhanh 4 hình 3D + Thu phóng + Xoay */}
        <div className="mt-auto relative z-20 p-3 sm:p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent space-y-2.5">
          <div className="flex items-center justify-between gap-2 max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-3.5 py-2">
            <button
              onClick={handleZoomOut}
              title="Thu nhỏ (-)"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer shrink-0"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.4"
              max="2.2"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg accent-cyan-400 cursor-pointer"
            />
            <button
              onClick={handleZoomIn}
              title="Phóng to (+)"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer shrink-0"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-cyan-300 w-10 text-center shrink-0">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                autoRotate ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {autoRotate ? 'Tự xoay' : 'Đứng yên'}
            </button>
            <button
              onClick={() => setShowWireframe(!showWireframe)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                showWireframe ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Khung dây
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-2xl mx-auto scrollbar-none">
            {AR_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModelId(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedModelId === m.id
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-800'
                }`}
              >
                {m.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCaptureBgPhoto}
        className="hidden"
      />

      {/* Top Banner & Model Navigation Bar (Inline Page Tab - No Popup Window) */}
      <div className="bg-white border border-sky-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Phòng Thí Nghiệm Thực Tế Tăng Cường AR 3D & Mã QR Điện Thoại
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-400 text-slate-950">
                  WebXR 3D Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100/90 mt-1">
                Tích hợp trực tiếp Khung chiếu Camera AR 3D trên máy tính và Mã QR trải nghiệm AR trên điện thoại trong cùng 1 tab
              </p>
            </div>
          </div>

          {/* Toggle Camera Live Feed & Fullscreen Button */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (isCameraActive || hasStaticBg) {
                  setIsCameraActive(false);
                  staticBgImgRef.current = null;
                  setHasStaticBg(false);
                } else {
                  setIsCameraActive(true);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isCameraActive || hasStaticBg
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
              }`}
            >
              {isCameraActive || hasStaticBg ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              <span>{isCameraActive || hasStaticBg ? 'Tắt Camera Thực Tế' : 'Bật Camera AR Thực Tế'}</span>
            </button>

            <button
              onClick={handleToggleHandGesture}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isCameraActive && handGestureEnabled
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                  : 'bg-white/15 hover:bg-white/25 text-emerald-300 border border-emerald-400/40'
              }`}
              title="Dùng cử chỉ bàn tay trước Camera để xoay 360° và phóng to / thu nhỏ mô hình 3D"
            >
              <Hand className="w-4 h-4" />
              <span>{isCameraActive && handGestureEnabled ? 'Cử chỉ tay AI: BẬT' : 'Cử chỉ tay AI'}</span>
            </button>

            {isCameraActive && (
              <button
                onClick={() => setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Đổi Camera</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'Thu nhỏ' : 'Phóng to'}</span>
            </button>
          </div>
        </div>

        {/* Clean Model Selector Tabs */}
        <div className="px-5 py-3.5 bg-sky-50/90 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {AR_MODELS.map((model) => {
              const Icon = model.icon;
              const isSelected = selectedModelId === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{model.shortName}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-80">
            <span className="text-xs text-slate-600 font-bold shrink-0">Thu phóng 3D:</span>
            <button
              onClick={handleZoomOut}
              title="Thu nhỏ (-)"
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer shrink-0"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.4"
              max="2.2"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <button
              onClick={handleZoomIn}
              title="Phóng to (+)"
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-blue-700 cursor-pointer shrink-0"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-extrabold text-blue-700 w-11 text-right shrink-0">
              {Math.round(scale * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left 8 Cols (Live 3D/AR Viewport) + Right 4 Cols (QR Code & Mobile AR Link) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3D & CAMERA AR VIEWPORT */}
        <div
          className={
            isFullscreen
              ? 'fixed top-14 md:top-0 bottom-0 left-0 md:left-64 right-0 z-40 bg-slate-950 flex flex-col overflow-hidden'
              : 'lg:col-span-8 bg-slate-950 rounded-3xl overflow-hidden shadow-md border border-slate-800 flex flex-col'
          }
        >
          {/* Active Model Info Strip */}
          <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                {currentModelMeta.category}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {currentModelMeta.name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isFullscreen && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {AR_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        selectedModelId === m.id
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {m.shortName}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      if (isCameraActive || hasStaticBg) {
                        setIsCameraActive(false);
                        staticBgImgRef.current = null;
                        setHasStaticBg(false);
                      } else {
                        setIsCameraActive(true);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                      isCameraActive || hasStaticBg
                        ? 'bg-rose-500 text-white'
                        : 'bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {isCameraActive || hasStaticBg ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                    <span>{isCameraActive || hasStaticBg ? 'Tắt Camera' : 'Bật Camera AR'}</span>
                  </button>
                </div>
              )}

              <div
                className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-amber-300"
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(currentModelMeta.latexFormula || currentModelMeta.formula, {
                    throwOnError: false
                  })
                }}
              />

              <button
                onClick={handleToggleHandGesture}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isCameraActive && handGestureEnabled
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40'
                }`}
                title="Bật/tắt điều khiển xoay & zoom hình 3D bằng cử chỉ bàn tay qua Camera"
              >
                <Hand className="w-3.5 h-3.5" />
                <span>{isCameraActive && handGestureEnabled ? 'Cử chỉ tay: BẬT' : 'Cử chỉ tay'}</span>
              </button>

              <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title={isFullscreen ? 'Thu nhỏ khung 3D' : 'Phóng to toàn màn hình'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? 'Thu nhỏ' : 'Phóng to'}</span>
              </button>
            </div>
          </div>

          {/* 3D + Video Stage */}
          <div
            className={`relative bg-slate-900 overflow-hidden flex items-center justify-center ${
              isFullscreen ? 'flex-1 min-h-0' : 'h-[420px] sm:h-[480px]'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-900 to-slate-950 z-0 pointer-events-none" />

            <canvas
              ref={bgCanvasRef}
              className={`absolute inset-0 w-full h-full z-0 pointer-events-none ${
                showBgCanvas ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <canvas
              ref={canvasRef}
              onWheel={handleWheelZoom}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
            />

            {/* AR Table Surface Reticle */}
            <div className="absolute bottom-14 pointer-events-none z-20 flex flex-col items-center gap-1 opacity-75">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950/75 border border-cyan-400/40 text-[10px] text-cyan-300 font-mono tracking-widest uppercase">
                Mặt Bàn Học Thực Tế 3D
              </span>
            </div>

            {/* Top Left Floating Guidance */}
            <div className="absolute top-3.5 left-3.5 z-20 bg-slate-950/85 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-slate-700 text-xs text-slate-200 flex items-center gap-2 max-w-[90%]">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  handStatus === 'active'
                    ? 'bg-amber-400 animate-ping'
                    : isCameraActive && handGestureEnabled
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-cyan-400'
                }`}
              />
              <span>
                {isCameraActive && handGestureEnabled
                  ? handStatus === 'loading'
                    ? 'Đang khởi tạo AI nhận diện cử chỉ 1 bàn tay...'
                    : handStatus === 'active' && gestureHint
                      ? gestureHint
                      : '✋ Đưa đầu ngón trỏ (🎯) chạm vào nút "🔍 CHỌN ĐỂ ZOOM" trên màn hình khi muốn bật chức năng Zoom'
                  : 'Kéo chuột / cuộn lăn chuột hoặc bấm "Cử chỉ tay" để xoay 360° & Zoom In/Out'}
              </span>
            </div>

            {/* Bottom Right Controls (Zoom +/- & Fullscreen & Rotate & Wireframe) */}
            <div className="absolute bottom-3.5 right-3.5 z-20 flex flex-wrap items-center gap-1.5">
              {isCameraActive && handGestureEnabled && (
                <button
                  onClick={() => setHandControlMode((prev) => (prev === 'ZOOM' ? 'ROTATE' : 'ZOOM'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    handControlMode === 'ZOOM'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-slate-900/90 text-amber-300 border-amber-400/50 hover:bg-slate-800'
                  }`}
                  title="Chạm bằng ngón tay trên màn hình hoặc bấm để bật/tắt chế độ Zoom bằng tay"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{handControlMode === 'ZOOM' ? 'Đang bật Zoom tay' : 'Nút Zoom (Tay)'}</span>
                </button>
              )}

              <div className="flex items-center bg-slate-900/90 border border-slate-700 rounded-xl p-0.5">
                <button
                  onClick={handleZoomOut}
                  title="Thu nhỏ mô hình (-)"
                  className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-200 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>-</span>
                </button>
                <span className="px-2 text-[11px] font-mono font-bold text-cyan-300">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  title="Phóng to mô hình (+)"
                  className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-cyan-300 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>+</span>
                </button>
              </div>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  autoRotate
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-900/85 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {autoRotate ? 'Đang tự xoay' : 'Dừng xoay'}
              </button>

              <button
                onClick={() => setShowWireframe(!showWireframe)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  showWireframe
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-900/85 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                Lưới đa giác (Wireframe)
              </button>

              <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold border border-amber-400 bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? 'Thu nhỏ' : 'Phóng to'}</span>
              </button>
            </div>
          </div>

          {/* Model Description Footer */}
          <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Ý nghĩa hình học trực quan:</strong> {currentModelMeta.desc}
              {cameraError && (
                <div className="mt-1 text-amber-300 font-medium">{cameraError}</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QR CODE & MOBILE AR LAUNCHER (INTEGRATED INLINE) */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-sky-200 overflow-hidden flex flex-col">
          <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold shadow-md shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-cyan-400 text-slate-950">
                TRẢI NGHIỆM TRÊN ĐIỆN THOẠI
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                Quét Mã QR Mở Hình 3D & AR
              </h3>
            </div>
          </div>

          <div className="p-5 flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-white rounded-2xl border-2 border-sky-300 shadow-sm">
              <img
                src={qrCodeApiUrl}
                alt="Mã QR AR Toán 12"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-slate-800 font-extrabold text-xs sm:text-sm">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Mở Trực Tiếp Hình 3D / AR Toàn Màn Hình:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                1. Quét mã QR bằng <strong>Camera</strong> hoặc <strong>Zalo</strong> và <strong>bấm vào link hiện lên</strong>.<br />
                2. Điện thoại mở ngay <strong>hình 3D {currentModelMeta.shortName}</strong> để xoay 360°, chiếu Camera AR / ARKit iOS hoặc tải ảnh PNG.
              </p>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={liveUrl}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 truncate focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép' : 'Chép link'}</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadModelSnapshot}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-teal-600" />
                  <span>Tải ảnh hình 3D</span>
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Mở riêng hình 3D</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
