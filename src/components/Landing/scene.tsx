"use client";

import Mesh from "./mesh";
import { Canvas } from "@react-three/fiber";

export default function Scene() {
    return (
        <Canvas
            camera={{
                position: [0, 0, 5], 
                fov: 60,             
            }}
        >
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <pointLight position={[-5, -5, -5]} intensity={1} />

            <Mesh />
        </Canvas>
    );
}