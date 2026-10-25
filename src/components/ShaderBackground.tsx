import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Theme } from "../lib/theme";

// Pastelowe palety w stylu Arc – po 4 kolory na motyw.
const PALETTES: Record<Theme, string[]> = {
  light: ["#f6f4fc", "#d4c7ff", "#ffd3ea", "#c4e8ff"],
  dark: ["#0c0b14", "#4630a8", "#76245f", "#164f88"],
};

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Mesh gradient: kilka warstw szumu z „domain warping”, przesuwanych w czasie,
// miesza 4 kolory. Kursor delikatnie odpycha/zawija gradient wokół siebie.
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uRes;
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);

    // Miękkie zawirowanie wokół kursora
    vec2 d = p - m;
    float infl = exp(-dot(d, d) * 4.0);
    p += normalize(d + 1e-4) * infl * 0.08;

    // Niska częstotliwość + łagodny warp = duże, miękkie plamy koloru
    float t = uTime * 0.04;
    vec2 q = vec2(snoise(p * 0.45 + t), snoise(p * 0.45 - t + 4.2));

    float n1 = smoothstep(-0.7, 1.0, snoise(p * 0.55 + q * 0.5 + vec2(t, 0.0)));
    float n2 = smoothstep(-0.6, 1.0, snoise(p * 0.5 - q * 0.45 + vec2(3.3, -t)));
    float n3 = smoothstep(-0.5, 1.1, snoise(p * 0.4 + q * 0.6 - 7.1));

    vec3 col = uC0;
    col = mix(col, uC1, n1 * 0.8);
    col = mix(col, uC2, n2 * 0.65);
    col = mix(col, uC3, n3 * 0.6);

    // Delikatne podświetlenie pod kursorem
    col += infl * 0.04;

    // Lekka winieta, żeby środek był czytelny
    float vig = smoothstep(1.25, 0.2, length(uv - 0.5));
    col = mix(uC0, col, 0.55 + vig * 0.45);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function GradientPlane({ theme, still }: { theme: Theme; still: boolean }) {
  const { size } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.6));
  const target = useRef(new THREE.Vector2(0.5, 0.6));

  const uniforms = useMemo(() => {
    const [c0, c1, c2, c3] = PALETTES[theme].map((c) => new THREE.Color(c));
    return {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.6) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uC0: { value: c0 },
      uC1: { value: c1 },
      uC2: { value: c2 },
      uC3: { value: c3 },
    };
    // Paleta startowa ustawiana raz – dalej kolory są płynnie przenikane w useFrame.
  }, []);

  const targets = useMemo(() => PALETTES[theme].map((c) => new THREE.Color(c)), [theme]);

  useFrame(({ pointer }, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    if (!still) u.uTime.value += delta;
    u.uRes.value.set(size.width, size.height);

    target.current.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    mouse.current.lerp(target.current, 1 - Math.pow(0.02, delta));
    u.uMouse.value.copy(mouse.current);

    const k = 1 - Math.pow(0.05, delta);
    (["uC0", "uC1", "uC2", "uC3"] as const).forEach((key, i) => {
      (u[key].value as THREE.Color).lerp(targets[i], k);
    });
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ShaderBackground({ theme, still }: { theme: Theme; still: boolean }) {
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <GradientPlane theme={theme} still={still} />
      </Canvas>
    </div>
  );
}
