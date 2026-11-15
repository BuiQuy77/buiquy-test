import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  RotateCcw,
  Eye,
  Grid,
  Download,
  FileText,
  HelpCircle,
  MousePointer,
  RotateCw,
  CircleDot,
  Minus,
  Layers,
  GitCommit,
  CornerDownRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Check,
  Copy,
  Sparkles,
  Sliders,
  Undo2,
  Redo2,
  Crosshair,
  BookOpen
} from 'lucide-react';

/* ============================================================================
   KHO THƯ VIỆN 12 HÌNH MẪU HÌNH HỌC KHÔNG GIAN CHUẨN SGK (LỚP 11 & 12)
   ============================================================================ */
const GEOMETRY_TEMPLATES = [
  {
    id: 'pyramid_intersection_section',
    title: 'Giao tuyến hai mặt phẳng & Thiết diện chóp S.ABCD',
    category: 'GIAO ĐIỂM • THIẾT DIỆN',
    grade: 'Lớp 11',
    desc: 'Hình chóp S.ABCD có đáy tứ giác lồi, mặt phẳng (ζ) đi qua M ∈ SA, N ∈ SB, D cắt SC tại K và giao tuyến d = SI = (SAB) ∩ (SCD).',
    stepsGuide: [
      '1. Trong mp(ABCD), kéo dài AB cắt CD tại điểm I ⇒ SI = (SAB) ∩ (SCD).',
      '2. Trong mp(SAB), kéo dài MN cắt SI tại J; nối JD cắt SC tại K.',
      '3. Thiết diện của chóp S.ABCD cắt bởi mp(ζ) là tứ giác MNKD.'
    ],
    defaultView: { yaw: -28, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'S', label: 'S', pos: [0.1, 2.55, 0.0], labelOffset: [-18, -10] },
        { id: 'A', label: 'A', pos: [-1.85, -0.75, 0.35], labelOffset: [-20, 4] },
        { id: 'B', label: 'B', pos: [-0.85, -1.65, 1.35], labelOffset: [-18, 14] },
        { id: 'C', label: 'C', pos: [0.95, -1.45, 0.95], labelOffset: [10, 16] },
        { id: 'D', label: 'D', pos: [1.85, -0.75, -0.45], labelOffset: [12, 2] },
        { id: 'M', label: 'M', parentEdge: ['S', 'A'], ratio: 0.38, labelOffset: [-20, -4] },
        { id: 'N', label: 'N', parentEdge: ['S', 'B'], ratio: 0.56, labelOffset: [-22, 2] },
        { id: 'P', label: 'K', parentEdge: ['S', 'C'], ratio: 0.72, labelOffset: [10, 12] },
        { id: 'I', label: 'I', pos: [-0.08, -2.55, 2.25], labelOffset: [-18, 8] },
        { id: 'J', label: 'J', parentEdge: ['M', 'N'], ratio: 0.78, labelOffset: [-18, 12] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'solid', extend: [0, 0.15] },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'SD', p1: 'S', p2: 'D', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'solid', extend: [0.18, 0.55] },
        { id: 'BC', p1: 'B', p2: 'C', style: 'dashed' },
        { id: 'CD', p1: 'C', p2: 'D', style: 'solid', extend: [0.58, 0.18] },
        { id: 'AD', p1: 'A', p2: 'D', style: 'dashed' },
        { id: 'SI', p1: 'S', p2: 'I', style: 'solid', extend: [0.22, 0.15], lineLabel: 'd' },
        { id: 'MN', p1: 'M', p2: 'N', style: 'solid', extend: [0.15, 0.35], thick: true },
        { id: 'NP', p1: 'N', p2: 'P', style: 'solid', thick: true },
        { id: 'PD', p1: 'P', p2: 'D', style: 'solid', thick: true },
        { id: 'MD', p1: 'M', p2: 'D', style: 'dashed', thick: true },
        { id: 'ND', p1: 'N', p2: 'D', style: 'dashed' },
        { id: 'BI', p1: 'B', p2: 'I', style: 'solid' },
        { id: 'CI', p1: 'C', p2: 'I', style: 'solid' }
      ],
      planes: [
        {
          id: 'section_MNPD',
          points: ['M', 'N', 'P', 'D'],
          fill: 'rgba(15, 118, 110, 0.14)',
          stroke: '#0f766e',
          planeFrame: true,
          planeLabel: '(ζ)'
        }
      ],
      rightAngles: []
    })
  },
  {
    id: 'cube_hexagon_section',
    title: 'Thiết diện lục giác đều của hình lập phương',
    category: 'GIAO ĐIỂM • THIẾT DIỆN',
    grade: 'Lớp 11',
    desc: "Hình lập phương ABCD.A'B'C'D' bị cắt bởi mặt phẳng đi qua trung điểm 6 cạnh tạo thành thiết diện lục giác đều MNPQRS.",
    stepsGuide: [
      "1. Lấy M, N, P, Q, R, S lần lượt là trung điểm các cạnh A'B', BB', BC, CD, DD', A'D'.",
      '2. Các đoạn giao tuyến MN, NP, PQ, QR, RS, SM đều có độ dài bằng a√2 / 2.',
      '3. Thiết diện MNPQRS là lục giác đều nội tiếp mặt phẳng cắt.'
    ],
    defaultView: { yaw: -32, pitch: 22 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.4, -1.3, -1.2], labelOffset: [-16, -6] },
        { id: 'B', label: 'B', pos: [-1.4, -1.3, 1.2], labelOffset: [-18, 10] },
        { id: 'C', label: 'C', pos: [1.4, -1.3, 1.2], labelOffset: [10, 12] },
        { id: 'D', label: 'D', pos: [1.4, -1.3, -1.2], labelOffset: [12, -4] },
        { id: 'A1', label: "A'", pos: [-1.4, 1.3, -1.2], labelOffset: [-18, -10] },
        { id: 'B1', label: "B'", pos: [-1.4, 1.3, 1.2], labelOffset: [-20, -4] },
        { id: 'C1', label: "C'", pos: [1.4, 1.3, 1.2], labelOffset: [10, -4] },
        { id: 'D1', label: "D'", pos: [1.4, 1.3, -1.2], labelOffset: [12, -10] },
        { id: 'M', label: 'M', parentEdge: ['A1', 'B1'], ratio: 0.5, labelOffset: [-16, -8] },
        { id: 'N', label: 'N', parentEdge: ['B', 'B1'], ratio: 0.5, labelOffset: [-18, 2] },
        { id: 'P', label: 'P', parentEdge: ['B', 'C'], ratio: 0.5, labelOffset: [-4, 16] },
        { id: 'Q', label: 'Q', parentEdge: ['C', 'D'], ratio: 0.5, labelOffset: [12, 8] },
        { id: 'R', label: 'R', parentEdge: ['D', 'D1'], ratio: 0.5, labelOffset: [12, 0] },
        { id: 'S', label: 'S', parentEdge: ['A1', 'D1'], ratio: 0.5, labelOffset: [4, -12] }
      ],
      segments: [
        { id: 'AB', p1: 'A', p2: 'B', style: 'dashed' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'CD', p1: 'C', p2: 'D', style: 'solid' },
        { id: 'DA', p1: 'D', p2: 'A', style: 'dashed' },
        { id: 'A1B1', p1: 'A1', p2: 'B1', style: 'solid' },
        { id: 'B1C1', p1: 'B1', p2: 'C1', style: 'solid' },
        { id: 'C1D1', p1: 'C1', p2: 'D1', style: 'solid' },
        { id: 'D1A1', p1: 'D1', p2: 'A1', style: 'solid' },
        { id: 'AA1', p1: 'A', p2: 'A1', style: 'dashed' },
        { id: 'BB1', p1: 'B', p2: 'B1', style: 'solid' },
        { id: 'CC1', p1: 'C', p2: 'C1', style: 'solid' },
        { id: 'DD1', p1: 'D', p2: 'D1', style: 'solid' },
        { id: 'MN', p1: 'M', p2: 'N', style: 'solid', thick: true },
        { id: 'NP', p1: 'N', p2: 'P', style: 'solid', thick: true },
        { id: 'PQ', p1: 'P', p2: 'Q', style: 'dashed', thick: true },
        { id: 'QR', p1: 'Q', p2: 'R', style: 'solid', thick: true },
        { id: 'RS', p1: 'R', p2: 'S', style: 'solid', thick: true },
        { id: 'SM', p1: 'S', p2: 'M', style: 'solid', thick: true }
      ],
      planes: [
        {
          id: 'hex_plane',
          points: ['M', 'N', 'P', 'Q', 'R', 'S'],
          fill: 'rgba(13, 148, 136, 0.16)',
          stroke: '#0d9488',
          planeFrame: false
        }
      ],
      rightAngles: []
    })
  },
  {
    id: 'pyramid_sa_perp_base',
    title: 'Chóp S.ABCD có SA ⊥ (ABCD) & Khoảng cách từ A đến (SBC)',
    category: 'VUÔNG GÓC • KHOẢNG CÁCH',
    grade: 'Lớp 11',
    desc: 'Hình chóp S.ABCD đáy hình chữ nhật, SA ⊥ (ABCD). Kẻ AH ⊥ SB tại H ⇒ AH ⊥ (SBC) ⇒ d(A, (SBC)) = AH.',
    stepsGuide: [
      '1. Do BC ⊥ AB và BC ⊥ SA ⇒ BC ⊥ (SAB) ⇒ (SBC) ⊥ (SAB) theo giao tuyến SB.',
      '2. Trong ΔSAB vuông tại A, kẻ AH ⊥ SB tại H ⇒ AH ⊥ (SBC).',
      '3. Khoảng cách d(A, (SBC)) = AH = (SA · AB) / √(SA² + AB²).'
    ],
    defaultView: { yaw: -25, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.4, -1.2, -0.8], labelOffset: [-16, -6] },
        { id: 'B', label: 'B', pos: [-1.9, -1.2, 1.2], labelOffset: [-18, 12] },
        { id: 'C', label: 'C', pos: [1.3, -1.2, 1.2], labelOffset: [10, 14] },
        { id: 'D', label: 'D', pos: [1.8, -1.2, -0.8], labelOffset: [12, -4] },
        { id: 'S', label: 'S', pos: [-1.4, 2.2, -0.8], labelOffset: [-16, -10] },
        { id: 'H', label: 'H', parentEdge: ['S', 'B'], ratio: 0.45, labelOffset: [-18, -2] },
        { id: 'K', label: 'K', parentEdge: ['S', 'D'], ratio: 0.48, labelOffset: [10, -6] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'dashed', thick: true },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'SD', p1: 'S', p2: 'D', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'dashed' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'CD', p1: 'C', p2: 'D', style: 'solid' },
        { id: 'AD', p1: 'A', p2: 'D', style: 'dashed' },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' },
        { id: 'AH', p1: 'A', p2: 'H', style: 'dashed', thick: true },
        { id: 'AK', p1: 'A', p2: 'K', style: 'dashed', thick: true },
        { id: 'HK', p1: 'H', p2: 'K', style: 'dashed' }
      ],
      planes: [
        {
          id: 'plane_SBC',
          points: ['S', 'B', 'C'],
          fill: 'rgba(2, 132, 199, 0.10)',
          stroke: '#0284c7'
        },
        {
          id: 'plane_AHK',
          points: ['A', 'H', 'K'],
          fill: 'rgba(245, 158, 11, 0.16)',
          stroke: '#d97706'
        }
      ],
      rightAngles: [
        { vertex: 'A', arm1: 'S', arm2: 'D' },
        { vertex: 'B', arm1: 'A', arm2: 'C' },
        { vertex: 'H', arm1: 'A', arm2: 'S' }
      ]
    })
  },
  {
    id: 'regular_quad_pyramid',
    title: 'Chóp tứ giác đều S.ABCD & Đường cao SO ⊥ (ABCD)',
    category: 'VUÔNG GÓC • KHOẢNG CÁCH',
    grade: 'Lớp 11',
    desc: 'Hình chóp tứ giác đều S.ABCD có O = AC ∩ BD, SO ⊥ (ABCD), M là trung điểm CD và OH ⊥ SM tại H.',
    stepsGuide: [
      '1. Gọi O = AC ∩ BD là tâm hình vuông đáy ⇒ SO ⊥ (ABCD).',
      '2. Gọi M là trung điểm CD ⇒ OM ⊥ CD và SM ⊥ CD ⇒ CD ⊥ (SOM).',
      '3. Kẻ OH ⊥ SM tại H ⇒ OH = d(O, (SCD)) = 1/2 · d(A, (SCD)).'
    ],
    defaultView: { yaw: -26, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.45, -1.25, -0.85], labelOffset: [-18, -6] },
        { id: 'B', label: 'B', pos: [-1.85, -1.25, 1.15], labelOffset: [-18, 12] },
        { id: 'C', label: 'C', pos: [1.45, -1.25, 1.15], labelOffset: [10, 14] },
        { id: 'D', label: 'D', pos: [1.85, -1.25, -0.85], labelOffset: [12, -4] },
        { id: 'O', label: 'O', pos: [0.0, -1.25, 0.15], labelOffset: [-14, 14] },
        { id: 'S', label: 'S', pos: [0.0, 2.35, 0.15], labelOffset: [-8, -12] },
        { id: 'M', label: 'M', parentEdge: ['C', 'D'], ratio: 0.5, labelOffset: [12, 6] },
        { id: 'H', label: 'H', parentEdge: ['S', 'M'], ratio: 0.58, labelOffset: [10, -4] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'dashed' },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'SD', p1: 'S', p2: 'D', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'dashed' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'CD', p1: 'C', p2: 'D', style: 'solid' },
        { id: 'AD', p1: 'A', p2: 'D', style: 'dashed' },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' },
        { id: 'BD', p1: 'B', p2: 'D', style: 'dashed' },
        { id: 'SO', p1: 'S', p2: 'O', style: 'dashed', thick: true },
        { id: 'OM', p1: 'O', p2: 'M', style: 'dashed', thick: true },
        { id: 'SM', p1: 'S', p2: 'M', style: 'solid', thick: true },
        { id: 'OH', p1: 'O', p2: 'H', style: 'dashed', thick: true }
      ],
      planes: [
        {
          id: 'plane_SOM',
          points: ['S', 'O', 'M'],
          fill: 'rgba(13, 148, 136, 0.16)',
          stroke: '#0f766e'
        }
      ],
      rightAngles: [
        { vertex: 'O', arm1: 'S', arm2: 'M' },
        { vertex: 'M', arm1: 'S', arm2: 'C' },
        { vertex: 'H', arm1: 'O', arm2: 'S' }
      ]
    })
  },
  {
    id: 'skew_lines_distance',
    title: 'Khoảng cách giữa hai đường thẳng chéo nhau SA và BC',
    category: 'VUÔNG GÓC • KHOẢNG CÁCH',
    grade: 'Lớp 11',
    desc: 'Hình chóp S.ABC có SA ⊥ (ABC), ΔABC vuông tại B ⇒ AB là đoạn vuông góc chung của SA và BC.',
    stepsGuide: [
      '1. Ta có SA ⊥ (ABC) ⇒ SA ⊥ AB.',
      '2. Tam giác ABC vuông tại B ⇒ AB ⊥ BC.',
      '3. Vậy AB là đoạn vuông góc chung của SA và BC ⇒ d(SA, BC) = AB.'
    ],
    defaultView: { yaw: -24, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.5, -1.2, -0.4], labelOffset: [-18, -4] },
        { id: 'B', label: 'B', pos: [-0.2, -1.55, 1.35], labelOffset: [-14, 16] },
        { id: 'C', label: 'C', pos: [1.85, -1.1, -0.2], labelOffset: [12, 4] },
        { id: 'S', label: 'S', pos: [-1.5, 2.25, -0.4], labelOffset: [-16, -10] },
        { id: 'H', label: 'H', parentEdge: ['S', 'B'], ratio: 0.48, labelOffset: [-18, -4] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'solid', thick: true },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'solid', thick: true },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid', thick: true },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' },
        { id: 'AH', p1: 'A', p2: 'H', style: 'dashed' }
      ],
      planes: [
        {
          id: 'plane_SAB',
          points: ['S', 'A', 'B'],
          fill: 'rgba(13, 148, 136, 0.14)',
          stroke: '#0f766e'
        }
      ],
      rightAngles: [
        { vertex: 'A', arm1: 'S', arm2: 'B' },
        { vertex: 'B', arm1: 'A', arm2: 'C' },
        { vertex: 'H', arm1: 'A', arm2: 'S' }
      ]
    })
  },
  {
    id: 'prism_triangular',
    title: "Lăng trụ đứng ABC.A'B'C' & Thiết diện qua cạnh đáy",
    category: 'VUÔNG GÓC • KHOẢNG CÁCH',
    grade: 'Lớp 11',
    desc: "Hình lăng trụ đứng tam giác ABC.A'B'C' với mặt phẳng thiết diện đi qua AB và cắt cạnh bên CC' tại M.",
    stepsGuide: [
      "1. Cạnh bên CC' ⊥ (ABC) ⇒ ΔMCH vuông tại C.",
      '2. Kẻ CH ⊥ AB tại H ⇒ MH ⊥ AB (định lý 3 đường vuông góc).',
      '3. Góc giữa mp(ABM) và đáy (ABC) chính là ∠MHC.'
    ],
    defaultView: { yaw: -25, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.6, -1.4, -0.5], labelOffset: [-18, 4] },
        { id: 'B', label: 'B', pos: [-0.1, -1.6, 1.2], labelOffset: [-10, 16] },
        { id: 'C', label: 'C', pos: [1.6, -1.3, -0.4], labelOffset: [12, 4] },
        { id: 'A1', label: "A'", pos: [-1.6, 1.4, -0.5], labelOffset: [-18, -10] },
        { id: 'B1', label: "B'", pos: [-0.1, 1.2, 1.2], labelOffset: [-10, -12] },
        { id: 'C1', label: "C'", pos: [1.6, 1.5, -0.4], labelOffset: [12, -10] },
        { id: 'M', label: 'M', parentEdge: ['C', 'C1'], ratio: 0.62, labelOffset: [12, 0] },
        { id: 'H', label: 'H', parentEdge: ['A', 'B'], ratio: 0.5, labelOffset: [-16, 10] }
      ],
      segments: [
        { id: 'AB', p1: 'A', p2: 'B', style: 'solid', thick: true },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' },
        { id: 'A1B1', p1: 'A1', p2: 'B1', style: 'solid' },
        { id: 'B1C1', p1: 'B1', p2: 'C1', style: 'solid' },
        { id: 'A1C1', p1: 'A1', p2: 'C1', style: 'solid' },
        { id: 'AA1', p1: 'A', p2: 'A1', style: 'solid' },
        { id: 'BB1', p1: 'B', p2: 'B1', style: 'solid' },
        { id: 'CC1', p1: 'C', p2: 'C1', style: 'solid' },
        { id: 'AM', p1: 'A', p2: 'M', style: 'dashed', thick: true },
        { id: 'BM', p1: 'B', p2: 'M', style: 'solid', thick: true },
        { id: 'CH', p1: 'C', p2: 'H', style: 'dashed' },
        { id: 'MH', p1: 'M', p2: 'H', style: 'dashed' }
      ],
      planes: [
        {
          id: 'plane_ABM',
          points: ['A', 'B', 'M'],
          fill: 'rgba(15, 118, 110, 0.15)',
          stroke: '#0f766e'
        }
      ],
      rightAngles: [
        { vertex: 'C', arm1: 'C1', arm2: 'B' },
        { vertex: 'H', arm1: 'M', arm2: 'B' }
      ]
    })
  },
  {
    id: 'angle_line_plane',
    title: 'Góc giữa đường thẳng và mặt phẳng',
    category: 'GÓC TRONG KHÔNG GIAN',
    grade: 'Lớp 11',
    desc: 'Hình chiếu vuông góc của đường thẳng SC lên mặt phẳng đáy (ABC) là HC, góc (SC, (ABC)) = ∠SCH = φ.',
    stepsGuide: [
      '1. Xác định SH ⊥ (ABC) tại H ⇒ H là hình chiếu vuông góc của S lên (ABC).',
      '2. HC là hình chiếu vuông góc của SC lên mặt phẳng (ABC).',
      '3. Góc(SC, (ABC)) = Góc(SC, HC) = ∠SCH (trong ΔSHC vuông tại H).'
    ],
    defaultView: { yaw: -22, pitch: 16 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.8, -1.1, -0.5], labelOffset: [-18, 2] },
        { id: 'B', label: 'B', pos: [-0.3, -1.5, 1.4], labelOffset: [-10, 16] },
        { id: 'C', label: 'C', pos: [1.9, -1.1, -0.2], labelOffset: [12, 4] },
        { id: 'H', label: 'H', parentEdge: ['A', 'B'], ratio: 0.5, labelOffset: [-16, 12] },
        { id: 'S', label: 'S', pos: [-1.05, 2.2, 0.45], labelOffset: [-14, -12] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'solid' },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid', thick: true },
        { id: 'AB', p1: 'A', p2: 'B', style: 'solid' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' },
        { id: 'SH', p1: 'S', p2: 'H', style: 'dashed', thick: true },
        { id: 'HC', p1: 'H', p2: 'C', style: 'dashed', thick: true }
      ],
      planes: [
        {
          id: 'plane_SHC',
          points: ['S', 'H', 'C'],
          fill: 'rgba(13, 148, 136, 0.15)',
          stroke: '#0f766e'
        }
      ],
      rightAngles: [
        { vertex: 'H', arm1: 'S', arm2: 'C' }
      ]
    })
  },
  {
    id: 'dihedral_angle',
    title: 'Góc nhị diện [S, BC, A] trong chóp tam giác đều',
    category: 'GÓC TRONG KHÔNG GIAN',
    grade: 'Lớp 11',
    desc: 'Chóp đều S.ABC có đường cao SO ⊥ (ABC), M là trung điểm BC ⇒ góc phẳng nhị diện [S, BC, A] là ∠SMA.',
    stepsGuide: [
      '1. Gọi M là trung điểm BC ⇒ AM ⊥ BC và SM ⊥ BC.',
      '2. Cạnh nhị diện BC ⊥ mp(SAM) ⇒ ∠SMA là góc phẳng nhị diện [S, BC, A].',
      '3. Trong ΔSOM vuông tại O: tan(∠SMA) = SO / OM.'
    ],
    defaultView: { yaw: -24, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.9, -1.2, -0.3], labelOffset: [-18, 2] },
        { id: 'B', label: 'B', pos: [0.1, -1.5, 1.4], labelOffset: [-8, 16] },
        { id: 'C', label: 'C', pos: [1.8, -1.1, -0.6], labelOffset: [12, 2] },
        { id: 'M', label: 'M', parentEdge: ['B', 'C'], ratio: 0.5, labelOffset: [12, 10] },
        { id: 'O', label: 'O', parentEdge: ['A', 'M'], ratio: 0.67, labelOffset: [-6, 14] },
        { id: 'S', label: 'S', pos: [0.0, 2.25, 0.16], labelOffset: [-6, -14] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'solid' },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'solid' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' },
        { id: 'AM', p1: 'A', p2: 'M', style: 'dashed', thick: true },
        { id: 'SM', p1: 'S', p2: 'M', style: 'solid', thick: true },
        { id: 'SO', p1: 'S', p2: 'O', style: 'dashed', thick: true }
      ],
      planes: [
        {
          id: 'plane_SAM',
          points: ['S', 'A', 'M'],
          fill: 'rgba(13, 148, 136, 0.14)',
          stroke: '#0f766e'
        }
      ],
      rightAngles: [
        { vertex: 'O', arm1: 'S', arm2: 'M' },
        { vertex: 'M', arm1: 'S', arm2: 'B' }
      ]
    })
  },
  {
    id: 'oxyz_coordinates_12',
    title: 'Hệ trục tọa độ Oxyz & Hình chiếu của điểm M(x; y; z)',
    category: 'TỌA ĐỘ KHÔNG GIAN OXYZ',
    grade: 'Lớp 12',
    desc: "Biểu diễn điểm M(x; y; z), hình chiếu M' trên mặt phẳng (Oxy) và hình hộp tọa độ chuẩn SGK Toán 12 Chương II & V.",
    stepsGuide: [
      "1. Hình chiếu vuông góc của M(x; y; z) lên mặt phẳng (Oxy) là M'(x; y; 0).",
      '2. Hình chiếu lên các trục Ox, Oy, Oz lần lượt là A(x; 0; 0), B(0; y; 0), C(0; 0; z).',
      '3. Độ dài vectơ OM = √(x² + y² + z²).'
    ],
    defaultView: { yaw: -35, pitch: 20 },
    buildScene: () => ({
      points: [
        { id: 'O', label: 'O', pos: [-0.8, -0.8, -0.8], labelOffset: [-16, -6] },
        { id: 'X_END', label: 'x', pos: [-2.4, -1.7, 1.4], labelOffset: [-16, 10] },
        { id: 'Y_END', label: 'y', pos: [2.4, -0.8, -0.8], labelOffset: [12, 4] },
        { id: 'Z_END', label: 'z', pos: [-0.8, 2.3, -0.8], labelOffset: [-14, -10] },
        { id: 'A', label: 'x₀', pos: [-1.8, -1.35, 0.6], labelOffset: [-20, 8] },
        { id: 'B', label: 'y₀', pos: [1.4, -0.8, -0.8], labelOffset: [4, -12] },
        { id: 'C', label: 'z₀', pos: [-0.8, 1.4, -0.8], labelOffset: [-20, 0] },
        { id: 'M_XY', label: "M'", pos: [0.4, -1.35, 0.6], labelOffset: [8, 14] },
        { id: 'M', label: 'M(x;y;z)', pos: [0.4, 0.85, 0.6], labelOffset: [10, -10] }
      ],
      segments: [
        { id: 'OX', p1: 'O', p2: 'X_END', style: 'solid', thick: true },
        { id: 'OY', p1: 'O', p2: 'Y_END', style: 'solid', thick: true },
        { id: 'OZ', p1: 'O', p2: 'Z_END', style: 'solid', thick: true },
        { id: 'AM_XY', p1: 'A', p2: 'M_XY', style: 'dashed' },
        { id: 'BM_XY', p1: 'B', p2: 'M_XY', style: 'dashed' },
        { id: 'OM_XY', p1: 'O', p2: 'M_XY', style: 'dashed' },
        { id: 'MM_XY', p1: 'M', p2: 'M_XY', style: 'dashed', thick: true },
        { id: 'CM', p1: 'C', p2: 'M', style: 'dashed' },
        { id: 'OM', p1: 'O', p2: 'M', style: 'solid', thick: true }
      ],
      planes: [
        {
          id: 'plane_OMM',
          points: ['O', 'M_XY', 'M', 'C'],
          fill: 'rgba(2, 132, 199, 0.13)',
          stroke: '#0284c7'
        }
      ],
      rightAngles: [
        { vertex: 'M_XY', arm1: 'M', arm2: 'O' }
      ]
    })
  },
  {
    id: 'sphere_section_circle',
    title: 'Mặt cầu tâm I cắt mặt phẳng (P) theo đường tròn thiết diện',
    category: 'MẶT TRÒN XOAY & MẶT CẦU',
    grade: 'Lớp 12',
    desc: 'Mặt cầu S(I; R) bị cắt bởi mặt phẳng (P) tạo giao tuyến đường tròn tâm H bán kính r = √(R² - IH²).',
    stepsGuide: [
      '1. Gọi H là hình chiếu vuông góc của tâm I lên mặt phẳng (P) ⇒ d = IH = d(I, (P)).',
      '2. Khi d < R, mặt phẳng (P) cắt mặt cầu theo đường tròn (C) tâm H.',
      '3. Bán kính đường tròn thiết diện: r = HA = √(R² - d²).'
    ],
    defaultView: { yaw: -20, pitch: 15 },
    buildScene: () => ({
      points: [
        { id: 'I', label: 'I', pos: [0, 0.25, 0], labelOffset: [-16, -6] },
        { id: 'H', label: 'H', pos: [0, -0.55, 0], labelOffset: [-16, 12] },
        { id: 'A', label: 'A', pos: [1.41, -0.55, 0.51], labelOffset: [12, 8] },
        { id: 'B', label: 'B', pos: [-1.41, -0.55, -0.51], labelOffset: [-18, 6] },
        { id: 'N', label: 'N', pos: [0, 1.95, 0], labelOffset: [-6, -12] },
        { id: 'P1', label: '', pos: [-2.4, -0.55, -1.6], labelOffset: [0, 0] },
        { id: 'P2', label: '', pos: [-1.8, -0.55, 1.6], labelOffset: [0, 0] },
        { id: 'P3', label: '', pos: [2.4, -0.55, 1.6], labelOffset: [0, 0] },
        { id: 'P4', label: '', pos: [1.8, -0.55, -1.6], labelOffset: [0, 0] }
      ],
      segments: [
        { id: 'IH', p1: 'I', p2: 'H', style: 'dashed', thick: true },
        { id: 'HA', p1: 'H', p2: 'A', style: 'dashed', thick: true },
        { id: 'IA', p1: 'I', p2: 'A', style: 'dashed', thick: true },
        { id: 'HB', p1: 'H', p2: 'B', style: 'dashed' }
      ],
      planes: [
        {
          id: 'plane_P',
          points: ['P1', 'P2', 'P3', 'P4'],
          fill: 'rgba(15, 118, 110, 0.12)',
          stroke: '#0f766e',
          planeLabel: '(P)'
        }
      ],
      rightAngles: [
        { vertex: 'H', arm1: 'I', arm2: 'A' }
      ],
      specialCircles: [
        { center: 'I', radius: 1.7, type: 'sphere' },
        { center: 'H', radius: 1.5, type: 'equator' }
      ]
    })
  },
  {
    id: 'cone_axial_section',
    title: 'Hình nón tròn xoay & Thiết diện qua đỉnh S',
    category: 'MẶT TRÒN XOAY & MẶT CẦU',
    grade: 'Lớp 12',
    desc: 'Hình nón đỉnh S, tâm đáy O, đường cao SO = h, đường sinh SA = SB = l và thiết diện ΔSAB qua đỉnh.',
    stepsGuide: [
      '1. Đường cao SO ⊥ đáy tại tâm O, bán kính đáy OA = OB = R.',
      '2. Đường sinh l = SA = √(h² + R²); diện tích xung quanh S_xq = πRl.',
      '3. Gọi M là trung điểm dây cung AB ⇒ OM ⊥ AB và SM ⊥ AB.'
    ],
    defaultView: { yaw: -22, pitch: 16 },
    buildScene: () => ({
      points: [
        { id: 'S', label: 'S', pos: [0, 2.2, 0], labelOffset: [-8, -12] },
        { id: 'O', label: 'O', pos: [0, -1.25, 0], labelOffset: [-16, 10] },
        { id: 'A', label: 'A', pos: [-1.6, -1.25, 0], labelOffset: [-20, 4] },
        { id: 'B', label: 'B', pos: [1.6, -1.25, 0], labelOffset: [12, 4] },
        { id: 'C', label: 'M', pos: [0.55, -1.25, 1.35], labelOffset: [8, 14] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'solid', thick: true },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid', thick: true },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'dashed', thick: true },
        { id: 'SO', p1: 'S', p2: 'O', style: 'dashed', thick: true },
        { id: 'OC', p1: 'O', p2: 'C', style: 'dashed' }
      ],
      planes: [
        {
          id: 'plane_SAB_cone',
          points: ['S', 'A', 'B'],
          fill: 'rgba(13, 148, 136, 0.14)',
          stroke: '#0f766e'
        }
      ],
      rightAngles: [
        { vertex: 'O', arm1: 'S', arm2: 'B' }
      ],
      specialCircles: [
        { center: 'O', radius: 1.6, type: 'equator' }
      ]
    })
  }
];

