export const blackholeVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const blackholeFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  uniform float uTime;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = 1.0 - abs(dot(vNormal, viewDir));
    fresnel = pow(fresnel, 2.0);

    // Pure black core with subtle dark grey rim
    float shade = fresnel * 0.2;
    gl_FragColor = vec4(vec3(shade), 1.0);
  }
`;

export const diskVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const diskFragmentShader = `
  varying vec2 vUv;

  uniform float uTime;

  void main() {
    vec2 center = vec2(0.5);
    float dist = distance(vUv, center);

    // Thin disk ring
    float innerRadius = 0.08;
    float outerRadius = 0.48;

    if (dist > outerRadius || dist < innerRadius) {
      discard;
    }

    // Brightness: hotter near inner edge
    float intensity = smoothstep(outerRadius, innerRadius, dist);
    intensity = pow(intensity, 0.5);

    // Rotation swirl
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float spiral = sin(angle * 4.0 - uTime * 1.5 + dist * 15.0) * 0.15 + 0.85;

    // Dark grey for disk
    float brightness = intensity * spiral * 0.35;
    gl_FragColor = vec4(vec3(brightness), intensity * 0.5);
  }
`;
