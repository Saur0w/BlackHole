"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 6000;
const EVENT_HORIZON_RADIUS = 3.5;
const DISK_INNER_RADIUS = 4.5;
const DISK_OUTER_RADIUS = 9;

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<Particle[]>([]);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spawn particles from all directions
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 18;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 12;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Black particles
      const shade = 0.03 + Math.random() * 0.04;
      colors[i * 3] = shade;
      colors[i * 3 + 1] = shade;
      colors[i * 3 + 2] = shade;

      // Velocity towards center with some randomness
      const toCenter = new THREE.Vector3(-x, 0, -z).normalize();
      const speed = 1.5 + Math.random() * 1;

      particlesRef.current.push({
        position: new THREE.Vector3(x, y, z),
        velocity: toCenter.multiplyScalar(speed),
      });
    }

    return { positions, colors };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const particles = particlesRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = particles[i];
      const pos = particle.position;
      const vel = particle.velocity;

      const distXZ = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
      const distToCenter = pos.length();
      const normalizedY = pos.y / (distXZ + 0.1);

      // Bend around accretion disk
      if (distToCenter > EVENT_HORIZON_RADIUS * 0.8) {
        // Direction to center
        const toCenter = new THREE.Vector3(-pos.x, -pos.y, -pos.z).normalize();

        // Strong gravity
        const gravity = 40 / (distToCenter * distToCenter);

        // In accretion disk zone - bend trajectory
        if (distXZ > DISK_INNER_RADIUS && distXZ < DISK_OUTER_RADIUS) {
          // Calculate tangent for orbital motion
          const tangent = new THREE.Vector3(-pos.z, 0, pos.x).normalize();

          // How much to bend (stronger when closer to disk)
          const bendStrength = Math.max(0, 1 - (distXZ - DISK_INNER_RADIUS) / (DISK_OUTER_RADIUS - DISK_INNER_RADIUS));
          const orbitalForce = bendStrength * 2.5 / distXZ;

          // Apply forces: pull to center + orbital tangent
          const force = toCenter.clone().multiplyScalar(gravity * 0.5);
          force.add(tangent.multiplyScalar(orbitalForce));

          vel.add(force.multiplyScalar(delta));

          // Gradually align Y with disk plane
          vel.y -= pos.y * 0.02;
        } else if (distXZ >= DISK_OUTER_RADIUS) {
          // Outside disk - mostly pull towards center
          vel.add(toCenter.multiplyScalar(gravity * delta));
        } else {
          // Inside disk zone but close to center - strong pull
          vel.add(toCenter.multiplyScalar(gravity * 1.5 * delta));
        }
      }

      // Cap velocity
      const speed = vel.length();
      if (speed > 6) vel.multiplyScalar(6 / speed);
      if (speed < 0.5) {
        const dir = vel.clone().normalize();
        vel.copy(dir.multiplyScalar(0.5));
      }

      pos.add(vel.clone().multiplyScalar(delta));

      // Respawn if swallowed or escaped
      if (distToCenter < EVENT_HORIZON_RADIUS * 0.7 || distToCenter > 30) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 15 + Math.random() * 10;
        pos.set(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 10,
          Math.sin(angle) * radius
        );

        const toCenter = new THREE.Vector3(-pos.x, 0, -pos.z).normalize();
        vel.copy(toCenter.multiplyScalar(1.5 + Math.random() * 1));
      }

      posAttr.setXYZ(i, pos.x, pos.y, pos.z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
      />
    </points>
  );
}