const TOOL_HINTS = {
  select: 'Chế độ Chọn & Kéo (CH): Kéo nền trắng để xoay 3D • Kéo điểm trên cạnh để trượt thiết diện • Kéo chữ tên điểm để chỉnh vị trí nhãn.',
  rotate: 'Chế độ Xoay 3D (XO): Giữ chuột trái và kéo trên bản vẽ để xoay mô hình theo mọi góc nhìn.',
  point: 'Thêm Điểm trên cạnh (ĐI): Bấm vào bất kỳ cạnh nào trên hình để lấy thêm điểm thuộc cạnh đó.',
  midpoint: 'Lấy Trung điểm (TĐ): Bấm vào một cạnh bất kỳ để tự động dựng chính xác trung điểm (k = 0.5) của cạnh đó.',
  segment: 'Nối Đoạn thẳng (ĐO): Bấm chọn Điểm thứ 1, sau đó bấm chọn Điểm thứ 2 để nối đoạn thẳng (hoặc đường kéo dài).',
  intersect: 'Tìm Giao điểm 2 đường (GĐ): Bấm chọn Cạnh thứ 1, sau đó bấm chọn Cạnh thứ 2 (cùng mặt phẳng) để tự động kéo dài và tạo giao điểm.',
  plane: 'Tô Mặt phẳng / Thiết diện (MP): Bấm lần lượt từ 3 điểm trở lên, sau đó nhấn nút "Hoàn tất tô mặt" để tạo mặt phẳng thiết diện.',
  perp: 'Hạ Đường vuông góc (VG): Bấm chọn Điểm gốc trước, sau đó bấm vào Cạnh đích để tự động hạ đường vuông góc và gắn ký hiệu góc vuông.'
};

