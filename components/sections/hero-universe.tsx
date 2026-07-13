"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Heart, RotateCcw, ChevronDown, Rocket, MousePointer2, Zap, Volume2, VolumeX, ArrowBigUpDash } from "lucide-react";
import { useLanguage } from "@/components/providers/providers";
import { useMyInfo } from "@/hooks/use-my-info";
import { useTypewriter } from "@/hooks/use-typewriter";
import { siteConfig } from "@/lib/site-config";

type Phase = "idle" | "intro" | "playing" | "over";
type WeaponKind = "single" | "light" | "bomb" | "laser" | "spray" | "polygon" | "wave";

const MAX_LIVES = 3;
const MAX_POWER = 12;
const INTRO_DUR = 2.3;
const BG = 0x05060d;
const EDGE = 0xff5a2a; // orange-red brand
const EDGE_BRIGHT = 0xff9a5c;
const WHITE = 0xeef3f8;
const BLUE = 0x4aa8ff; // armored asteroid — 2 hits
const PURPLE = 0xb06bff; // armored asteroid — 3 hits

const WEAPONS: WeaponKind[] = ["single", "light", "bomb", "laser", "spray", "polygon", "wave"];
const WEAPON_META: Record<
  WeaponKind,
  {
    label: string; rate: number; speed: number; dmg: number; color: number; size: number;
    pierce?: boolean; aoe?: number; pellets?: number; spread?: number; long?: boolean;
    poly?: boolean; ring?: boolean; grow?: number;
  }
> = {
  single: { label: "ĐẠN ĐƠN", rate: 0.17, speed: 175, dmg: 1, color: WHITE, size: 0.18 },
  light: { label: "ĐẠN ÁNH SÁNG", rate: 0.1, speed: 250, dmg: 1, color: EDGE_BRIGHT, size: 0.14 },
  bomb: { label: "ĐẠN BOM", rate: 0.44, speed: 120, dmg: 3, color: 0xffcf6a, size: 0.34, aoe: 7 },
  laser: { label: "ĐẠN LAZER", rate: 0.24, speed: 340, dmg: 2, color: EDGE, size: 0.12, pierce: true, long: true },
  spray: { label: "ĐẠN CHÙM", rate: 0.3, speed: 165, dmg: 1, color: WHITE, size: 0.13, pellets: 3, spread: 0.09 },
  polygon: { label: "ĐẠN ĐA GIÁC", rate: 0.5, speed: 125, dmg: 4, color: EDGE_BRIGHT, size: 0.55, aoe: 5, poly: true },
  wave: { label: "SÓNG ÂM", rate: 0.6, speed: 95, dmg: 1, color: 0x8fd0ff, size: 0.7, pierce: true, ring: true, grow: 6 },
};

interface Enemy {
  mesh: THREE.Group;
  radius: number;
  hp: number;
  maxHp: number;
  vel: THREE.Vector3;
  spin: THREE.Vector3;
  changer: boolean;
  boss: boolean;
  nextWeapon?: WeaponKind; // upgrade cube: which ammo it grants
  bar: { grp: THREE.Group; fill: THREE.Mesh } | null; // 3D health bar (tough asteroids)
}
interface Bullet {
  mesh: THREE.Object3D;
  dir: THREE.Vector3;
  life: number;
  dmg: number;
  speed: number;
  aoe: number;
  pierce: boolean;
  size: number; // current collision radius (grows for wave)
  base: number; // geometry's base size, for visual scaling
  grow: number; // radius growth per second (0 = none)
  hit: Set<Enemy>;
}
interface Spark {
  points: THREE.Points;
  velocities: Float32Array;
  life: number;
  max: number;
}

const salvoOf = (power: number) => 1 + Math.min(4, Math.floor(power / 3)); // 1..5 parallel shots

