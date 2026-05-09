"use client";

import { Canvas } from "@react-three/fiber";
import Blackhole from "./Blackhole";

export default function Scene() {
    return (
        <Canvas
            camera={{
                position: [0, 8, 20],
                fov: 60,
            }}
        >
            <color attach="background" args={["#ffffff"]} />
            <ambientLight intensity={0.5} />

            <Blackhole position={[0, 0, 0]} />
        </Canvas>
    );
}