/* ============================================================================
   KHỐI CƠ SỞ SẠCH CHO TAB "TỰ DỰNG" (CHƯA CÓ ĐƯỜNG PHỤ)
   ============================================================================ */
const CUSTOM_BASE_SHAPES = [
  {
    id: 'base_tetra',
    name: 'Chóp tam giác S.ABC',
    defaultView: { yaw: -26, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'S', label: 'S', pos: [-0.2, 2.2, 0.0], labelOffset: [-14, -10] },
        { id: 'A', label: 'A', pos: [-1.7, -1.2, -0.5], labelOffset: [-18, -2] },
        { id: 'B', label: 'B', pos: [-0.2, -1.4, 1.4], labelOffset: [-10, 16] },
        { id: 'C', label: 'C', pos: [1.8, -1.2, -0.3], labelOffset: [10, 4] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'solid' },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'solid' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' }
      ],
      planes: [],
      rightAngles: []
    })
  },
  {
    id: 'base_quad_pyramid',
    name: 'Chóp tứ giác S.ABCD',
    defaultView: { yaw: -26, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'S', label: 'S', pos: [-0.9, 2.25, -0.5], labelOffset: [-14, -10] },
        { id: 'A', label: 'A', pos: [-1.45, -1.2, -0.85], labelOffset: [-18, -6] },
        { id: 'B', label: 'B', pos: [-1.85, -1.2, 1.15], labelOffset: [-18, 12] },
        { id: 'C', label: 'C', pos: [1.35, -1.2, 1.15], labelOffset: [10, 14] },
        { id: 'D', label: 'D', pos: [1.75, -1.2, -0.85], labelOffset: [12, -4] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'dashed' },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'SD', p1: 'S', p2: 'D', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'dashed' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'CD', p1: 'C', p2: 'D', style: 'solid' },
        { id: 'AD', p1: 'A', p2: 'D', style: 'dashed' }
      ],
      planes: [],
      rightAngles: []
    })
  },
  {
    id: 'base_regular_pyramid',
    name: 'Chóp đều S.ABCD (tâm O)',
    defaultView: { yaw: -26, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.45, -1.25, -0.85], labelOffset: [-18, -6] },
        { id: 'B', label: 'B', pos: [-1.85, -1.25, 1.15], labelOffset: [-18, 12] },
        { id: 'C', label: 'C', pos: [1.45, -1.25, 1.15], labelOffset: [10, 14] },
        { id: 'D', label: 'D', pos: [1.85, -1.25, -0.85], labelOffset: [12, -4] },
        { id: 'O', label: 'O', pos: [0.0, -1.25, 0.15], labelOffset: [-6, 15] },
        { id: 'S', label: 'S', pos: [0.0, 2.3, 0.15], labelOffset: [-10, -12] }
      ],
      segments: [
        { id: 'SA', p1: 'S', p2: 'A', style: 'dashed' },
        { id: 'SB', p1: 'S', p2: 'B', style: 'solid' },
        { id: 'SC', p1: 'S', p2: 'C', style: 'solid' },
        { id: 'SD', p1: 'S', p2: 'D', style: 'solid' },
        { id: 'AB', p1: 'A', p2: 'B', style: 'dashed' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'CD', p1: 'C', p2: 'D', style: 'solid' },
        { id: 'AD', p1: 'A', p2: 'D', style: 'dashed' },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' },
        { id: 'BD', p1: 'B', p2: 'D', style: 'dashed' },
        { id: 'SO', p1: 'S', p2: 'O', style: 'dashed', thick: true }
      ],
      planes: [],
      rightAngles: [{ vertex: 'O', arm1: 'S', arm2: 'C' }]
    })
  },
  {
    id: 'base_prism',
    name: "Lăng trụ đứng ABC.A'B'C'",
    defaultView: { yaw: -24, pitch: 18 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.5, -1.35, -0.6], labelOffset: [-18, 2] },
        { id: 'B', label: 'B', pos: [0.1, -1.35, 1.25], labelOffset: [-6, 16] },
        { id: 'C', label: 'C', pos: [1.65, -1.35, -0.45], labelOffset: [10, 4] },
        { id: 'A1', label: "A'", pos: [-1.5, 1.45, -0.6], labelOffset: [-20, -8] },
        { id: 'B1', label: "B'", pos: [0.1, 1.45, 1.25], labelOffset: [-6, -12] },
        { id: 'C1', label: "C'", pos: [1.65, 1.45, -0.45], labelOffset: [10, -8] }
      ],
      segments: [
        { id: 'AB', p1: 'A', p2: 'B', style: 'solid' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'AC', p1: 'A', p2: 'C', style: 'dashed' },
        { id: 'A1B1', p1: 'A1', p2: 'B1', style: 'solid' },
        { id: 'B1C1', p1: 'B1', p2: 'C1', style: 'solid' },
        { id: 'A1C1', p1: 'A1', p2: 'C1', style: 'solid' },
        { id: 'AA1', p1: 'A', p2: 'A1', style: 'solid' },
        { id: 'BB1', p1: 'B', p2: 'B1', style: 'solid' },
        { id: 'CC1', p1: 'C', p2: 'C1', style: 'solid' }
      ],
      planes: [],
      rightAngles: []
    })
  },
  {
    id: 'base_cube',
    name: "Hình hộp ABCD.A'B'C'D'",
    defaultView: { yaw: -30, pitch: 20 },
    buildScene: () => ({
      points: [
        { id: 'A', label: 'A', pos: [-1.35, -1.25, -1.15], labelOffset: [-16, -6] },
        { id: 'B', label: 'B', pos: [-1.35, -1.25, 1.15], labelOffset: [-18, 10] },
        { id: 'C', label: 'C', pos: [1.35, -1.25, 1.15], labelOffset: [10, 12] },
        { id: 'D', label: 'D', pos: [1.35, -1.25, -1.15], labelOffset: [12, -4] },
        { id: 'A1', label: "A'", pos: [-1.35, 1.25, -1.15], labelOffset: [-18, -10] },
        { id: 'B1', label: "B'", pos: [-1.35, 1.25, 1.15], labelOffset: [-20, -4] },
        { id: 'C1', label: "C'", pos: [1.35, 1.25, 1.15], labelOffset: [10, -4] },
        { id: 'D1', label: "D'", pos: [1.35, 1.25, -1.15], labelOffset: [12, -10] }
      ],
      segments: [
        { id: 'AB', p1: 'A', p2: 'B', style: 'dashed' },
        { id: 'BC', p1: 'B', p2: 'C', style: 'solid' },
        { id: 'CD', p1: 'C', p2: 'D', style: 'solid' },
        { id: 'DA', p1: 'D', p2: 'A', style: 'dashed' },
        { id: 'A1B1', p1: 'A1', p2: 'B1', style: 'solid' },
        { id: 'B1C1', p1: 'B1', p2: 'C1', style: 'solid' },
        { id: 'C1D1', p1: 'C1', p2: 'D1', style: 'solid' },
        { id: 'D1A1', p1: 'D1', p2: 'A1', style: 'solid' },
        { id: 'AA1', p1: 'A', p2: 'A1', style: 'dashed' },
        { id: 'BB1', p1: 'B', p2: 'B1', style: 'solid' },
        { id: 'CC1', p1: 'C', p2: 'C1', style: 'solid' },
        { id: 'DD1', p1: 'D', p2: 'D1', style: 'solid' }
      ],
      planes: [],
      rightAngles: []
    })
  },
  {
    id: 'base_empty_oxyz',
    name: 'Hệ trục Oxyz trống',
    defaultView: { yaw: -32, pitch: 20 },
    buildScene: () => ({
      points: [
        { id: 'O', label: 'O', pos: [-1.2, -1.1, -0.8], labelOffset: [-16, -4] },
        { id: 'X', label: 'x', pos: [-1.2, -1.1, 1.9], labelOffset: [-14, 12] },
        { id: 'Y', label: 'y', pos: [2.1, -1.1, -0.8], labelOffset: [10, 4] },
        { id: 'Z', label: 'z', pos: [-1.2, 2.1, -0.8], labelOffset: [-14, -8] }
      ],
      segments: [
        { id: 'OX', p1: 'O', p2: 'X', style: 'solid', thick: true },
        { id: 'OY', p1: 'O', p2: 'Y', style: 'solid', thick: true },
        { id: 'OZ', p1: 'O', p2: 'Z', style: 'solid', thick: true }
      ],
      planes: [],
      rightAngles: []
    })
  }
];