export function HeroUniverse() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const { profile } = useMyInfo();
  const fullName = profile.fullName[lang as keyof typeof profile.fullName] || profile.fullName.en;
  const slogan = profile.slogan[lang as keyof typeof profile.slogan] || profile.slogan.en;
  const typedSlogan = useTypewriter(slogan);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [wave, setWave] = useState(1);
  const [power, setPower] = useState(0);
  const [weapon, setWeapon] = useState<WeaponKind>("single");
  const [bossHp, setBossHp] = useState<number | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [hoverAmmo, setHoverAmmo] = useState<string | null>(null);
  const [muted, setMuted] = useState<boolean>(
    () => typeof window !== "undefined" && localStorage.getItem("hero_muted") === "1",
  );
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
    if (typeof window !== "undefined") localStorage.setItem("hero_muted", muted ? "1" : "0");
  }, [muted]);

  const apiRef = useRef<{ start: () => void; stop: () => void; resume: () => void }>({
    start: () => {},
    stop: () => {},
    resume: () => {},
  });
  const handleStart = useCallback(() => apiRef.current.start(), []);
  const handleStop = useCallback(() => apiRef.current.stop(), []);
  const handleResume = useCallback(() => apiRef.current.resume(), []);

  useEffect(() => {
    if (phase === "idle") delete document.body.dataset.game;
    else document.body.dataset.game = "1";
    return () => {
      delete document.body.dataset.game;
    };
  }, [phase]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    // Weak-hardware tier: fewer particles, no MSAA, lower resolution so the
    // hero doesn't peg an integrated GPU.
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowPower =
      isTouch || (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.004);

    const camera = new THREE.PerspectiveCamera(72, mount.clientWidth / mount.clientHeight, 0.1, 600);
    camera.position.set(0, 0, 6);
    camera.rotation.order = "YXZ";

    const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    const canvas = renderer.domElement;

    const disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];
    const track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(x: T): T => {
      disposables.push(x);
      return x;
    };

    const dotTexture = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const cx = c.getContext("2d")!;
      const g = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.4, "rgba(255,255,255,0.6)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      cx.fillStyle = g;
      cx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return track(tex);
    };
    const starTex = dotTexture();

    // ---------- 8-bit sound (Web Audio, synthesised — no asset files) ----------
    let actx: AudioContext | null = null;
    const ensureCtx = () => {
      if (!actx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AC) actx = new AC();
      }
      if (actx && actx.state === "suspended") actx.resume();
      return actx;
    };
    const blip = (freq: number, dur: number, type: OscillatorType, vol: number, toFreq?: number) => {
      if (mutedRef.current) return;
      const ac = ensureCtx();
      if (!ac) return;
      const t0 = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (toFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, toFreq), t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    };
    const seq = (notes: Array<[number, number]>, type: OscillatorType, vol: number, step = 0.09) => {
      if (mutedRef.current) return;
      notes.forEach(([f, d], i) => window.setTimeout(() => blip(f, d, type, vol), i * step * 1000));
    };
    const sfx = {
      shoot: () => blip(520, 0.05, "square", 0.045, 190),
      break: () => blip(180, 0.14, "triangle", 0.09, 50),
      hurt: () => blip(200, 0.22, "sawtooth", 0.1, 55),
      upgrade: () => seq([[440, 0.06], [660, 0.06], [880, 0.1]], "square", 0.07, 0.07),
      start: () => seq([[330, 0.08], [440, 0.08], [660, 0.12]], "square", 0.07, 0.09),
      gameOver: () => seq([[440, 0.16], [330, 0.16], [220, 0.28]], "square", 0.08, 0.16),
      bossWin: () => seq([[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.22]], "square", 0.08, 0.1),
    };

    // ---------- hidden-line-removal wireframe body ----------
    // opaque bg-coloured fill (occludes rear edges) + bright edge lines on top.
    const wireBody = (geo: THREE.BufferGeometry, edgeColor: number, opacity = 1, edgeOpacity = 0.92) => {
      track(geo);
      const group = new THREE.Group();
      const fillMat = track(
        new THREE.MeshBasicMaterial({
          color: BG,
          transparent: opacity < 1,
          opacity,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        }),
      );
      const fill = new THREE.Mesh(geo, fillMat);
      const edgeGeo = track(new THREE.EdgesGeometry(geo, 18));
      const edgeMat = track(new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: edgeOpacity }));
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      group.add(fill, edges);
      return group;
    };

    // ---------- starfield ----------
    const makeStars = (count: number, spread: number, size: number, opacity: number) => {
      const g = track(new THREE.BufferGeometry());
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread - 60;
      }
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const m = track(
        new THREE.PointsMaterial({
          size,
          map: starTex,
          color: 0x9fb4c4,
          alphaTest: 0.01,
          transparent: true,
          opacity,
          depthWrite: false,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
        }),
      );
      return new THREE.Points(g, m);
    };
    const starsFar = makeStars(lowPower ? 1100 : 2600, 360, 0.7, 0.7);
    const starsNear = makeStars(lowPower ? 320 : 700, 220, 1.3, 0.85);
    scene.add(starsFar, starsNear);

    // ---------- plexus slab (the "computer-generated galaxy") ----------
    const plexus = new THREE.Group();
    scene.add(plexus);
    const NODES = lowPower ? 52 : 92;
    const REGION = { x: 90, y: 48, z: 60 };
    const DIST = 15;
    const nodePos = new Float32Array(NODES * 3);
    const nodeVel = new Float32Array(NODES * 3);
    for (let i = 0; i < NODES; i++) {
      nodePos[i * 3] = (Math.random() - 0.5) * REGION.x;
      nodePos[i * 3 + 1] = (Math.random() - 0.5) * REGION.y;
      nodePos[i * 3 + 2] = (Math.random() - 0.5) * REGION.z - 55;
      nodeVel[i * 3] = (Math.random() - 0.5) * 1.6;
      nodeVel[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      nodeVel[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }
    const nodeGeo = track(new THREE.BufferGeometry());
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
    const nodeMat = track(
      new THREE.PointsMaterial({ size: 1.4, map: starTex, color: EDGE_BRIGHT, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    nodePoints.frustumCulled = false;
    plexus.add(nodePoints);

    const MAX_LINKS = NODES * 8;
    const linkPos = new Float32Array(MAX_LINKS * 2 * 3);
    const linkGeo = track(new THREE.BufferGeometry());
    linkGeo.setAttribute("position", new THREE.BufferAttribute(linkPos, 3).setUsage(THREE.DynamicDrawUsage));
    const linkMat = track(new THREE.LineBasicMaterial({ color: EDGE, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }));
    const links = new THREE.LineSegments(linkGeo, linkMat);
    links.frustumCulled = false;
    plexus.add(links);

    const updatePlexus = (dt: number) => {
      const hx = REGION.x / 2,
        hy = REGION.y / 2,
        hz = REGION.z / 2,
        cz = -55;
      for (let i = 0; i < NODES; i++) {
        for (let a = 0; a < 3; a++) {
          const k = i * 3 + a;
          nodePos[k] += nodeVel[k] * dt;
          const lo = a === 2 ? cz - hz : (a === 0 ? -hx : -hy);
          const hi = a === 2 ? cz + hz : (a === 0 ? hx : hy);
          if (nodePos[k] < lo || nodePos[k] > hi) nodeVel[k] *= -1;
        }
      }
      nodeGeo.getAttribute("position").needsUpdate = true;
      // rebuild links
      let li = 0;
      const d2 = DIST * DIST;
      for (let i = 0; i < NODES && li < MAX_LINKS; i++) {
        const ix = nodePos[i * 3],
          iy = nodePos[i * 3 + 1],
          iz = nodePos[i * 3 + 2];
        for (let j = i + 1; j < NODES && li < MAX_LINKS; j++) {
          const dx = ix - nodePos[j * 3];
          const dy = iy - nodePos[j * 3 + 1];
          const dz = iz - nodePos[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < d2) {
            const o = li * 6;
            linkPos[o] = ix;
            linkPos[o + 1] = iy;
            linkPos[o + 2] = iz;
            linkPos[o + 3] = nodePos[j * 3];
            linkPos[o + 4] = nodePos[j * 3 + 1];
            linkPos[o + 5] = nodePos[j * 3 + 2];
            li++;
          }
        }
      }
      linkGeo.setDrawRange(0, li * 2);
      linkGeo.getAttribute("position").needsUpdate = true;
    };

    // ---------- core structure (wireframe icosphere + orbiting polyhedra) ----------
    const core = new THREE.Group();
    core.position.set(22, 6, -70);
    scene.add(core);
    let coreTargetX = 22;

    // a faceted polygon "sun": many flat triangles, lit from one side so every
    // facet reads, warm-glowing so it never goes pitch black.
    const sunGeo = track(new THREE.IcosahedronGeometry(6.5, 4)); // ~320 facets, still round
    const sunMat = track(
      new THREE.MeshStandardMaterial({ color: 0xff6a2e, emissive: 0xff3a12, emissiveIntensity: 0.5, flatShading: true, roughness: 0.55, metalness: 0.1 }),
    );
    const coreSphere = new THREE.Mesh(sunGeo, sunMat);
    core.add(coreSphere);
    // faint low-poly wire overlay for the tech edge
    core.add(
      new THREE.LineSegments(
        track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(6.56, 2)), 1)),
        track(new THREE.LineBasicMaterial({ color: EDGE_BRIGHT, transparent: true, opacity: 0.16 })),
      ),
    );
    // warm additive halo
    core.add(
      new THREE.Mesh(
        track(new THREE.SphereGeometry(9.6, 24, 24)),
        track(new THREE.MeshBasicMaterial({ color: 0xff6a2e, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false })),
      ),
    );

    // lights — these only touch the Standard-material sun; every other body uses
    // unlit Basic/Line/Points materials and is unaffected.
    const sunKey = new THREE.DirectionalLight(0xffe8d0, 1.15);
    sunKey.position.set(-1, 0.65, 0.5);
    scene.add(sunKey);
    scene.add(new THREE.AmbientLight(0xff7a44, 0.28)); // warm fill so the far facets stay tinted, not black

    const orbiters: Array<{ pivot: THREE.Group; speed: number; body: THREE.Group }> = [];
    const orbGeoms = [
      () => new THREE.OctahedronGeometry(1.1, 0),
      () => new THREE.TetrahedronGeometry(1.3, 0),
      () => new THREE.IcosahedronGeometry(1.2, 0),
      () => new THREE.BoxGeometry(1.6, 1.6, 1.6),
      () => new THREE.DodecahedronGeometry(1.4, 0),
    ];
    const orbR = [11, 15, 19.5, 24, 29];
    for (let i = 0; i < orbGeoms.length; i++) {
      const pivot = new THREE.Group();
      pivot.rotation.set(Math.random() * 0.5, Math.random() * Math.PI * 2, Math.random() * 0.3);
      core.add(pivot);
      const body = wireBody(orbGeoms[i](), i % 2 ? WHITE : EDGE, 1, 0.5);
      body.position.x = orbR[i];
      pivot.add(body);
      // faint orbit ring
      const ring = new THREE.LineLoop(
        track(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 96 }, (_, k) => {
          const a = (k / 96) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * orbR[i], 0, Math.sin(a) * orbR[i]);
        }))),
        track(new THREE.LineBasicMaterial({ color: EDGE, transparent: true, opacity: 0.08 })),
      );
      core.add(ring);
      orbiters.push({ pivot, speed: 0.5 - i * 0.07, body });
    }

    // ---------- floating spaceship with a Vietnam flag ----------
    // poly / wireframe hull; the flag itself is solid (red field, yellow star).
    const SHIP_IDLE = new THREE.Vector3(-16, 1.5, -40);
    const ship = new THREE.Group();
    ship.position.copy(SHIP_IDLE);
    scene.add(ship);

    const hull = wireBody(new THREE.CapsuleGeometry(0.85, 2.4, 4, 10), WHITE, 1, 0.85);
    hull.rotation.x = Math.PI / 2; // lie along Z
    ship.add(hull);
    const shipNose = wireBody(new THREE.ConeGeometry(0.85, 1.6, 10), EDGE, 1, 0.75);
    shipNose.rotation.x = -Math.PI / 2;
    shipNose.position.z = -2.0;
    ship.add(shipNose);
    const canopy = wireBody(new THREE.SphereGeometry(0.6, 10, 8), EDGE_BRIGHT, 1, 0.7);
    canopy.position.set(0, 0.45, -0.6);
    ship.add(canopy);
    const wing = wireBody(new THREE.BoxGeometry(4.2, 0.14, 1.1), EDGE, 1, 0.6);
    wing.position.y = -0.2;
    ship.add(wing);
    const engineGlow = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.5, 12, 12)),
      track(new THREE.MeshBasicMaterial({ color: 0x8fd0ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    engineGlow.position.set(0, -0.1, 2.1);
    ship.add(engineGlow);

    // reusable 5-point star shape (Vietnam flag)
    const starShape = new THREE.Shape();
    {
      const spikes = 5, outerR = 0.42, innerR = 0.17;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(a) * r, py = Math.sin(a) * r;
        if (i === 0) starShape.moveTo(px, py);
        else starShape.lineTo(px, py);
      }
      starShape.closePath();
    }

    const flag = new THREE.Group();
    flag.position.set(0, 1.35, 0.2);
    const pole = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.05, 0.05, 1.7, 6)),
      track(new THREE.MeshBasicMaterial({ color: 0xcfd8e0 })),
    );
    pole.position.y = -0.25;
    flag.add(pole);
    const flagField = new THREE.Mesh(
      track(new THREE.PlaneGeometry(1.7, 1.15)),
      track(new THREE.MeshBasicMaterial({ color: 0xda251d, side: THREE.DoubleSide })),
    );
    flagField.position.set(0.9, 0.45, 0);
    flag.add(flagField);
    const flagStar = new THREE.Mesh(
      track(new THREE.ShapeGeometry(starShape)),
      track(new THREE.MeshBasicMaterial({ color: 0xffcd00, side: THREE.DoubleSide })),
    );
    flagStar.position.set(0.9, 0.45, 0.01);
    flag.add(flagStar);
    ship.add(flag);

    // ---------- cockpit interior (attached to the camera) ----------
    // Only shown while playing, so it reads as sitting inside the ship.
    scene.add(camera); // camera must be in the graph for its children to render
    const cockpit = new THREE.Group();
    cockpit.visible = false;
    camera.add(cockpit);
    const dash = wireBody(new THREE.BoxGeometry(3.6, 0.9, 0.5), EDGE, 0.6, 0.9);
    dash.position.set(0, -1.28, -1.7);
    dash.rotation.x = 0.5;
    cockpit.add(dash);
    for (const sx of [-1, 1]) {
      const strut = wireBody(new THREE.BoxGeometry(0.12, 2.6, 0.12), EDGE_BRIGHT, 0.4, 0.65);
      strut.position.set(sx * 1.7, -0.15, -1.6);
      strut.rotation.z = sx * 0.5;
      cockpit.add(strut);
    }
    // tiny VN flag decal on the dashboard
    const decal = new THREE.Group();
    const decalField = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.34, 0.24)),
      track(new THREE.MeshBasicMaterial({ color: 0xda251d, side: THREE.DoubleSide })),
    );
    decal.add(decalField);
    const decalStar = new THREE.Mesh(
      track(new THREE.ShapeGeometry(starShape)),
      track(new THREE.MeshBasicMaterial({ color: 0xffcd00, side: THREE.DoubleSide })),
    );
    decalStar.scale.setScalar(0.26);
    decalStar.position.z = 0.001;
    decal.add(decalStar);
    decal.position.set(1.15, -1.05, -1.66);
    decal.rotation.x = 0.5;
    cockpit.add(decal);

    // ---------- satellites drifting across the far field ----------
    const satellites: Array<{ grp: THREE.Group; vel: THREE.Vector3; life: number }> = [];
    const makeSatellite = () => {
      const g = new THREE.Group();
      g.add(wireBody(new THREE.BoxGeometry(1.0, 0.6, 0.6), WHITE, 1, 0.7));
      for (const sx of [-1, 1]) {
        const panel = wireBody(new THREE.BoxGeometry(1.5, 0.03, 0.8), EDGE, 1, 0.55);
        panel.position.x = sx * 1.35;
        g.add(panel);
      }
      const antenna = wireBody(new THREE.ConeGeometry(0.32, 0.4, 8), EDGE_BRIGHT, 1, 0.6);
      antenna.position.y = 0.5;
      g.add(antenna);
      return g;
    };
    let satTimer = 4;
    const spawnSatellite = () => {
      const g = makeSatellite();
      const fromLeft = Math.random() < 0.5;
      g.position.set(fromLeft ? -95 : 95, 8 + Math.random() * 30, -55 - Math.random() * 55);
      g.rotation.set(Math.random(), Math.random(), Math.random());
      scene.add(g);
      const sp = 7 + Math.random() * 4;
      satellites.push({ grp: g, vel: new THREE.Vector3(fromLeft ? sp : -sp, 0, 0), life: 0 });
    };

    // ---------- game resources ----------
    const enemyEdgeGeoCache = new Map<string, THREE.BufferGeometry>();
    const enemyBody = (radius: number, changer: boolean, boss: boolean, tint = WHITE) => {
      const geo = boss
        ? new THREE.TorusKnotGeometry(radius * 0.7, radius * 0.24, 64, 8)
        : changer
          ? new THREE.BoxGeometry(radius * 1.35, radius * 1.35, radius * 1.35) // upgrade cube
          : new THREE.IcosahedronGeometry(radius, 0);
      const edgeColor = boss ? EDGE_BRIGHT : changer ? EDGE : tint;
      const grp = wireBody(geo, edgeColor, 1, 1);
      // every asteroid gets a soft additive halo so it never sinks into the bg
      const haloColor = boss ? EDGE_BRIGHT : changer ? EDGE : tint;
      const haloOpacity = boss ? 0.16 : changer ? 0.22 : 0.14;
      const halo = new THREE.Mesh(
        track(new THREE.SphereGeometry(radius * 1.55, 16, 16)),
        track(new THREE.MeshBasicMaterial({ color: haloColor, transparent: true, opacity: haloOpacity, blending: THREE.AdditiveBlending, depthWrite: false })),
      );
      grp.add(halo);
      return grp;
    };

    const bulletGeoCache = new Map<WeaponKind, THREE.BufferGeometry>();
    const bulletMatCache = new Map<WeaponKind, THREE.Material>();
    const bulletVisual = (kind: WeaponKind) => {
      const meta = WEAPON_META[kind];
      let geo = bulletGeoCache.get(kind);
      if (!geo) {
        geo = meta.long
          ? new THREE.CylinderGeometry(meta.size * 0.5, meta.size * 0.5, 2.6, 8)
          : meta.ring
            ? new THREE.TorusGeometry(meta.size, meta.size * 0.22, 8, 24)
            : meta.poly
              ? new THREE.DodecahedronGeometry(meta.size, 0)
              : new THREE.SphereGeometry(meta.size, 10, 10);
        bulletGeoCache.set(kind, track(geo));
      }
      let mat = bulletMatCache.get(kind);
      if (!mat) {
        mat = new THREE.MeshBasicMaterial({ color: meta.color });
        bulletMatCache.set(kind, track(mat));
      }
      return { geo, mat };
    };

    // shared health-bar resources (one geometry/material set for every bar)
    const barGeo = track(new THREE.PlaneGeometry(1, 0.16));
    const barBgMat = track(new THREE.MeshBasicMaterial({ color: 0x0a1220, transparent: true, opacity: 0.75, depthTest: false }));
    const barFillMat = track(new THREE.MeshBasicMaterial({ color: 0x7ef0a0, depthTest: false }));
    const makeHealthBar = () => {
      const grp = new THREE.Group();
      const bg = new THREE.Mesh(barGeo, barBgMat);
      const fill = new THREE.Mesh(barGeo, barFillMat);
      fill.position.z = 0.002;
      grp.add(bg, fill);
      grp.renderOrder = 999;
      return { grp, fill };
    };

    const enemies: Enemy[] = [];
    const bullets: Bullet[] = [];
    const sparks: Spark[] = [];

    const game = {
      mode: "idle" as Phase,
      score: 0,
      lives: MAX_LIVES,
      wave: 1,
      power: 0,
      weapon: 0, // index into WEAPONS
      cooldown: 0,
      firing: false,
      introT: 0,
      yaw: 0,
      pitch: 0,
      betweenWaves: false,
      waveTimer: 0,
      locked: false,
      paused: false,
      boss: null as Enemy | null,
    };

    const tmp = new THREE.Vector3();
    const fwd = new THREE.Vector3();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const player = new THREE.Vector3(0, 0, 6);
    const raycaster = new THREE.Raycaster();
    const CENTER = new THREE.Vector2(0, 0); // crosshair = screen centre
    let lastHover: string | null = null;

    let bannerTimeout = 0;
    const showBanner = (msg: string, hold = 1400) => {
      setBanner(msg);
      clearTimeout(bannerTimeout);
      bannerTimeout = window.setTimeout(() => setBanner(null), hold);
    };

    const explode = (pos: THREE.Vector3, color: number, n = 22, spread = 14) => {
      const g = new THREE.BufferGeometry();
      const p = new Float32Array(n * 3);
      const vel = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        p[i * 3] = pos.x;
        p[i * 3 + 1] = pos.y;
        p[i * 3 + 2] = pos.z;
        vel[i * 3] = (Math.random() - 0.5) * spread;
        vel[i * 3 + 1] = (Math.random() - 0.5) * spread;
        vel[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      g.setAttribute("position", new THREE.BufferAttribute(p, 3));
      const m = new THREE.PointsMaterial({ color, size: 0.5, map: starTex, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
      const points = new THREE.Points(g, m);
      scene.add(points);
      sparks.push({ points, velocities: vel, life: 0, max: 0.6 });
    };

    const removeEnemy = (e: Enemy) => {
      scene.remove(e.mesh);
      if (e.bar) scene.remove(e.bar.grp);
      if (game.boss === e) {
        game.boss = null;
        setBossHp(null);
      }
    };
    const clearBullets = () => {
      for (const b of bullets) scene.remove(b.mesh);
      bullets.length = 0;
    };
    const clearGameObjects = () => {
      for (const e of enemies) scene.remove(e.mesh);
      enemies.length = 0;
      game.boss = null;
      setBossHp(null);
      clearBullets();
      for (const s of sparks) {
        scene.remove(s.points);
        s.points.geometry.dispose();
        (s.points.material as THREE.Material).dispose();
      }
      sparks.length = 0;
    };

    // spawn an enemy coming in from a wide frontal cone, aimed at the player
    const spawnEnemy = (waveSpeed: number, hp: number, changer: boolean) => {
      if (changer) {
        // upgrade cube: drifts sideways across the view (never homes at you),
        // carries a random ammo type shown on hover, granted only if shot.
        const radius = 1.15;
        const nextWeapon = WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
        const mesh = enemyBody(radius, true, false);
        mesh.userData.changerWeapon = nextWeapon;
        const fromLeft = Math.random() < 0.5;
        mesh.position.set(fromLeft ? -52 : 52, (Math.random() - 0.5) * 22, -20 - Math.random() * 18);
        mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        scene.add(mesh);
        const sp = 9 + Math.random() * 4;
        enemies.push({
          mesh, radius, hp: 2, maxHp: 2,
          vel: new THREE.Vector3(fromLeft ? sp : -sp, 0, 0),
          spin: new THREE.Vector3(Math.random() * 1.2, Math.random() * 1.4, Math.random()),
          changer: true, boss: false, nextWeapon, bar: null,
        });
        return;
      }
      // normal / armored asteroid, homing at the player
      const radius = 0.75 + Math.random() * 1.1;
      // occasionally armored: blue = 2 hits, purple = 3 hits
      let finalHp = hp;
      const roll = Math.random();
      if (roll < 0.16) finalHp = Math.max(finalHp, 3);
      else if (roll < 0.42) finalHp = Math.max(finalHp, 2);
      const tint = finalHp >= 3 ? PURPLE : finalHp === 2 ? BLUE : WHITE;
      const mesh = enemyBody(radius, false, false, tint);
      const angH = (Math.random() - 0.5) * 1.05; // gentler horizontal spread (~±30°)
      const angV = (Math.random() - 0.5) * 0.75; // gentler vertical spread
      const R = 130 + Math.random() * 60;
      const dir = new THREE.Vector3(Math.sin(angH) * Math.cos(angV), Math.sin(angV), -Math.cos(angH) * Math.cos(angV));
      mesh.position.copy(dir).multiplyScalar(R);
      mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      scene.add(mesh);
      const target = new THREE.Vector3(player.x + (Math.random() - 0.5) * 4, player.y + (Math.random() - 0.5) * 4, player.z);
      const vel = target.sub(mesh.position).normalize().multiplyScalar(waveSpeed + Math.random() * 2);
      let bar: Enemy["bar"] = null;
      if (finalHp >= 2) {
        bar = makeHealthBar();
        scene.add(bar.grp);
      }
      enemies.push({
        mesh, radius, hp: finalHp, maxHp: finalHp, vel,
        spin: new THREE.Vector3(Math.random() * 1.4, Math.random() * 1.2, Math.random() * 1),
        changer: false, boss: false, bar,
      });
    };

    const spawnBoss = (w: number) => {
      const radius = 5.5;
      const mesh = enemyBody(radius, false, true);
      mesh.position.set(0, 4, -150);
      scene.add(mesh);
      const hp = 60 + w * 14;
      const boss: Enemy = {
        mesh,
        radius,
        hp,
        maxHp: hp,
        vel: new THREE.Vector3(0, 0, 10),
        spin: new THREE.Vector3(0, 0.4, 0),
        changer: false,
        boss: true,
        bar: null,
      };
      enemies.push(boss);
      game.boss = boss;
      setBossHp(1);
    };

    const startWave = (w: number) => {
      if (w % 5 === 0) {
        spawnBoss(w);
        // a few escorts
        for (let i = 0; i < 4 + Math.floor(w / 5); i++) spawnEnemy(7 + w * 0.4, 1 + Math.floor(w / 4), i === 0);
        showBanner("⚠ TÀU QUÁI — BOSS", 1800);
        return;
      }
      const count = Math.min(22, 5 + w * 2);
      const speed = 7 + w * 0.9;
      const hp = 1 + Math.floor(w / 3);
      const changerIdx = Math.floor(Math.random() * count);
      for (let i = 0; i < count; i++) spawnEnemy(speed, hp, i === changerIdx);
    };

    const addPower = (n: number) => {
      game.power = Math.min(MAX_POWER, game.power + n);
      setPower(game.power);
    };
    const losePower = () => {
      game.power = Math.max(0, game.power - 1);
      setPower(game.power);
    };
    const setWeaponTo = (kind: WeaponKind) => {
      game.weapon = WEAPONS.indexOf(kind);
      setWeapon(kind);
      showBanner(`↻ ${WEAPON_META[kind].label}`, 1300);
    };
    // pick a RANDOM weapon (different from the current one)
    const switchWeapon = () => {
      let idx = game.weapon;
      if (WEAPONS.length > 1) while (idx === game.weapon) idx = Math.floor(Math.random() * WEAPONS.length);
      setWeaponTo(WEAPONS[idx]);
    };

    const destroyEnemy = (idx: number) => {
      const e = enemies[idx];
      const col = e.boss ? EDGE_BRIGHT : e.changer ? EDGE : WHITE;
      explode(e.mesh.position.clone(), col, e.boss ? 60 : e.changer ? 34 : 20, e.boss ? 26 : 14);
      removeEnemy(e);
      enemies.splice(idx, 1);
      if (e.boss) {
        game.score += 300;
        addPower(4);
        switchWeapon();
        showBanner("HẠ GỤC BOSS! +300", 1600);
        sfx.bossWin();
      } else if (e.changer) {
        game.score += 40;
        addPower(1);
        setWeaponTo(e.nextWeapon || WEAPONS[game.weapon]); // grant the shown ammo
        sfx.upgrade();
      } else {
        game.score += Math.round(12 * e.radius);
        addPower(1);
        sfx.break();
      }
      setScore(game.score);
    };

    const damageEnemy = (idx: number, dmg: number, at: THREE.Vector3) => {
      const e = enemies[idx];
      e.hp -= dmg;
      if (e.boss) setBossHp(Math.max(0, e.hp / e.maxHp));
      if (e.hp <= 0) destroyEnemy(idx);
      else explode(at, e.boss ? EDGE_BRIGHT : 0xcfe6ef, 5, 8);
    };

    const spawnBullet = (origin: THREE.Vector3, dir: THREE.Vector3, kind: WeaponKind) => {
      const meta = WEAPON_META[kind];
      const { geo, mat } = bulletVisual(kind);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(origin);
      if (meta.long) {
        // orient cylinder along dir
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      } else if (meta.ring) {
        // face the sound-wave ring toward travel direction (torus axis = +Z)
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
      }
      scene.add(mesh);
      bullets.push({
        mesh,
        dir: dir.clone().normalize(),
        life: 0,
        dmg: meta.dmg,
        speed: meta.speed,
        aoe: meta.aoe || 0,
        pierce: !!meta.pierce,
        size: meta.size,
        base: meta.size,
        grow: meta.grow || 0,
        hit: new Set(),
      });
    };

    const fire = () => {
      const kind = WEAPONS[game.weapon];
      const meta = WEAPON_META[kind];
      camera.getWorldDirection(fwd);
      right.crossVectors(fwd, up).normalize();
      const nose = camera.position.clone().add(tmp.copy(fwd).multiplyScalar(2.4)).add(new THREE.Vector3(0, -0.35, 0));
      sfx.shoot();
      const salvo = salvoOf(game.power);
      for (let i = 0; i < salvo; i++) {
        const off = (i - (salvo - 1) / 2) * 0.55;
        const origin = nose.clone().add(right.clone().multiplyScalar(off));
        if (kind === "spray") {
          const pellets = meta.pellets || 3;
          for (let p = 0; p < pellets; p++) {
            const s = meta.spread || 0.09;
            const d = fwd
              .clone()
              .applyAxisAngle(up, (Math.random() - 0.5) * s * 2)
              .applyAxisAngle(right, (Math.random() - 0.5) * s * 2);
            spawnBullet(origin, d, kind);
          }
        } else {
          spawnBullet(origin, fwd.clone(), kind); // STRAIGHT
        }
      }
    };

    const beginPlaying = () => {
      game.mode = "playing";
      game.wave = 1;
      setWave(1);
      startWave(1);
      showBanner("ĐỢT 1");
      setPhase("playing");
    };

    const start = () => {
      clearGameObjects();
      game.mode = "intro";
      game.score = 0;
      game.lives = MAX_LIVES;
      game.power = 0;
      game.weapon = 0;
      game.cooldown = 0;
      game.firing = false;
      game.introT = 0;
      game.yaw = 0;
      game.pitch = 0;
      game.betweenWaves = false;
      game.waveTimer = 0;
      game.paused = false;
      coreTargetX = 78;
      setPhase("intro");
      setScore(0);
      setLives(MAX_LIVES);
      setPower(0);
      setWeapon("single");
      setWave(1);
      setPaused(false);
      setBossHp(null);
      sfx.start();
      if (!isTouch) canvas.requestPointerLock?.();
    };

    const stop = () => {
      game.mode = "idle";
      clearGameObjects();
      coreTargetX = 22;
      camera.rotation.set(0, 0, 0);
      camera.position.set(0, 0, 6);
      game.paused = false;
      setPaused(false);
      setHoverAmmo(null);
      lastHover = null;
      if (document.pointerLockElement === canvas) document.exitPointerLock?.();
      setPhase("idle");
    };

    const gameOver = () => {
      game.mode = "over";
      setHoverAmmo(null);
      lastHover = null;
      sfx.gameOver();
      if (document.pointerLockElement === canvas) document.exitPointerLock?.();
      setPhase("over");
    };

    const resume = () => {
      if (!isTouch) canvas.requestPointerLock?.();
    };

    apiRef.current = { start, stop, resume };

    // ---------- controls ----------
    const clampLook = () => {
      game.yaw = Math.max(-1.15, Math.min(1.15, game.yaw));
      game.pitch = Math.max(-0.7, Math.min(0.7, game.pitch));
    };
    const onMouseMove = (e: MouseEvent) => {
      if (game.mode !== "playing" || game.paused) return;
      if (game.locked) {
        game.yaw -= e.movementX * 0.0022;
        game.pitch -= e.movementY * 0.0022;
        clampLook();
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (game.locked) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      game.yaw = -nx * 1.0;
      game.pitch = ny * 0.6;
      clampLook();
    };
    const onPointerDown = () => {
      if (game.mode === "playing" && !game.paused) game.firing = true;
    };
    const onPointerUp = () => {
      game.firing = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        // during play, Esc releases pointer lock → the pause+settings overlay
        // appears (with mute/exit); only fully exit from the game-over screen.
        if (game.mode === "over") stop();
        return;
      }
      if (e.code === "KeyM" && game.mode !== "idle") {
        setMuted((m) => !m);
        return;
      }
      if (e.code === "Space" && game.mode === "playing" && !game.paused) {
        e.preventDefault();
        game.firing = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") game.firing = false;
    };
    const onLockChange = () => {
      game.locked = document.pointerLockElement === canvas;
      if (game.mode === "playing") {
        game.paused = !game.locked && !isTouch;
        setPaused(game.paused);
        if (game.paused) game.firing = false;
      }
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("pointerlockchange", onLockChange);

    // ---------- loop ----------
    const clock = new THREE.Clock();
    let raf = 0;

    const hitPlayer = (e: Enemy, idx: number) => {
      explode(e.mesh.position.clone(), 0xff5a5a, 24, 16);
      removeEnemy(e);
      enemies.splice(idx, 1);
      game.lives = Math.max(0, game.lives - 1);
      setLives(game.lives);
      losePower(); // damage resets a power point
      sfx.hurt();
      if (game.lives <= 0) gameOver();
    };


    // Only burn GPU while the hero is actually on screen and the tab is
    // visible. Scrolling past it (or switching tabs) idles the loop.
    let running = true;
    let onScreen = true;
    const setRunning = (v: boolean) => {
      if (v === running) return;
      running = v;
      if (v) {
        clock.getDelta(); // discard the paused gap so dt doesn't spike
        lastFrameTs = performance.now(); // don't count the pause as a slow frame
        winStart = 0; // restart the FPS measurement window
        raf = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    const applyRunning = () => setRunning(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        applyRunning();
      },
      { threshold: 0.01, rootMargin: "120px" },
    );
    io.observe(mount);
    const onVisibility = () => applyRunning();
    document.addEventListener("visibilitychange", onVisibility);

    // ---------- adaptive FPS limiter ----------
    // Probe what the machine can actually sustain, then lock to it. Fast GPUs
    // stay at 60–120fps; a struggling iGPU settles to a stable lower cap
    // instead of stuttering between 40 and 120. Downward-only: once it steps
    // down it stays there (no oscillation), which is what "lock phù hợp" means.
    const FPS_LADDER = [120, 90, 72, 60, 45, 36, 30];
    let capIdx = lowPower ? 4 : 0; // weak: start at 45 · else discover from 120
    let frameBudget = 1000 / FPS_LADDER[capIdx];
    let lastFrameTs = performance.now();
    let winStart = 0; // measurement window start (0 = warming up)
    let winFrames = 0;
    let winSlow = 0;
    let badWindows = 0;

    const animate = () => {
      if (!running) return;
      raf = requestAnimationFrame(animate);

      const now = performance.now();
      const gap = now - lastFrameTs;
      // Frame pacing: skip this rAF tick if we're ahead of the budget. The 1ms
      // slack keeps us from perpetually landing just under and halving the rate.
      if (gap < frameBudget - 1) return;
      lastFrameTs = now;

      // Measure sustained rate over 1s windows; step the cap down if we keep
      // missing it. Skip the first window as warm-up (compile/upload spikes).
      if (winStart === 0) winStart = now;
      winFrames++;
      if (gap > frameBudget * 1.5) winSlow++;
      if (now - winStart >= 1000) {
        const missRatio = winSlow / Math.max(1, winFrames);
        if (missRatio > 0.25 && capIdx < FPS_LADDER.length - 1) {
          badWindows++;
          if (badWindows >= 2) {
            capIdx++;
            frameBudget = 1000 / FPS_LADDER[capIdx];
            badWindows = 0;
          }
        } else {
          badWindows = 0;
        }
        winStart = now;
        winFrames = 0;
        winSlow = 0;
      }

      const dt = Math.min(clock.getDelta(), 0.05);
      const et = clock.elapsedTime;

      updatePlexus(dt);
      plexus.rotation.z += dt * 0.006;
      // fade the web right down while playing so it never gets mistaken for a target
      const dimmed = game.mode === "playing" || game.mode === "intro";
      linkMat.opacity = dimmed ? 0.045 : 0.12;
      nodeMat.opacity = dimmed ? 0.26 : 0.55;
      starsFar.rotation.y += dt * 0.004;
      starsNear.rotation.y += dt * 0.009;

      core.rotation.y += dt * 0.05;
      coreSphere.rotation.y -= dt * 0.06;
      coreSphere.rotation.x += dt * 0.02;
      core.position.x += (coreTargetX - core.position.x) * Math.min(1, dt * 1.4);
      for (const o of orbiters) {
        o.pivot.rotation.y += dt * o.speed;
        o.body.rotation.x += dt * 0.6;
        o.body.rotation.y += dt * 0.4;
      }

      // ---- spaceship + cockpit ----
      flag.rotation.y = Math.sin(et * 1.6) * 0.35; // flag flutter
      if (game.mode === "idle" || game.mode === "over") {
        ship.visible = game.mode === "idle";
        cockpit.visible = false;
        ship.position.lerp(SHIP_IDLE, Math.min(1, dt * 2));
        ship.position.y = SHIP_IDLE.y + Math.sin(et * 0.8) * 0.5;
        ship.rotation.y = 0.4 + Math.sin(et * 0.3) * 0.25;
        ship.rotation.z = Math.sin(et * 0.5) * 0.06;
        ship.scale.setScalar(1);
      } else if (game.mode === "intro") {
        // fly the ship up to the camera as if you're boarding it
        ship.visible = true;
        cockpit.visible = false;
        const k = Math.min(1, game.introT / INTRO_DUR);
        ship.position.lerp(tmp.set(0, -0.7, 2.4), Math.min(1, dt * 3));
        ship.rotation.y += dt * 1.4;
        ship.scale.setScalar(1 + k * 1.6);
      } else {
        // playing: you're inside — hide the external ship, show the cockpit
        ship.visible = false;
        cockpit.visible = true;
      }

      // ---- satellites crossing the far field (ambient) ----
      satTimer -= dt;
      if (satTimer <= 0 && satellites.length < 2) {
        spawnSatellite();
        satTimer = 7 + Math.random() * 8;
      }
      for (let s = satellites.length - 1; s >= 0; s--) {
        const sat = satellites[s];
        sat.grp.position.add(tmp.copy(sat.vel).multiplyScalar(dt));
        sat.grp.rotation.y += dt * 0.5;
        sat.life += dt;
        if (Math.abs(sat.grp.position.x) > 100 || sat.life > 40) {
          scene.remove(sat.grp);
          satellites.splice(s, 1);
        }
      }

      if (game.mode === "idle") {
        camera.position.x += (0 - camera.position.x) * 0.04;
        camera.rotation.set(0, 0, 0);
        camera.lookAt(0, 0, -40);
      } else if (game.mode === "intro") {
        game.introT += dt;
        const k = Math.min(1, game.introT / INTRO_DUR);
        camera.fov = 72 + Math.sin(k * Math.PI) * 22;
        camera.updateProjectionMatrix();
        camera.position.z = 6 - Math.sin(k * Math.PI) * 3.2;
        camera.rotation.set(0, 0, 0);
        if (k >= 1) {
          camera.fov = 72;
          camera.updateProjectionMatrix();
          camera.position.set(0, 0, 6);
          beginPlaying();
        }
      } else {
        camera.rotation.set(game.pitch, game.yaw, 0);
      }

      if (game.mode === "playing" && !game.paused) {
        // wave lifecycle — upgrade cubes drift by and don't block the wave end
        if (!enemies.some((e) => !e.changer) && !game.betweenWaves) {
          game.betweenWaves = true;
          game.waveTimer = 0;
          showBanner("HẾT ĐỢT ✓", 1400);
        }
        if (game.betweenWaves) {
          game.waveTimer += dt;
          if (game.waveTimer > 1.6) {
            game.betweenWaves = false;
            game.wave += 1;
            setWave(game.wave);
            startWave(game.wave);
            if (game.wave % 5 !== 0) showBanner(`ĐỢT ${game.wave}`);
          }
        }

        // firing
        game.cooldown -= dt;
        if (game.firing && game.cooldown <= 0 && !game.betweenWaves) {
          fire();
          game.cooldown = WEAPON_META[WEAPONS[game.weapon]].rate;
        }

        // enemies approach with slight homing
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          if (e.boss) {
            // boss: advance then hover + strafe in front of the player
            if (e.mesh.position.z < -46) e.mesh.position.z += 16 * dt;
            else {
              e.mesh.position.x = Math.sin(et * 0.6) * 22;
              e.mesh.position.y = 4 + Math.sin(et * 0.9) * 3;
            }
            e.mesh.rotation.y += dt * 0.5;
            e.mesh.rotation.z += dt * 0.2;
          } else if (e.changer) {
            // upgrade cube: cross the view, harmless, despawn off-screen
            e.mesh.position.add(tmp.copy(e.vel).multiplyScalar(dt));
            e.mesh.rotation.x += e.spin.x * dt;
            e.mesh.rotation.y += e.spin.y * dt;
            if (Math.abs(e.mesh.position.x) > 62) {
              removeEnemy(e);
              enemies.splice(i, 1);
            }
          } else {
            // homing steer → damages the player on contact
            tmp.copy(player).sub(e.mesh.position).normalize().multiplyScalar(e.vel.length());
            e.vel.lerp(tmp, Math.min(1, dt * 0.5));
            e.mesh.position.add(right.copy(e.vel).multiplyScalar(dt));
            e.mesh.rotation.x += e.spin.x * dt;
            e.mesh.rotation.y += e.spin.y * dt;
            if (e.mesh.position.z > player.z - 1 || e.mesh.position.distanceTo(player) < e.radius + 1.6) {
              hitPlayer(e, i);
              continue;
            }
            if (e.bar) {
              e.bar.grp.position.set(e.mesh.position.x, e.mesh.position.y + e.radius + 0.8, e.mesh.position.z);
              e.bar.grp.quaternion.copy(camera.quaternion);
              const r = Math.max(0, e.hp / e.maxHp);
              e.bar.fill.scale.x = r;
              e.bar.fill.position.x = -(1 - r) / 2;
            }
          }
        }

        // crosshair hover over an upgrade cube → surface its ammo type
        {
          let hovered: WeaponKind | null = null;
          const changerMeshes: THREE.Object3D[] = [];
          for (const e of enemies) if (e.changer) changerMeshes.push(e.mesh);
          if (changerMeshes.length) {
            raycaster.setFromCamera(CENTER, camera);
            const hits = raycaster.intersectObjects(changerMeshes, true);
            if (hits.length) {
              let o: THREE.Object3D | null = hits[0].object;
              while (o && !o.userData.changerWeapon) o = o.parent;
              if (o) hovered = o.userData.changerWeapon as WeaponKind;
            }
          }
          const label = hovered ? WEAPON_META[hovered].label : null;
          if (label !== lastHover) {
            lastHover = label;
            setHoverAmmo(label);
          }
        }

        // bullets
        for (let bi = bullets.length - 1; bi >= 0; bi--) {
          const b = bullets[bi];
          b.mesh.position.add(tmp.copy(b.dir).multiplyScalar(b.speed * dt));
          b.life += dt;
          if (b.grow > 0) {
            b.size += b.grow * dt; // sound wave expands as it travels
            b.mesh.scale.setScalar(b.size / b.base);
            (b.mesh as THREE.Mesh).rotation.z += dt * 2;
          } else {
            b.mesh.rotation.x += dt * 3; // gentle tumble for poly/sphere bullets
            b.mesh.rotation.y += dt * 2;
          }
          let consumed = false;
          for (let ei = enemies.length - 1; ei >= 0; ei--) {
            const e = enemies[ei];
            if (b.hit.has(e)) continue;
            if (b.mesh.position.distanceTo(e.mesh.position) < e.radius + b.size + 0.7) {
              if (b.aoe > 0) {
                // area damage
                const center = b.mesh.position.clone();
                explode(center, 0xffcf6a, 30, 20);
                for (let k = enemies.length - 1; k >= 0; k--) {
                  if (enemies[k].mesh.position.distanceTo(center) < b.aoe) damageEnemy(k, b.dmg, enemies[k].mesh.position.clone());
                }
                consumed = true;
              } else {
                b.hit.add(e);
                damageEnemy(ei, b.dmg, b.mesh.position.clone());
                if (!b.pierce) consumed = true;
              }
              break;
            }
          }
          if (consumed || b.life > 2.8) {
            scene.remove(b.mesh);
            bullets.splice(bi, 1);
          }
        }
      }

      // sparks
      for (let si = sparks.length - 1; si >= 0; si--) {
        const s = sparks[si];
        s.life += dt;
        const arr = s.points.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let k = 0; k < arr.count; k++) {
          arr.setX(k, arr.getX(k) + s.velocities[k * 3] * dt);
          arr.setY(k, arr.getY(k) + s.velocities[k * 3 + 1] * dt);
          arr.setZ(k, arr.getZ(k) + s.velocities[k * 3 + 2] * dt);
        }
        arr.needsUpdate = true;
        (s.points.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - s.life / s.max);
        if (s.life >= s.max) {
          scene.remove(s.points);
          s.points.geometry.dispose();
          (s.points.material as THREE.Material).dispose();
          sparks.splice(si, 1);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(bannerTimeout);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerlockchange", onLockChange);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      if (document.pointerLockElement === canvas) document.exitPointerLock?.();
      clearGameObjects();
      enemyEdgeGeoCache.clear();
      bulletGeoCache.clear();
      bulletMatCache.clear();
      for (const d of disposables) d.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
     
  }, []);

  const inGame = phase === "playing" || phase === "over" || phase === "intro";
  const scrollHint = lang === "vi" ? "Cuộn xuống để khám phá" : "Scroll to explore";

  return (
    <section id="home" className="dark relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#05060d]">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(3,4,10,0.6)_100%)]" />

      {/* ---------- IDLE ---------- */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none relative z-20 flex flex-col items-center px-6 text-center"
          >
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative mb-7 h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36">
              <div className="absolute -inset-3 rounded-full bg-[#ff5a2a]/25 blur-2xl" />
              <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#ff5a2a]/40 shadow-[0_0_45px_rgba(0,0,0,0.6)]">
                <Image src="/avatar.jpg" alt={fullName} fill sizes="144px" className="object-cover" priority />
              </div>
            </motion.div>
            <span className="mb-4 font-mono text-[11px] uppercase tracking-[0.5em] text-[#ff9a5c]/80">{`// portfolio.exe`}</span>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">{fullName}</h1>
            <p className="mt-4 text-lg font-semibold tracking-wide text-[#ff9a5c] sm:text-xl md:text-2xl">{profile.role}</p>
            <p className="mt-3 flex min-h-[1.6rem] max-w-xl items-center justify-center font-mono text-sm text-white/65 sm:text-base">
              {typedSlogan}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#ff9a5c]" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* scroll-down call to action */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">{scrollHint}</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} className="text-[#ff9a5c]/70">
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "idle" && siteConfig.features.game && (
        <motion.button
          type="button"
          onClick={handleStart}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Play space shooter"
          className="group absolute bottom-6 left-6 z-30 flex items-center gap-2 rounded-full border border-[#ff5a2a]/40 bg-[#ff5a2a]/10 px-4 py-2.5 text-[#ff9a5c] shadow-[0_0_25px_rgba(57,201,232,0.2)] backdrop-blur-md transition-colors hover:bg-[#ff5a2a]/20"
        >
          <Play className="h-4 w-4 fill-[#ff9a5c] text-[#ff9a5c]" />
          <span className="text-xs font-semibold tracking-wide">Play</span>
        </motion.button>
      )}

      {/* ---------- COCKPIT + HUD ---------- */}
      {inGame && (
        <>
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="absolute inset-3 rounded-[2rem] border border-[#ff5a2a]/15 sm:inset-5" />
            <span className="absolute left-5 top-5 h-6 w-6 border-l-2 border-t-2 border-[#ff5a2a]/40" />
            <span className="absolute right-5 top-5 h-6 w-6 border-r-2 border-t-2 border-[#ff5a2a]/40" />
            <span className="absolute bottom-5 left-5 h-6 w-6 border-b-2 border-l-2 border-[#ff5a2a]/40" />
            <span className="absolute bottom-5 right-5 h-6 w-6 border-b-2 border-r-2 border-[#ff5a2a]/40" />
          </div>

          {/* crosshair */}
          {phase !== "over" && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-9 w-9">
                <span className="absolute left-1/2 top-0 h-3 w-[2px] -translate-x-1/2 bg-[#ff9a5c]" />
                <span className="absolute bottom-0 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-[#ff9a5c]" />
                <span className="absolute left-0 top-1/2 h-[2px] w-3 -translate-y-1/2 bg-[#ff9a5c]" />
                <span className="absolute right-0 top-1/2 h-[2px] w-3 -translate-y-1/2 bg-[#ff9a5c]" />
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff9a5c]" />
              </div>
            </div>
          )}

          {/* upgrade-cube hover: show which ammo it grants */}
          <AnimatePresence>
            {phase === "playing" && hoverAmmo && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 mt-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#ff5a2a]/40 bg-black/60 px-3 py-1.5 backdrop-blur-md"
              >
                <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#ff9a5c]">
                  <ArrowBigUpDash className="h-4 w-4" /> NÂNG CẤP · {hoverAmmo}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* stats */}
          <div className="absolute left-4 top-4 z-30 flex items-center gap-4 rounded-full border border-[#ff5a2a]/20 bg-black/50 px-4 py-2 text-white backdrop-blur-md">
            <span className="font-mono text-sm"><span className="text-white/50">WAVE</span> <span className="font-bold text-[#ff9a5c]">{wave}</span></span>
            <span className="font-mono text-sm"><span className="text-white/50">SCORE</span> <span className="font-bold text-[#ff9a5c]">{score}</span></span>
            <span className="flex items-center gap-1">
              {Array.from({ length: Math.max(MAX_LIVES, lives) }).map((_, i) => (
                <Heart key={i} className={`h-4 w-4 ${i < lives ? "fill-[#ff9a5c] text-[#ff9a5c]" : "text-white/20"}`} />
              ))}
            </span>
          </div>

          <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
              title={muted ? "Bật tiếng (M)" : "Tắt tiếng (M)"}
              className="flex items-center rounded-full border border-[#ff5a2a]/20 bg-black/50 p-2 text-white/80 backdrop-blur-md transition-colors hover:bg-white/10"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button type="button" onClick={handleStop} className="flex items-center gap-1.5 rounded-full border border-[#ff5a2a]/20 bg-black/50 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/10">
              <X className="h-4 w-4" /> Exit
            </button>
          </div>

          {/* boss HP */}
          <AnimatePresence>
            {bossHp !== null && phase === "playing" && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-16 z-30 w-64 -translate-x-1/2">
                <div className="mb-1 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff9a5c]">
                  <Zap className="h-3.5 w-3.5" /> BOSS
                </div>
                <div className="h-2 overflow-hidden rounded-full border border-[#ff5a2a]/30 bg-black/50">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#ff5a2a] to-[#ff9a5c] transition-[width] duration-200" style={{ width: `${bossHp * 100}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* weapon + power */}
          {phase === "playing" && (
            <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
              <div className="flex items-center gap-3 rounded-full border border-[#ff5a2a]/20 bg-black/55 px-4 py-2 backdrop-blur-md">
                <span className="font-mono text-xs font-bold tracking-wider text-[#ff9a5c]">{WEAPON_META[weapon].label}</span>
                <span className="text-white/20">|</span>
                <span className="font-mono text-xs text-white/50">PWR</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: MAX_POWER }).map((_, i) => (
                    <span key={i} className={`h-3 w-1 rounded-sm ${i < power ? "bg-[#ff9a5c]" : "bg-white/15"}`} />
                  ))}
                </span>
                <span className="font-mono text-[11px] text-white/40">×{salvoOf(power)}</span>
              </div>
              <span className="rounded-full bg-black/30 px-3 py-1 text-[11px] text-white/55 backdrop-blur-md">
                Di chuột để ngắm · Giữ Space để bắn · Thiên thạch cam vô hại — bắn hoặc bay vào để đổi đạn
              </span>
            </div>
          )}

          {/* wave banner */}
          <AnimatePresence>
            {banner && phase === "playing" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pointer-events-none absolute left-1/2 top-1/3 z-30 -translate-x-1/2 text-center"
              >
                <span className="font-mono text-2xl font-black uppercase tracking-[0.3em] text-[#ff9a5c] drop-shadow-[0_0_20px_rgba(57,201,232,0.5)]">
                  {banner}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* intro */}
          <AnimatePresence>
            {phase === "intro" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                <Rocket className="mb-4 h-10 w-10 animate-pulse text-[#ff9a5c]" />
                <p className="font-mono text-sm uppercase tracking-[0.4em] text-white/80">Đang phóng tàu…</p>
                <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full bg-[#ff9a5c]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: INTRO_DUR, ease: "easeInOut" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* paused */}
          <AnimatePresence>
            {paused && phase === "playing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/55 backdrop-blur-sm">
                <MousePointer2 className="mb-3 h-9 w-9 text-[#ff9a5c]" />
                <p className="mb-4 text-white/80">Tạm dừng</p>
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <button type="button" onClick={handleResume} className="rounded-full bg-[#ff9a5c] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95">
                    Nhấp để tiếp tục
                  </button>
                  <button type="button" onClick={() => setMuted((m) => !m)} className="flex items-center gap-1.5 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10">
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    {muted ? "Bật tiếng" : "Tắt tiếng"}
                  </button>
                  <button type="button" onClick={handleStop} className="flex items-center gap-1.5 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10">
                    <X className="h-4 w-4" /> Thoát
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ---------- GAME OVER ---------- */}
      <AnimatePresence>
        {phase === "over" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <Rocket className="mb-4 h-12 w-12 text-[#ff9a5c]" />
            <h3 className="text-3xl font-black text-white">Game Over</h3>
            <p className="mt-2 text-white/70">
              Đợt <span className="font-bold text-[#ff9a5c]">{wave}</span> · Điểm <span className="font-bold text-[#ff9a5c]">{score}</span>
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={handleStart} className="flex items-center gap-2 rounded-full bg-[#ff9a5c] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95">
                <RotateCcw className="h-4 w-4" /> Chơi lại
              </button>
              <button type="button" onClick={handleStop} className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                <X className="h-4 w-4" /> Thoát
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
