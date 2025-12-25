import * as THREE from 'three';

export interface ShaderUniforms {
  uTime: THREE.IUniform<number>;
  uResolution: THREE.IUniform<THREE.Vector2>;
  uColors: THREE.IUniform<THREE.Vector3[]>;
  uWeights: THREE.IUniform<number[]>;
  uBlur: THREE.IUniform<number>;
}

export interface ColorExtractionParams {
  minLightness: number;      // default: 0.2
  muddyThreshold: number;    // default: 0.25
  accentThreshold: number;   // default: 0.5
}