/* ============================================================================
   COMPONENT RENDER HÌNH THU NHỎ 3D THẬT CHO THẺ THƯ VIỆN MẪU
   ============================================================================ */
function TemplateMiniPreview({ tpl }) {
  const previewData = useMemo(() => {
    const built = tpl.buildScene();
    const map = {};
    built.points.forEach((pt) => {
      if (pt.pos) map[pt.id] = { ...pt, coords: [...pt.pos] };
    });
    for (let pass = 0; pass < 3; pass++) {
      built.points.forEach((pt) => {
        if (pt.parentEdge && map[pt.parentEdge[0]] && map[pt.parentEdge[1]]) {
          const c1 = map[pt.parentEdge[0]].coords;
          const c2 = map[pt.parentEdge[1]].coords;
          const t = pt.ratio ?? 0.5;
          map[pt.id] = {
            ...pt,
            coords: [
              c1[0] + (c2[0] - c1[0]) * t,
              c1[1] + (c2[1] - c1[1]) * t,
              c1[2] + (c2[2] - c1[2]) * t
            ]
          };
        }
      });
    }
    const yawRad = ((tpl.defaultView?.yaw ?? -28) * Math.PI) / 180;
    const pitchRad = ((tpl.defaultView?.pitch ?? 18) * Math.PI) / 180;
    const cosY = Math.cos(yawRad),
      sinY = Math.sin(yawRad);
    const cosP = Math.cos(pitchRad),
      sinP = Math.sin(pitchRad);
    const proj = {};
    Object.values(map).forEach((pt) => {
      const [x, y, z] = pt.coords;
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosP - z1 * sinP;
      proj[pt.id] = {
        sx: 60 + x1 * 17,
        sy: 44 - y2 * 17
      };
    });
    return { built, proj };
  }, [tpl]);

  const { built, proj } = previewData;

  return (
    <svg viewBox="0 0 120 84" className="w-24 h-16 overflow-visible">
      {built.planes?.map((pl) => {
        const pts = pl.points.map((id) => proj[id]).filter(Boolean);
        if (pts.length < 3) return null;
        return (
          <polygon
            key={pl.id}
            points={pts.map((p) => `${p.sx},${p.sy}`).join(' ')}
            fill={pl.fill || 'rgba(13, 148, 136, 0.2)'}
            stroke={pl.stroke || '#0d9488'}
            strokeWidth="0.8"
          />
        );
      })}
      {built.specialCircles?.map((sc, i) => {
        const c = proj[sc.center];
        if (!c) return null;
        const r = sc.radius * 17;
        return (
          <g key={i}>
            {sc.type === 'sphere' && (
              <circle
                cx={c.sx}
                cy={c.sy}
                r={r}
                fill="rgba(14, 165, 233, 0.08)"
                stroke="#334155"
                strokeWidth="1.1"
              />
            )}
            <ellipse
              cx={c.sx}
              cy={c.sy}
              rx={r}
              ry={r * 0.32}
              fill="rgba(13, 148, 136, 0.14)"
              stroke="#0f766e"
              strokeWidth="1"
              strokeDasharray="2.5 2"
            />
          </g>
        );
      })}
      {built.segments?.map((seg) => {
        const p1 = proj[seg.p1];
        const p2 = proj[seg.p2];
        if (!p1 || !p2) return null;
        return (
          <line
            key={seg.id}
            x1={p1.sx}
            y1={p1.sy}
            x2={p2.sx}
            y2={p2.sy}
            stroke={seg.thick ? '#0f766e' : '#1e293b'}
            strokeWidth={seg.thick ? 1.5 : 1.1}
            strokeDasharray={seg.style === 'dashed' ? '2.5 2' : undefined}
          />
        );
      })}
    </svg>
  );
}

