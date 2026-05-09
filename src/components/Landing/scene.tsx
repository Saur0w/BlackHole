"use client";

import Blackhole from "./Blackhole";
import Particles from "./Particles";
import { Canvas } from "@react-three/fiber";

export default function Scene() {
    return (
        <Canvas
            camera={{
                position: [0, 0, 15],
                fov: 50,
            }}
        >
            <color attach="background" args={["#ffffff"]} />
            <ambientLight intensity={0.5} />

            <Blackhole position={[0, 0, 0]} />
            <Particles />
        </Canvas>
    );
}