export default function SpatialGeometryStudio({
  onSelectModule,
  onSelectDerivativeSubTab,
  onSelectCalculusSubTab,
  onOpenCasioModal,
  onOpenAR
}) {
  const [leftTab, setLeftTab] = useState('library'); // 'library' | 'custom'
  const [gradeFilter, setGradeFilter] = useState('all'); // 'all' | 'Lớp 11' | 'Lớp 12'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('pyramid_intersection_section');
  const [figureTitle, setFigureTitle] = useState(GEOMETRY_TEMPLATES[0].title);

  // Scene state (points, segments, planes, rightAngles)
  const [scene, setScene] = useState(() => GEOMETRY_TEMPLATES[0].buildScene());
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Camera & View state
  const [viewAngles, setViewAngles] = useState(GEOMETRY_TEMPLATES[0].defaultView);
  const [zoom, setZoom] = useState(100);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showStepsPanel, setShowStepsPanel] = useState(true);
  const [showHiddenDashed, setShowHiddenDashed] = useState(true);
  const [showPlaneShading, setShowPlaneShading] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  // Active construction tool
  // 'select' | 'rotate' | 'point' | 'midpoint' | 'segment' | 'intersect' | 'plane' | 'perp'
  const [activeTool, setActiveTool] = useState('select');
  const [selectedObject, setSelectedObject] = useState({ type: 'point', id: 'M' });
  const [pendingPoints, setPendingPoints] = useState([]);
  const [pendingSegments, setPendingSegments] = useState([]);
  const [aiExportOpen, setAiExportOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Custom self-construction form state ("Tự dựng")
  const [customPointMode, setCustomPointMode] = useState('edge'); // 'edge' | 'coords'
  const [customPtLabel, setCustomPtLabel] = useState('E');
  const [customEdgeId, setCustomEdgeId] = useState('SA');
  const [customEdgeRatio, setCustomEdgeRatio] = useState(0.5);
  const [customCoords, setCustomCoords] = useState({ x: 0, y: 1.5, z: 0 });
  const [customSegP1, setCustomSegP1] = useState('S');
  const [customSegP2, setCustomSegP2] = useState('C');
  const [customSegStyle, setCustomSegStyle] = useState('solid');
  const [customPlanePoints, setCustomPlanePoints] = useState([]);

  const svgRef = useRef(null);
  const canvasSectionRef = useRef(null);
  const dragRef = useRef({
    active: false,
    mode: null,
    startX: 0,
    startY: 0,
    startYaw: 0,
    startPitch: 0,
    pointId: null,
    initialScene: null
  });

  const currentTemplate = useMemo(
    () => GEOMETRY_TEMPLATES.find((t) => t.id === selectedTemplateId) || GEOMETRY_TEMPLATES[0],
    [selectedTemplateId]
  );

  const pushHistory = (nextScene) => {
    setHistory((prev) => [...prev.slice(-18), scene]);
    setRedoStack([]);
    setScene(nextScene);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [scene, ...r]);
    setHistory((h) => h.slice(0, -1));
    setScene(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((h) => [...h, scene]);
    setRedoStack((r) => r.slice(1));
    setScene(next);
  };

  const scrollCanvasIntoViewOnCompact = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && canvasSectionRef.current) {
      canvasSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLoadTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setFigureTitle(tpl.title);
    setViewAngles(tpl.defaultView);
    setHistory([]);
    setRedoStack([]);
    const built = tpl.buildScene();
    setScene(built);
    const firstSlidable = built.points.find((p) => p.parentEdge);
    setSelectedObject(
      firstSlidable
        ? { type: 'point', id: firstSlidable.id }
        : { type: 'point', id: built.points[0]?.id }
    );
    setPendingPoints([]);
    setPendingSegments([]);
    scrollCanvasIntoViewOnCompact();
  };

  const handleLoadBaseShape = (base) => {
    setSelectedTemplateId(base.id);
    setFigureTitle(`Tự dựng: ${base.name}`);
    setViewAngles(base.defaultView);
    setHistory([]);
    setRedoStack([]);
    const built = base.buildScene();
    setScene(built);
    setSelectedObject({ type: 'point', id: built.points[0]?.id });
    setPendingPoints([]);
    setPendingSegments([]);
    setCustomPlanePoints([]);
    if (built.segments[0]) setCustomEdgeId(built.segments[0].id);
    if (built.points[0]) setCustomSegP1(built.points[0].id);
    if (built.points[1]) setCustomSegP2(built.points[1].id);
    scrollCanvasIntoViewOnCompact();
  };

  // Resolve 3D coordinates of all points (including edge-dependent points M, N, P...)
  const resolvedPointsMap = useMemo(() => {
    const map = {};
    scene.points.forEach((pt) => {
      if (pt.pos) {
        map[pt.id] = { ...pt, coords: [...pt.pos] };
      }
    });
    for (let pass = 0; pass < 4; pass++) {
      scene.points.forEach((pt) => {
        if (pt.parentEdge && map[pt.parentEdge[0]] && map[pt.parentEdge[1]]) {
          const c1 = map[pt.parentEdge[0]].coords;
          const c2 = map[pt.parentEdge[1]].coords;
          const t = pt.ratio ?? 0.5;
          map[pt.id] = {
            ...pt,
            coords: [
              c1[0] + (c2[0] - c1[0]) * t,
              c1[1] + (c2[1] - c1[1]) * t,
              c1[2] + (c2[2] - c1[2]) * t
            ]
          };
        }
      });
    }
    return map;
  }, [scene]);

  // Project 3D [x, y, z] -> 2D SVG [sx, sy, depth]
  const projectedMap = useMemo(() => {
    const yawRad = (viewAngles.yaw * Math.PI) / 180;
    const pitchRad = (viewAngles.pitch * Math.PI) / 180;
    const cosY = Math.cos(yawRad),
      sinY = Math.sin(yawRad);
    const cosP = Math.cos(pitchRad),
      sinP = Math.sin(pitchRad);

    const scaleFactor = 132 * (zoom / 100);
    const centerX = 520;
    const centerY = 345;

    const out = {};
    Object.values(resolvedPointsMap).forEach((pt) => {
      const [x, y, z] = pt.coords;
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;

      out[pt.id] = {
        ...pt,
        sx: centerX + x1 * scaleFactor,
        sy: centerY - y2 * scaleFactor,
        depth: z2
      };
    });
    return out;
  }, [resolvedPointsMap, viewAngles, zoom]);

  // Helper to generate next unused textbook point label
  const getNextPointLabel = (preferredList = ['M', 'N', 'P', 'Q', 'E', 'F', 'G', 'H', 'K', 'I', 'J', 'L']) => {
    const used = new Set(scene.points.map((p) => p.label));
    return preferredList.find((l) => !used.has(l)) || `P${scene.points.length + 1}`;
  };

  // Filtered library templates
  const filteredTemplates = useMemo(() => {
    return GEOMETRY_TEMPLATES.filter((t) => {
      if (gradeFilter !== 'all' && t.grade !== gradeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return `${t.title} ${t.category} ${t.desc}`.toLowerCase().includes(q);
      }
      return true;
    });
  }, [gradeFilter, searchQuery]);

  // Grouped templates by category
  const groupedTemplates = useMemo(() => {
    const groups = {};
    filteredTemplates.forEach((t) => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTemplates]);

  // Pointer handlers for 3D rotation, dragging point along edge, or dragging point label
  const handleSvgPointerDown = (e) => {
    if (e.target.closest('[data-interactive="true"]')) return;
    dragRef.current = {
      active: true,
      mode: 'rotate',
      startX: e.clientX,
      startY: e.clientY,
      startYaw: viewAngles.yaw,
      startPitch: viewAngles.pitch
    };
  };

  const handleSvgPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (dragRef.current.mode === 'rotate') {
      setViewAngles({
        yaw: Math.round(dragRef.current.startYaw + dx * 0.45),
        pitch: Math.max(-70, Math.min(70, Math.round(dragRef.current.startPitch + dy * 0.35)))
      });
    } else if (dragRef.current.mode === 'point' && dragRef.current.pointId) {
      const pt = resolvedPointsMap[dragRef.current.pointId];
      if (!pt) return;
      if (pt.parentEdge) {
        const p1 = projectedMap[pt.parentEdge[0]];
        const p2 = projectedMap[pt.parentEdge[1]];
        if (p1 && p2 && svgRef.current) {
          const vx = p2.sx - p1.sx;
          const vy = p2.sy - p1.sy;
          const lenSq = vx * vx + vy * vy || 1;
          const svgRect = svgRef.current.getBoundingClientRect();
          const mx = ((e.clientX - svgRect.left) / svgRect.width) * 1040;
          const my = ((e.clientY - svgRect.top) / svgRect.height) * 680;
          const t = Math.max(0.06, Math.min(0.94, ((mx - p1.sx) * vx + (my - p1.sy) * vy) / lenSq));
          setScene((prev) => ({
            ...prev,
            points: prev.points.map((p) =>
              p.id === pt.id ? { ...p, ratio: Number(t.toFixed(2)) } : p
            )
          }));
        }
      }
    } else if (dragRef.current.mode === 'label' && dragRef.current.pointId) {
      const [ox0, oy0] = dragRef.current.startOffset || [-14, -8];
      setScene((prev) => ({
        ...prev,
        points: prev.points.map((p) =>
          p.id === dragRef.current.pointId
            ? { ...p, labelOffset: [Math.round(ox0 + dx * 0.85), Math.round(oy0 + dy * 0.85)] }
            : p
        )
      }));
    }
  };

  const handleSvgPointerUp = () => {
    if (dragRef.current.active && dragRef.current.initialScene) {
      setHistory((prev) => [...prev.slice(-18), dragRef.current.initialScene]);
    }
    dragRef.current.active = false;
    dragRef.current.initialScene = null;
  };

  // Click on a point when using construction tools
  const handlePointClick = (ptId, e) => {
    e.stopPropagation();
    setSelectedObject({ type: 'point', id: ptId });

    if (activeTool === 'select') {
      dragRef.current = {
        active: true,
        mode: 'point',
        pointId: ptId,
        startX: e.clientX,
        startY: e.clientY,
        initialScene: scene
      };
      return;
    }

    if (activeTool === 'segment') {
      if (pendingPoints.length === 0) {
        setPendingPoints([ptId]);
      } else if (pendingPoints[0] !== ptId) {
        const p1 = pendingPoints[0];
        const exists = scene.segments.some(
          (s) => (s.p1 === p1 && s.p2 === ptId) || (s.p1 === ptId && s.p2 === p1)
        );
        if (!exists) {
          const newSegId = `${p1}${ptId}_${Date.now().toString().slice(-3)}`;
          pushHistory({
            ...scene,
            segments: [
              ...scene.segments,
              { id: newSegId, p1, p2: ptId, style: 'solid', thick: true }
            ]
          });
          setSelectedObject({ type: 'segment', id: newSegId });
        }
        setPendingPoints([]);
      }
    } else if (activeTool === 'plane') {
      if (!pendingPoints.includes(ptId)) {
        setPendingPoints([...pendingPoints, ptId]);
      }
    } else if (activeTool === 'perp') {
      // Step 1 of perp: choose source point
      setPendingPoints([ptId]);
    }
  };

  // Dragging point text label to avoid line overlap
  const handleLabelMouseDown = (pt, e) => {
    e.stopPropagation();
    setSelectedObject({ type: 'point', id: pt.id });
    dragRef.current = {
      active: true,
      mode: 'label',
      pointId: pt.id,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: pt.labelOffset || [-14, -8],
      initialScene: scene
    };
  };

  // Click on a segment (add midpoint, point on edge, perpendicular foot, intersect two lines, or select segment)
  const handleSegmentClick = (seg, e) => {
    e.stopPropagation();

    if (activeTool === 'midpoint' || activeTool === 'point') {
      let ratio = 0.5;
      if (activeTool === 'point' && svgRef.current) {
        const p1 = projectedMap[seg.p1];
        const p2 = projectedMap[seg.p2];
        if (p1 && p2) {
          const svgRect = svgRef.current.getBoundingClientRect();
          const mx = ((e.clientX - svgRect.left) / svgRect.width) * 1040;
          const my = ((e.clientY - svgRect.top) / svgRect.height) * 680;
          const vx = p2.sx - p1.sx;
          const vy = p2.sy - p1.sy;
          const lenSq = vx * vx + vy * vy || 1;
          ratio = Number(
            Math.max(0.12, Math.min(0.88, ((mx - p1.sx) * vx + (my - p1.sy) * vy) / lenSq)).toFixed(2)
          );
        }
      }
      const newLabel = getNextPointLabel(['M', 'N', 'P', 'Q', 'E', 'F', 'G', 'K']);
      const newPt = {
        id: `${newLabel}_${Date.now().toString().slice(-3)}`,
        label: newLabel,
        parentEdge: [seg.p1, seg.p2],
        ratio,
        labelOffset: [-16, -8]
      };
      pushHistory({
        ...scene,
        points: [...scene.points, newPt]
      });
      setSelectedObject({ type: 'point', id: newPt.id });
      return;
    }

    if (activeTool === 'perp') {
      const fromPtId =
        pendingPoints[0] || (selectedObject?.type === 'point' ? selectedObject.id : null);
      if (fromPtId && fromPtId !== seg.p1 && fromPtId !== seg.p2) {
        const A = resolvedPointsMap[fromPtId]?.coords;
        const P1 = resolvedPointsMap[seg.p1]?.coords;
        const P2 = resolvedPointsMap[seg.p2]?.coords;
        let ratio = 0.48;
        if (A && P1 && P2) {
          const ux = P2[0] - P1[0],
            uy = P2[1] - P1[1],
            uz = P2[2] - P1[2];
          const lenSq = ux * ux + uy * uy + uz * uz || 1;
          const dot = (A[0] - P1[0]) * ux + (A[1] - P1[1]) * uy + (A[2] - P1[2]) * uz;
          ratio = Number(Math.max(0.18, Math.min(0.82, dot / lenSq)).toFixed(2));
        }
        const newLabel = getNextPointLabel(['H', 'K', 'E', 'F']);
        const newId = `${newLabel}_${Date.now().toString().slice(-3)}`;
        const newPt = {
          id: newId,
          label: newLabel,
          parentEdge: [seg.p1, seg.p2],
          ratio,
          labelOffset: [-16, -6]
        };
        pushHistory({
          ...scene,
          points: [...scene.points, newPt],
          segments: [
            ...scene.segments,
            { id: `${fromPtId}${newId}`, p1: fromPtId, p2: newId, style: 'dashed', thick: true }
          ],
          rightAngles: [
            ...(scene.rightAngles || []),
            { vertex: newId, arm1: fromPtId, arm2: seg.p1 }
          ]
        });
        setSelectedObject({ type: 'point', id: newId });
        setPendingPoints([]);
        return;
      }
    }

    if (activeTool === 'intersect') {
      if (pendingSegments.length === 0) {
        setPendingSegments([seg.id]);
        setSelectedObject({ type: 'segment', id: seg.id });
        return;
      }
      if (pendingSegments[0] !== seg.id) {
        const seg1 = scene.segments.find((s) => s.id === pendingSegments[0]);
        const seg2 = seg;
        if (seg1 && seg2) {
          const A = projectedMap[seg1.p1],
            B = projectedMap[seg1.p2];
          const C = projectedMap[seg2.p1],
            D = projectedMap[seg2.p2];
          const A3 = resolvedPointsMap[seg1.p1]?.coords,
            B3 = resolvedPointsMap[seg1.p2]?.coords;
          if (A && B && C && D && A3 && B3) {
            const x1 = A.sx,
              y1 = A.sy,
              x2 = B.sx,
              y2 = B.sy;
            const x3 = C.sx,
              y3 = C.sy,
              x4 = D.sx,
              y4 = D.sy;
            const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (Math.abs(denom) > 1e-3) {
              const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
              const clampedT = Math.max(-1.6, Math.min(2.6, t));
              const newPos = [
                Number((A3[0] + (B3[0] - A3[0]) * clampedT).toFixed(2)),
                Number((A3[1] + (B3[1] - A3[1]) * clampedT).toFixed(2)),
                Number((A3[2] + (B3[2] - A3[2]) * clampedT).toFixed(2))
              ];
              const newLabel = getNextPointLabel(['I', 'J', 'E', 'F', 'K']);
              const newId = `${newLabel}_${Date.now().toString().slice(-3)}`;
              const newPt = {
                id: newId,
                label: newLabel,
                pos: newPos,
                labelOffset: [-16, 10]
              };
              pushHistory({
                ...scene,
                points: [...scene.points, newPt],
                segments: [
                  ...scene.segments,
                  { id: `${seg1.p2}${newId}`, p1: seg1.p2, p2: newId, style: 'solid' },
                  { id: `${seg2.p2}${newId}`, p1: seg2.p2, p2: newId, style: 'solid' }
                ]
              });
              setSelectedObject({ type: 'point', id: newId });
            }
          }
        }
        setPendingSegments([]);
        return;
      }
    }

    setSelectedObject({ type: 'segment', id: seg.id });
  };

  // Finish building a polygon plane from pendingPoints
  const handleCompletePlane = () => {
    if (pendingPoints.length < 3) return;
    const newPlane = {
      id: `plane_${Date.now().toString().slice(-3)}`,
      points: [...pendingPoints],
      fill: 'rgba(15, 118, 110, 0.16)',
      stroke: '#0f766e',
      planeFrame: false
    };
    const addedSegs = [];
    for (let i = 0; i < pendingPoints.length; i++) {
      const a = pendingPoints[i];
      const b = pendingPoints[(i + 1) % pendingPoints.length];
      const exists = scene.segments.some(
        (s) => (s.p1 === a && s.p2 === b) || (s.p1 === b && s.p2 === a)
      );
      if (!exists) {
        addedSegs.push({
          id: `seg_${a}_${b}_${i}`,
          p1: a,
          p2: b,
          style: 'solid',
          thick: true
        });
      }
    }
    pushHistory({
      ...scene,
      segments: [...scene.segments, ...addedSegs],
      planes: [...scene.planes, newPlane]
    });
    setPendingPoints([]);
    setActiveTool('select');
  };

  // Contextual quick action: Drop altitude from selected point to base (y = min_y)
  const handleAddAltitudeFromPoint = (ptId) => {
    const pt = resolvedPointsMap[ptId];
    if (!pt) return;
    const minY = Math.min(...Object.values(resolvedPointsMap).map((p) => p.coords[1]));
    const newLabel = getNextPointLabel(['H', 'O', 'K', 'E']);
    const newId = `${newLabel}_${Date.now().toString().slice(-3)}`;
    const footPos = [
      Number(pt.coords[0].toFixed(2)),
      Number(minY.toFixed(2)),
      Number(pt.coords[2].toFixed(2))
    ];
    const refPt = scene.points.find((p) => p.id !== ptId)?.id || ptId;
    pushHistory({
      ...scene,
      points: [...scene.points, { id: newId, label: newLabel, pos: footPos, labelOffset: [-16, 12] }],
      segments: [
        ...scene.segments,
        { id: `${ptId}${newId}`, p1: ptId, p2: newId, style: 'dashed', thick: true }
      ],
      rightAngles: [...(scene.rightAngles || []), { vertex: newId, arm1: ptId, arm2: refPt }]
    });
    setSelectedObject({ type: 'point', id: newId });
  };

  // Delete currently selected point or segment
  const handleDeleteSelected = () => {
    if (!selectedObject) return;
    if (selectedObject.type === 'segment') {
      pushHistory({
        ...scene,
        segments: scene.segments.filter((s) => s.id !== selectedObject.id)
      });
      setSelectedObject(null);
    } else if (selectedObject.type === 'point') {
      const pid = selectedObject.id;
      pushHistory({
        ...scene,
        points: scene.points.filter((p) => p.id !== pid),
        segments: scene.segments.filter((s) => s.p1 !== pid && s.p2 !== pid),
        planes: scene.planes.filter((pl) => !pl.points.includes(pid))
      });
      setSelectedObject(null);
    }
  };

  // Toggle selected segment style (solid <-> dashed)
  const handleToggleSegmentStyle = (segId) => {
    pushHistory({
      ...scene,
      segments: scene.segments.map((s) =>
        s.id === segId ? { ...s, style: s.style === 'dashed' ? 'solid' : 'dashed' } : s
      )
    });
  };

  // Toggle extending a segment into a line d
  const handleToggleSegmentExtend = (segId) => {
    pushHistory({
      ...scene,
      segments: scene.segments.map((s) =>
        s.id === segId
          ? {
              ...s,
              extend: s.extend && (s.extend[0] > 0 || s.extend[1] > 0) ? [0, 0] : [0.25, 0.35],
              lineLabel: s.lineLabel ? undefined : 'd'
            }
          : s
      )
    });
  };

  // Export SVG to high-res PNG image download
  const handleExportPNG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1255;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = `${figureTitle.replace(/\s+/g, '_')}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  };

  // Generate AI & TikZ Specification Text
  const aiSpecText = useMemo(() => {
    const ptLines = Object.values(resolvedPointsMap)
      .filter((p) => p.label)
      .map((p) => {
        const [x, y, z] = p.coords.map((v) => v.toFixed(2));
        return p.parentEdge
          ? `- Điểm ${p.label}: thuộc cạnh ${p.parentEdge[0]}${p.parentEdge[1]} (tỉ lệ k = ${p.ratio})`
          : `- Đỉnh ${p.label}: tọa độ 3D (${x}; ${y}; ${z})`;
      })
      .join('\n');

    const segLines = scene.segments
      .map(
        (s) =>
          `- Đoạn/Đường ${s.p1}${s.p2}: ${
            s.style === 'dashed' ? 'nét đứt (cạnh khuất)' : 'nét liền (nhìn thấy)'
          }`
      )
      .join('\n');

    const tikzCoords = Object.values(projectedMap)
      .filter((p) => p.label)
      .map(
        (p) =>
          `  \\coordinate (${p.id}) at (${((p.sx - 520) / 80).toFixed(2)}, ${((345 - p.sy) / 80).toFixed(2)});`
      )
      .join('\n');

    const tikzSegments = scene.segments
      .map((s) => `  \\draw[${s.style === 'dashed' ? 'dashed' : 'thick'}] (${s.p1}) -- (${s.p2});`)
      .join('\n');

    return `=== HỒ SƠ HÌNH HỌC KHÔNG GIAN (DÀNH CHO AI & LATEX TIKZ) ===
Tên bản vẽ: ${figureTitle}
Góc nhìn 3D: Yaw = ${viewAngles.yaw}°, Pitch = ${viewAngles.pitch}°

1. Danh sách Điểm & Quan hệ thuộc cạnh:
${ptLines}

2. Danh sách Cạnh (Nét liền / Nét đứt chuẩn SGK):
${segLines}

3. Mã nguồn LaTeX TikZ 2D tương ứng:
\\begin{tikzpicture}[scale=1.0, line join=round, line cap=round]
${tikzCoords}
${tikzSegments}
\\end{tikzpicture}`;
  }, [resolvedPointsMap, projectedMap, scene, figureTitle, viewAngles]);

  const selectedPointObj =
    selectedObject?.type === 'point' ? scene.points.find((p) => p.id === selectedObject.id) : null;
  const selectedSegmentObj =
    selectedObject?.type === 'segment' ? scene.segments.find((s) => s.id === selectedObject.id) : null;

  // Compute 3D length of selected segment
  const selectedSegmentLength = useMemo(() => {
    if (!selectedSegmentObj) return null;
    const c1 = resolvedPointsMap[selectedSegmentObj.p1]?.coords;
    const c2 = resolvedPointsMap[selectedSegmentObj.p2]?.coords;
    if (!c1 || !c2) return null;
    return Math.hypot(c2[0] - c1[0], c2[1] - c1[1], c2[2] - c1[2]).toFixed(2);
  }, [selectedSegmentObj, resolvedPointsMap]);

  const totalObjectsCount =
    scene.points.length + scene.segments.length + scene.planes.length + (scene.rightAngles?.length || 0);

  return (
    <div
      className={`bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col ${
        isFullscreen
          ? 'fixed top-14 md:top-0 bottom-0 left-0 md:left-64 right-0 z-30 overflow-y-auto rounded-none'
          : 'rounded-3xl'
      }`}
    >
      {/* 1. TOP DARK TEAL STUDIO HEADER */}
      <div className="px-5 py-3.5 bg-[#0d3b3e] text-white flex flex-wrap items-center justify-between gap-3 border-b border-teal-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600/40 border border-teal-400/40 flex items-center justify-center text-teal-200 shadow-sm shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="1.8">
              <polygon points="12 2 3 19 12 22 21 19 12 2" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="3" y1="19" x2="21" y2="19" strokeDasharray="2 2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                Vẽ hình học không gian
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-teal-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Xưởng vẽ Hình học THPT (Lớp 11 & 12)
              </span>
            </div>
            <p className="text-[11px] text-teal-200/80">
              12 hình mẫu SGK • Dựng thiết diện, tìm giao điểm 2 đường, hạ vuông góc, trượt điểm động & xuất TikZ/PNG
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setAiExportOpen(!aiExportOpen);
              setGuideOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              aiExportOpen
                ? 'bg-teal-400 text-slate-950'
                : 'bg-white/10 hover:bg-white/20 text-teal-100 border border-white/15'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tệp cho AI & TikZ</span>
          </button>

          <button
            onClick={() => {
              setGuideOpen(!guideOpen);
              setAiExportOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              guideOpen
                ? 'bg-teal-400 text-slate-950'
                : 'bg-white/10 hover:bg-white/20 text-teal-100 border border-white/15'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hướng dẫn</span>
          </button>

          <button
            onClick={handleExportPNG}
            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất ảnh PNG</span>
          </button>
        </div>
      </div>

      {/* Collapsible Inline Panels for "Tệp cho AI & TikZ" or "Hướng dẫn" */}
      {aiExportOpen && (
        <div className="p-4 bg-slate-900 text-slate-100 border-b border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-teal-300 uppercase tracking-wider">
              Mô tả cấu trúc hình học 3D cho AI & Mã nguồn LaTeX TikZ
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiSpecText);
                  setCopiedAi(true);
                  setTimeout(() => setCopiedAi(false), 1800);
                }}
                className="px-3 py-1 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedAi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAi ? 'Đã sao chép' : 'Sao chép toàn bộ'}</span>
              </button>
              <button
                onClick={() => setAiExportOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-white/10 text-xs hover:bg-white/20 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
          <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto max-h-48 text-teal-100">
            {aiSpecText}
          </pre>
        </div>
      )}

      {guideOpen && (
        <div className="p-4 bg-teal-50/90 border-b border-teal-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="font-extrabold text-teal-950">
              Hướng dẫn sử dụng đầy đủ các công cụ Xưởng Vẽ Không Gian:
            </div>
            <p>
              • <strong>Xoay 3D & Kéo tên điểm (CH / XO):</strong> Kéo trên nền trắng để xoay góc nhìn 3D; kéo trực tiếp vào chữ tên điểm (A, B, M...) để tránh chữ đè lên cạnh.
            </p>
            <p>
              • <strong>Trượt điểm động (M, N, K...):</strong> Chọn điểm thuộc cạnh rồi kéo trực tiếp trên cạnh hoặc kéo thanh trượt <em>Tỉ lệ k</em> ở đáy để quan sát thiết diện thay đổi.
            </p>
            <p>
              • <strong>Bộ 6 phép dựng hình:</strong> Lấy <em>Trung điểm (TĐ)</em>, <em>Điểm trên cạnh (ĐI)</em>, <em>Nối đoạn thẳng (ĐO)</em>, <em>Giao điểm 2 đường (GĐ)</em>, <em>Tô mặt phẳng (MP)</em> và <em>Hạ đường vuông góc (VG)</em>.
            </p>
          </div>
          <button
            onClick={() => setGuideOpen(false)}
            className="px-3 py-1.5 rounded-xl bg-teal-800 text-white font-bold shrink-0 cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      )}

      {/* 2. MAIN WORKSPACE: LEFT SIDEBAR (THƯ VIỆN MẪU / TỰ DỰNG) + RIGHT CANVAS */}
      <div className="flex flex-col md:flex-row min-h-[80vh] flex-1">
        {/* LEFT COLUMN (Collapsible): THƯ VIỆN MẪU & TỰ DỰNG */}
        {!isSidebarCollapsed && (
          <div className="order-2 md:order-1 w-full md:w-[315px] xl:w-[345px] shrink-0 border-t md:border-t-0 md:border-r border-slate-200 bg-slate-50/60 flex flex-col">
            <div className="grid grid-cols-2 border-b border-slate-200 bg-white">
              <button
                onClick={() => setLeftTab('library')}
                className={`py-3 text-xs font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  leftTab === 'library'
                    ? 'border-teal-700 text-teal-900 bg-teal-50/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Thư viện mẫu ({GEOMETRY_TEMPLATES.length})</span>
              </button>
              <button
                onClick={() => setLeftTab('custom')}
                className={`py-3 text-xs font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  leftTab === 'custom'
                    ? 'border-teal-700 text-teal-900 bg-teal-50/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Tự dựng ({totalObjectsCount})</span>
              </button>
            </div>

            {leftTab === 'library' ? (
              <div className="p-3.5 space-y-3.5 overflow-y-auto max-h-[76vh]">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    TỪ HÌNH MẪU ĐẾN ĐỀ BÀI
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    Đúng hình. Rõ ý.
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Chọn một hình mẫu SGK để nạp ngay vào Bản vẽ 3D bên phải, thêm phép dựng và xoay góc nhìn.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm chóp, thiết diện, khoảng cách, nón, cầu..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
                  />
                </div>

                {/* Grade Filter Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Lớp 11', 'Lớp 12'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGradeFilter(g)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        gradeFilter === g
                          ? 'bg-teal-100 text-teal-900 border border-teal-300'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g === 'all' ? `Tất cả (${GEOMETRY_TEMPLATES.length})` : g}
                    </button>
                  ))}
                </div>

                {/* Categorized Template Cards */}
                <div className="space-y-4">
                  {Object.entries(groupedTemplates).map(([catName, items]) => (
                    <div key={catName} className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <span>{catName}</span>
                        <span>{items.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((tpl) => {
                          const isSelected = selectedTemplateId === tpl.id;
                          return (
                            <button
                              key={tpl.id}
                              onClick={() => handleLoadTemplate(tpl)}
                              className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-teal-50/90 border-teal-600 shadow-sm ring-1 ring-teal-600'
                                  : 'bg-white border-slate-200 hover:border-teal-500 hover:bg-slate-50/60'
                              }`}
                            >
                              <div className="w-full h-20 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-1.5 overflow-hidden">
                                <TemplateMiniPreview tpl={tpl} />
                              </div>
                              <div>
                                <div className="text-[11px] font-extrabold text-slate-800 line-clamp-2 leading-snug">
                                  {tpl.title}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    {tpl.grade}
                                  </span>
                                  {isSelected && (
                                    <span className="text-[9px] font-extrabold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                                      Đang mở
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* TỰ DỰNG (INTERACTIVE CUSTOM 3D BUILDER & OBJECT MANAGER) */
              <div className="p-3.5 space-y-3.5 overflow-y-auto max-h-[76vh] text-xs">
                {/* 1. Khởi tạo khối cơ sở sạch */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="font-extrabold text-slate-800 flex items-center justify-between">
                    <span>1. Chọn Khối Cơ Sở Sạch (Tự dựng):</span>
                    <span className="text-[10px] text-teal-700 font-bold">Mới 100%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CUSTOM_BASE_SHAPES.map((base) => (
                      <button
                        key={base.id}
                        onClick={() => handleLoadBaseShape(base)}
                        className={`px-2.5 py-1.5 rounded-lg border font-bold text-left truncate transition-colors cursor-pointer ${
                          selectedTemplateId === base.id
                            ? 'bg-teal-50 border-teal-600 text-teal-900'
                            : 'bg-slate-50 border-slate-200 hover:bg-teal-50/50 hover:border-teal-400 text-slate-700'
                        }`}
                      >
                        + {base.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Thêm Điểm Mới (Điểm thuộc cạnh hoặc Đỉnh 3D tự do) */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800">2. Thêm Điểm Mới Vào Hình:</span>
                    <div className="flex rounded-lg bg-slate-100 p-0.5 text-[10px] font-bold">
                      <button
                        onClick={() => setCustomPointMode('edge')}
                        className={`px-2 py-0.5 rounded-md cursor-pointer ${
                          customPointMode === 'edge' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        Thuộc cạnh
                      </button>
                      <button
                        onClick={() => setCustomPointMode('coords')}
                        className={`px-2 py-0.5 rounded-md cursor-pointer ${
                          customPointMode === 'coords' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        Tọa độ 3D
                      </button>
                    </div>
                  </div>

                  {customPointMode === 'edge' ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                            Tên điểm
                          </label>
                          <input
                            type="text"
                            maxLength={3}
                            value={customPtLabel}
                            onChange={(e) => setCustomPtLabel(e.target.value)}
                            placeholder={getNextPointLabel()}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                            Thuộc cạnh
                          </label>
                          <select
                            value={customEdgeId}
                            onChange={(e) => setCustomEdgeId(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 bg-white"
                          >
                            {scene.segments.map((s) => (
                              <option key={s.id} value={s.id}>
                                Cạnh {s.p1}{s.p2}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-600 font-semibold">
                          Tỉ lệ k = {customEdgeRatio}:
                        </span>
                        <div className="flex gap-1">
                          {[
                            { label: 'Trung điểm (0.5)', val: 0.5 },
                            { label: 'Trọng tâm (0.67)', val: 0.67 }
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              onClick={() => setCustomEdgeRatio(preset.val)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-teal-50 text-[10px] font-bold text-slate-700 cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.05"
                        value={customEdgeRatio}
                        onChange={(e) => setCustomEdgeRatio(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg accent-teal-600 cursor-pointer"
                      />
                      <button
                        onClick={() => {
                          const seg = scene.segments.find((s) => s.id === customEdgeId) || scene.segments[0];
                          if (!seg) return;
                          const lbl = (customPtLabel || '').trim() || getNextPointLabel();
                          const newId = `${lbl}_${Date.now().toString().slice(-3)}`;
                          pushHistory({
                            ...scene,
                            points: [
                              ...scene.points,
                              {
                                id: newId,
                                label: lbl,
                                parentEdge: [seg.p1, seg.p2],
                                ratio: customEdgeRatio,
                                labelOffset: [-16, -8]
                              }
                            ]
                          });
                          setSelectedObject({ type: 'point', id: newId });
                          setCustomPtLabel(getNextPointLabel());
                          scrollCanvasIntoViewOnCompact();
                        }}
                        className="w-full py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm điểm thuộc cạnh</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-1.5">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                            Tên
                          </label>
                          <input
                            type="text"
                            maxLength={3}
                            value={customPtLabel}
                            onChange={(e) => setCustomPtLabel(e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 font-bold"
                          />
                        </div>
                        {['x', 'y', 'z'].map((axis) => (
                          <div key={axis}>
                            <label className="text-[10px] text-slate-500 font-semibold block mb-0.5 uppercase">
                              {axis}
                            </label>
                            <input
                              type="number"
                              step="0.2"
                              value={customCoords[axis]}
                              onChange={(e) =>
                                setCustomCoords({
                                  ...customCoords,
                                  [axis]: parseFloat(e.target.value) || 0
                                })
                              }
                              className="w-full px-1.5 py-1 rounded-lg border border-slate-200 font-mono"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const lbl = (customPtLabel || '').trim() || getNextPointLabel();
                          const newId = `${lbl}_${Date.now().toString().slice(-3)}`;
                          pushHistory({
                            ...scene,
                            points: [
                              ...scene.points,
                              {
                                id: newId,
                                label: lbl,
                                pos: [customCoords.x, customCoords.y, customCoords.z],
                                labelOffset: [-14, -8]
                              }
                            ]
                          });
                          setSelectedObject({ type: 'point', id: newId });
                          setCustomPtLabel(getNextPointLabel());
                          scrollCanvasIntoViewOnCompact();
                        }}
                        className="w-full py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm đỉnh 3D tự do</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Nối Đoạn Thẳng / Đường Thẳng Mới */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="font-extrabold text-slate-800">3. Nối Đoạn Thẳng / Giao Tuyến:</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <select
                      value={customSegP1}
                      onChange={(e) => setCustomSegP1(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 font-bold bg-white"
                    >
                      {scene.points
                        .filter((p) => p.label)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            Điểm {p.label}
                          </option>
                        ))}
                    </select>
                    <select
                      value={customSegP2}
                      onChange={(e) => setCustomSegP2(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 font-bold bg-white"
                    >
                      {scene.points
                        .filter((p) => p.label)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            Điểm {p.label}
                          </option>
                        ))}
                    </select>
                    <select
                      value={customSegStyle}
                      onChange={(e) => setCustomSegStyle(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 font-bold bg-white"
                    >
                      <option value="solid">Nét liền</option>
                      <option value="dashed">Nét đứt</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (!customSegP1 || !customSegP2 || customSegP1 === customSegP2) return;
                      const segId = `${customSegP1}${customSegP2}_${Date.now().toString().slice(-3)}`;
                      pushHistory({
                        ...scene,
                        segments: [
                          ...scene.segments,
                          {
                            id: segId,
                            p1: customSegP1,
                            p2: customSegP2,
                            style: customSegStyle,
                            thick: true
                          }
                        ]
                      });
                      setSelectedObject({ type: 'segment', id: segId });
                      scrollCanvasIntoViewOnCompact();
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nối đoạn thẳng</span>
                  </button>
                </div>

                {/* 4. Tô Mặt Phẳng / Thiết Diện */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="font-extrabold text-slate-800">
                    4. Tô Mặt Phẳng Thiết Diện (Chọn ≥ 3 đỉnh):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {scene.points
                      .filter((p) => p.label)
                      .map((p) => {
                        const chosen = customPlanePoints.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() =>
                              setCustomPlanePoints((prev) =>
                                prev.includes(p.id)
                                  ? prev.filter((id) => id !== p.id)
                                  : [...prev, p.id]
                              )
                            }
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                              chosen
                                ? 'bg-teal-600 text-white border-teal-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                  </div>
                  <button
                    disabled={customPlanePoints.length < 3}
                    onClick={() => {
                      if (customPlanePoints.length < 3) return;
                      const newEdges = [];
                      for (let i = 0; i < customPlanePoints.length; i++) {
                        const a = customPlanePoints[i];
                        const b = customPlanePoints[(i + 1) % customPlanePoints.length];
                        const exists = scene.segments.some(
                          (s) => (s.p1 === a && s.p2 === b) || (s.p1 === b && s.p2 === a)
                        );
                        if (!exists) {
                          newEdges.push({
                            id: `${a}${b}_${i}`,
                            p1: a,
                            p2: b,
                            style: 'dashed',
                            thick: true
                          });
                        }
                      }
                      pushHistory({
                        ...scene,
                        segments: [...scene.segments, ...newEdges],
                        planes: [
                          ...scene.planes,
                          {
                            id: `plane_${Date.now()}`,
                            points: [...customPlanePoints],
                            fill: 'rgba(13, 148, 136, 0.18)',
                            stroke: '#0d9488'
                          }
                        ]
                      });
                      setCustomPlanePoints([]);
                      scrollCanvasIntoViewOnCompact();
                    }}
                    className="w-full py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-extrabold cursor-pointer"
                  >
                    + Tạo mặt phẳng ({customPlanePoints.length} đỉnh đã chọn)
                  </button>
                </div>

                {/* 5. Danh sách Cạnh & Đổi Nét đứt / Nét liền */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="font-extrabold text-slate-800">
                    5. Quản lý Cạnh ({scene.segments.length}) — Bấm đổi Nét đứt/liền:
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {scene.segments.map((s) => {
                      const p1Lbl = scene.points.find((p) => p.id === s.p1)?.label || s.p1;
                      const p2Lbl = scene.points.find((p) => p.id === s.p2)?.label || s.p2;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedObject({ type: 'segment', id: s.id })}
                          className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                            selectedObject?.id === s.id
                              ? 'bg-teal-50 border border-teal-300'
                              : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold text-slate-700">
                            Cạnh {p1Lbl}{p2Lbl}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSegmentStyle(s.id);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                s.style === 'dashed'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-teal-100 text-teal-900 border border-teal-300'
                              }`}
                            >
                              {s.style === 'dashed' ? '--- Nét đứt' : '─── Nét liền'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                pushHistory({
                                  ...scene,
                                  segments: scene.segments.filter((item) => item.id !== s.id)
                                });
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Xóa cạnh"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RIGHT COLUMN: BẢN VẼ KHÔNG GIAN 3D CỠ LỚN (LUÔN HIỂN THỊ NGAY CẠNH HOẶC TRÊN ĐẦU) */}
        <div
          ref={canvasSectionRef}
          className="order-1 md:order-2 flex-1 min-w-0 bg-slate-50/60 flex flex-col justify-between p-3 sm:p-4"
        >
          {/* Top Bar of Canvas Workspace */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-teal-900 border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Thu gọn hoặc mở rộng cột Thư viện mẫu để phóng to khung vẽ"
              >
                <Grid className="w-3.5 h-3.5 text-teal-700" />
                <span>{isSidebarCollapsed ? 'Hiện Thư Viện Mẫu' : 'Thu Gọn Cột Mẫu'}</span>
              </button>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  BẢN VẼ KHÔNG GIAN CỠ LỚN
                </div>
                <input
                  type="text"
                  value={figureTitle}
                  onChange={(e) => setFigureTitle(e.target.value)}
                  className="text-base sm:text-lg font-extrabold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowStepsPanel(!showStepsPanel)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  showStepsPanel
                    ? 'bg-teal-50 text-teal-900 border-teal-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>Các bước dựng</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isFullscreen
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
              </button>

              <button
                onClick={() => handleLoadTemplate(currentTemplate)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Vẽ mới</span>
              </button>

              <button
                onClick={() => setShowMeasurements(!showMeasurements)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  showMeasurements
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Số đo 3D</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Active Tool Instruction Bar */}
          <div className="mb-2.5 px-3.5 py-2 rounded-xl bg-teal-50/90 border border-teal-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-teal-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>{TOOL_HINTS[activeTool]}</span>
            </div>
            {(pendingPoints.length > 0 || pendingSegments.length > 0) && (
              <span className="px-2.5 py-0.5 rounded-lg bg-teal-700 text-white font-bold">
                Đã chọn:{' '}
                {pendingPoints.length > 0
                  ? pendingPoints.join(' → ')
                  : `Cạnh ${pendingSegments[0]} (chọn cạnh thứ 2)`}
              </span>
            )}
          </div>

          {/* MAIN INTERACTIVE WHITE STEREOMETRY CANVAS CARD (LARGE VIEWPORT) */}
          <div className="relative flex-1 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex items-center justify-center min-h-[650px] lg:min-h-[73vh]">
            {/* Top-Left Status Label & Steps Guide Overlay inside Canvas */}
            <div className="absolute top-4 left-5 z-10 max-w-md space-y-2 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  MÔ HÌNH 3D • HÌNH BIỂU DIỄN CHUẨN SGK
                </span>
              </div>

              {showStepsPanel && currentTemplate.stepsGuide && (
                <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-sm space-y-1 text-[11px] text-slate-700">
                  <div className="font-extrabold text-teal-900">
                    Phương pháp dựng hình & chứng minh:
                  </div>
                  {currentTemplate.stepsGuide.map((step, i) => (
                    <div key={i} className="leading-snug">
                      {step}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FLOATING TOP-RIGHT CONSTRUCTION TOOLBAR (8 CÔNG CỤ ĐẦY ĐỦ) */}
            <div className="absolute top-3.5 right-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-md px-2 py-1.5 flex flex-wrap items-center gap-1">
              {[
                { id: 'select', code: 'CH', label: 'Chọn & Kéo điểm / chữ', icon: MousePointer },
                { id: 'rotate', code: 'XO', label: 'Xoay góc nhìn 3D', icon: RotateCw },
                { id: 'point', code: 'ĐI', label: 'Thêm Điểm trên cạnh', icon: CircleDot },
                { id: 'midpoint', code: 'TĐ', label: 'Lấy Trung điểm cạnh', icon: GitCommit },
                { id: 'segment', code: 'ĐO', label: 'Nối Đoạn thẳng', icon: Minus },
                { id: 'intersect', code: 'GĐ', label: 'Giao điểm 2 đường thẳng', icon: Crosshair },
                { id: 'plane', code: 'MP', label: 'Tạo Mặt phẳng / Thiết diện', icon: Layers },
                { id: 'perp', code: 'VG', label: 'Hạ Đường vuông góc', icon: CornerDownRight }
              ].map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id);
                      setPendingPoints([]);
                      setPendingSegments([]);
                    }}
                    title={tool.label}
                    className={`px-2.5 py-1.5 rounded-xl flex flex-col items-center justify-center min-w-[40px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-100/90 text-teal-900 border border-teal-400 font-extrabold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] font-bold mt-0.5">{tool.code}</span>
                  </button>
                );
              })}

              {activeTool === 'plane' && pendingPoints.length >= 3 && (
                <button
                  onClick={handleCompletePlane}
                  className="ml-1 px-2.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold cursor-pointer"
                >
                  Hoàn tất tô mặt ({pendingPoints.length} đỉnh)
                </button>
              )}

              {selectedObject && (
                <button
                  onClick={handleDeleteSelected}
                  title="Xóa đối tượng đang chọn"
                  className="ml-0.5 px-2 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 flex flex-col items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-[9px] font-bold mt-0.5">XÓA</span>
                </button>
              )}
            </div>

            {/* SVG 3D STEREOMETRY VIEWPORT (LARGE 1040x680) */}
            <svg
              ref={svgRef}
              viewBox="0 0 1040 680"
              onMouseDown={handleSvgPointerDown}
              onMouseMove={handleSvgPointerMove}
              onMouseUp={handleSvgPointerUp}
              onMouseLeave={handleSvgPointerUp}
              className="w-full h-[650px] lg:h-[73vh] select-none cursor-grab active:cursor-grabbing"
            >
              {/* Optional Reference Grid */}
              {showGrid && (
                <g stroke="#f1f5f9" strokeWidth="1">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={680} />
                  ))}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <line key={`h-${i}`} x1={0} y1={i * 50} x2={1040} y2={i * 50} />
                  ))}
                </g>
              )}

              {/* 1. Shaded Planes & Cross-Sections */}
              {showPlaneShading &&
                scene.planes.map((pl) => {
                  const pts = pl.points.map((id) => projectedMap[id]).filter(Boolean);
                  if (pts.length < 3) return null;
                  const polyPoints = pts.map((p) => `${p.sx},${p.sy}`).join(' ');

                  let framePolygon = null;
                  if (pl.planeFrame && pts.length >= 3) {
                    const cx = pts.reduce((s, p) => s + p.sx, 0) / pts.length;
                    const cy = pts.reduce((s, p) => s + p.sy, 0) / pts.length;
                    const expanded = pts
                      .map((p) => `${cx + (p.sx - cx) * 1.38},${cy + (p.sy - cy) * 1.38}`)
                      .join(' ');
                    framePolygon = (
                      <g key={`${pl.id}-frame`}>
                        <polygon
                          points={expanded}
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="1.2"
                          strokeDasharray="5 4"
                        />
                        {pl.planeLabel && (
                          <text
                            x={cx + (pts[0].sx - cx) * 1.38 + 10}
                            y={cy + (pts[0].sy - cy) * 1.38 + 18}
                            fontFamily="Georgia, 'Times New Roman', serif"
                            fontStyle="italic"
                            fontSize="16"
                            fill="#1e293b"
                          >
                            {pl.planeLabel}
                          </text>
                        )}
                      </g>
                    );
                  }

                  return (
                    <g key={pl.id}>
                      {framePolygon}
                      <polygon
                        points={polyPoints}
                        fill={pl.fill || 'rgba(15, 118, 110, 0.14)'}
                        stroke="none"
                      />
                    </g>
                  );
                })}

              {/* 2. Special Sphere / Circle Outlines */}
              {scene.specialCircles?.map((sc, idx) => {
                const c = projectedMap[sc.center];
                if (!c) return null;
                const rPx = sc.radius * 132 * (zoom / 100);
                const pitchRad = (viewAngles.pitch * Math.PI) / 180;
                // Bán trục nhỏ ry co giãn chính xác theo độ nghiêng pitch góc nhìn 3D: ry = rPx * |sin(pitch)|
                const ry = Math.max(1.5, rPx * Math.abs(Math.sin(pitchRad)));
                const isLookingFromAbove = viewAngles.pitch >= 0;

                if (sc.type === 'sphere') {
                  return (
                    <g key={`sc-${idx}`}>
                      {/* Đường tròn bao mặt cầu */}
                      <circle
                        cx={c.sx}
                        cy={c.sy}
                        r={rPx}
                        fill="rgba(14, 165, 233, 0.06)"
                        stroke="#0f172a"
                        strokeWidth="1.8"
                      />
                      {/* Đường xích đạo: nửa sau nét đứt, nửa trước nét liền mờ */}
                      <path
                        d={`M ${c.sx - rPx} ${c.sy} A ${rPx} ${ry} 0 0 ${isLookingFromAbove ? 1 : 0} ${c.sx + rPx} ${c.sy}`}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="1.2"
                        strokeDasharray="5 4"
                      />
                      <path
                        d={`M ${c.sx + rPx} ${c.sy} A ${rPx} ${ry} 0 0 ${isLookingFromAbove ? 1 : 0} ${c.sx - rPx} ${c.sy}`}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="1.1"
                      />
                    </g>
                  );
                }

                return (
                  <g key={`sc-${idx}`}>
                    {/* Mặt đĩa tròn thiết diện phẳng tô màu ngọc bán trong suốt */}
                    <ellipse
                      cx={c.sx}
                      cy={c.sy}
                      rx={rPx}
                      ry={ry}
                      fill="rgba(13, 148, 136, 0.16)"
                      stroke="none"
                    />
                    {/* Nửa sau đường tròn giao tuyến (nét khuất bên trong hình) vẽ nét đứt chuẩn SGK */}
                    <path
                      d={`M ${c.sx - rPx} ${c.sy} A ${rPx} ${ry} 0 0 ${isLookingFromAbove ? 1 : 0} ${c.sx + rPx} ${c.sy}`}
                      fill="none"
                      stroke="#0f766e"
                      strokeWidth="1.8"
                      strokeDasharray="5 4"
                    />
                    {/* Nửa trước đường tròn giao tuyến (nét nhìn thấy bên ngoài) vẽ nét liền chuẩn SGK */}
                    <path
                      d={`M ${c.sx + rPx} ${c.sy} A ${rPx} ${ry} 0 0 ${isLookingFromAbove ? 1 : 0} ${c.sx - rPx} ${c.sy}`}
                      fill="none"
                      stroke="#0f766e"
                      strokeWidth="1.8"
                    />
                  </g>
                );
              })}

              {/* 3. Right-Angle Symbols (Ký hiệu góc vuông 3D) */}
              {scene.rightAngles?.map((ra, idx) => {
                const v = projectedMap[ra.vertex];
                const a1 = projectedMap[ra.arm1];
                const a2 = projectedMap[ra.arm2];
                if (!v || !a1 || !a2) return null;
                const d1x = a1.sx - v.sx,
                  d1y = a1.sy - v.sy;
                const d2x = a2.sx - v.sx,
                  d2y = a2.sy - v.sy;
                const l1 = Math.hypot(d1x, d1y) || 1;
                const l2 = Math.hypot(d2x, d2y) || 1;
                const size = 12;
                const u1x = (d1x / l1) * size,
                  u1y = (d1y / l1) * size;
                const u2x = (d2x / l2) * size,
                  u2y = (d2y / l2) * size;
                const p1 = `${v.sx + u1x},${v.sy + u1y}`;
                const p2 = `${v.sx + u1x + u2x},${v.sy + u1y + u2y}`;
                const p3 = `${v.sx + u2x},${v.sy + u2y}`;
                return (
                  <polyline
                    key={`ra-${idx}`}
                    points={`${p1} ${p2} ${p3}`}
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* 4. Segments & Extended Construction Lines */}
              {scene.segments.map((seg) => {
                const p1 = projectedMap[seg.p1];
                const p2 = projectedMap[seg.p2];
                if (!p1 || !p2) return null;

                const dx = p2.sx - p1.sx;
                const dy = p2.sy - p1.sy;
                const extStart = seg.extend ? seg.extend[0] : 0;
                const extEnd = seg.extend ? seg.extend[1] : 0;

                const x1 = p1.sx - dx * extStart;
                const y1 = p1.sy - dy * extStart;
                const x2 = p2.sx + dx * extEnd;
                const y2 = p2.sy + dy * extEnd;

                const isDashed = showHiddenDashed && seg.style === 'dashed';
                const isSelected =
                  (selectedObject?.type === 'segment' && selectedObject.id === seg.id) ||
                  pendingSegments.includes(seg.id);

                // Compute 3D length if showMeasurements is enabled
                let segLengthText = null;
                if (showMeasurements) {
                  const c1 = resolvedPointsMap[seg.p1]?.coords;
                  const c2 = resolvedPointsMap[seg.p2]?.coords;
                  if (c1 && c2) {
                    segLengthText = Math.hypot(
                      c2[0] - c1[0],
                      c2[1] - c1[1],
                      c2[2] - c1[2]
                    ).toFixed(2);
                  }
                }

                return (
                  <g
                    key={seg.id}
                    data-interactive="true"
                    onClick={(e) => handleSegmentClick(seg, e)}
                    className="cursor-pointer group"
                  >
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="14" />
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isSelected ? '#0d9488' : '#0f172a'}
                      strokeWidth={isSelected ? 2.8 : seg.thick ? 2.15 : 1.7}
                      strokeDasharray={isDashed ? '6 4.5' : undefined}
                      strokeLinecap="round"
                    />
                    {seg.lineLabel && (
                      <text
                        x={x1 + 10}
                        y={y1 + 14}
                        fontFamily="Georgia, 'Times New Roman', serif"
                        fontStyle="italic"
                        fontSize="16"
                        fill="#0f172a"
                      >
                        {seg.lineLabel}
                      </text>
                    )}
                    {showMeasurements && segLengthText && (
                      <text
                        x={(p1.sx + p2.sx) / 2}
                        y={(p1.sy + p2.sy) / 2 - 5}
                        fontSize="10"
                        fontFamily="monospace"
                        fill="#0f766e"
                        textAnchor="middle"
                      >
                        {segLengthText}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 5. Points & Draggable Classic Italic Math Labels */}
              {Object.values(projectedMap).map((pt) => {
                if (!pt.label) return null;
                const isSelected = selectedObject?.type === 'point' && selectedObject.id === pt.id;
                const isPending = pendingPoints.includes(pt.id);
                const [ox, oy] = pt.labelOffset || [-14, -8];

                return (
                  <g
                    key={pt.id}
                    data-interactive="true"
                    onClick={(e) => handlePointClick(pt.id, e)}
                    className="cursor-pointer"
                  >
                    {(isSelected || isPending) && (
                      <circle
                        cx={pt.sx}
                        cy={pt.sy}
                        r="8.5"
                        fill="rgba(13, 148, 136, 0.16)"
                        stroke="#0d9488"
                        strokeWidth="1.8"
                      />
                    )}

                    <circle
                      cx={pt.sx}
                      cy={pt.sy}
                      r={pt.parentEdge ? 3.6 : 3.1}
                      fill={isSelected ? '#0f766e' : '#0f172a'}
                    />

                    <text
                      x={pt.sx + ox}
                      y={pt.sy + oy}
                      onMouseDown={(e) => handleLabelMouseDown(pt, e)}
                      fontFamily="Georgia, 'Times New Roman', serif"
                      fontStyle="italic"
                      fontSize="18"
                      fontWeight="500"
                      fill={isSelected ? '#0f766e' : '#0f172a'}
                      className="cursor-move"
                    >
                      {pt.label}
                    </text>

                    {showMeasurements && (
                      <text
                        x={pt.sx + ox}
                        y={pt.sy + oy + 14}
                        fontSize="10"
                        fontFamily="monospace"
                        fill="#0284c7"
                      >
                        ({pt.coords.map((v) => v.toFixed(1)).join(';')})
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom-Left Display Toggles */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm p-1 flex items-center gap-1">
              <button
                onClick={() => setShowHiddenDashed(!showHiddenDashed)}
                title="Bật/tắt nét đứt cho cạnh khuất"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  showHiddenDashed ? 'bg-teal-100 text-teal-800' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowPlaneShading(!showPlaneShading)}
                title="Bật/tắt tô màu mặt phẳng thiết diện"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  showPlaneShading ? 'bg-teal-100 text-teal-800' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                title="Bật/tắt lưới nền"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  showGrid ? 'bg-teal-100 text-teal-800' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom-Center 3D View Presets */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm px-3 py-1.5 flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-teal-700" />
              <select
                value={`${viewAngles.yaw},${viewAngles.pitch}`}
                onChange={(e) => {
                  const [y, p] = e.target.value.split(',').map(Number);
                  setViewAngles({ yaw: y, pitch: p });
                }}
                className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={`${viewAngles.yaw},${viewAngles.pitch}`}>
                  Góc nhìn 3D ({viewAngles.yaw}°, {viewAngles.pitch}°)
                </option>
                <option value="-28,18">Góc nhìn chuẩn SGK (-28°, 18°)</option>
                <option value="-42,24">Góc nhìn chéo phải (-42°, 24°)</option>
                <option value="25,18">Góc nhìn chéo trái (25°, 18°)</option>
                <option value="0,12">Góc nhìn chính diện (0°, 12°)</option>
                <option value="-25,55">Góc nhìn từ trên xuống (-25°, 55°)</option>
              </select>
            </div>

            {/* Bottom-Right Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm px-2 py-1 flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(60, z - 10))}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-slate-700 w-10 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(160, z + 10))}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setZoom(100);
                  setViewAngles(currentTemplate.defaultView);
                }}
                title="Khớp khung hình chuẩn"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Inspector & Contextual Action Bar (KHỚP ẢNH MẪU 2: Điểm M | Thêm độ cao | Tỉ lệ...) */}
          <div className="mt-3 px-4 py-2.5 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-35 text-slate-600 cursor-pointer"
                  title="Hoàn tác (Undo)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-35 text-slate-600 cursor-pointer"
                  title="Làm lại (Redo)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>

              {selectedPointObj ? (
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 font-extrabold">
                    Điểm {selectedPointObj.label}
                  </span>

                  <button
                    onClick={() => handleAddAltitudeFromPoint(selectedPointObj.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 font-bold text-slate-700 cursor-pointer"
                  >
                    + Thêm đường cao từ {selectedPointObj.label}
                  </button>

                  {selectedPointObj.parentEdge ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-600 font-medium">
                        Thuộc cạnh {selectedPointObj.parentEdge[0]}
                        {selectedPointObj.parentEdge[1]}:
                      </span>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.02"
                        value={selectedPointObj.ratio ?? 0.5}
                        onChange={(e) => {
                          const r = parseFloat(e.target.value);
                          setScene((prev) => ({
                            ...prev,
                            points: prev.points.map((p) =>
                              p.id === selectedPointObj.id ? { ...p, ratio: r } : p
                            )
                          }));
                        }}
                        className="w-28 h-1.5 bg-slate-200 rounded-lg accent-teal-600 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-teal-800">
                        k = {selectedPointObj.ratio}
                      </span>
                      <button
                        onClick={() =>
                          pushHistory({
                            ...scene,
                            points: scene.points.map((p) =>
                              p.id === selectedPointObj.id ? { ...p, ratio: 0.5 } : p
                            )
                          })
                        }
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-bold cursor-pointer"
                      >
                        Trung điểm (1/2)
                      </button>
                      <button
                        onClick={() =>
                          pushHistory({
                            ...scene,
                            points: scene.points.map((p) =>
                              p.id === selectedPointObj.id ? { ...p, ratio: 0.67 } : p
                            )
                          })
                        }
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-bold cursor-pointer"
                      >
                        Trọng tâm (2/3)
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500">
                      Đỉnh cơ sở • Kéo chữ tên điểm để chỉnh vị trí nhãn
                    </span>
                  )}
                </div>
              ) : selectedSegmentObj ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-extrabold">
                    Cạnh {selectedSegmentObj.p1}
                    {selectedSegmentObj.p2}{' '}
                    {selectedSegmentLength ? `(d = ${selectedSegmentLength})` : ''}
                  </span>
                  <button
                    onClick={() => handleToggleSegmentStyle(selectedSegmentObj.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                  >
                    Đổi sang {selectedSegmentObj.style === 'dashed' ? 'Nét liền ───' : 'Nét đứt ---'}
                  </button>
                  <button
                    onClick={() => handleToggleSegmentExtend(selectedSegmentObj.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                  >
                    {selectedSegmentObj.extend &&
                    (selectedSegmentObj.extend[0] > 0 || selectedSegmentObj.extend[1] > 0)
                      ? 'Thu gọn về đoạn thẳng'
                      : 'Kéo dài thành đường thẳng (d)'}
                  </button>
                </div>
              ) : (
                <span className="text-slate-500">
                  <strong>Chọn và kéo:</strong> Chọn điểm hoặc cạnh để tùy chỉnh • Kéo trên nền trắng để xoay mô hình 3D.
                </span>
              )}
            </div>

            <div className="text-slate-400 font-semibold">
              {totalObjectsCount} đối tượng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
