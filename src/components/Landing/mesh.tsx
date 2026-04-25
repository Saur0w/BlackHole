"use client";

import {} from "@react-three/fiber";

export default function Mesh() {
    return (
        <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                color="#050505"
                metalness={1}
                roughness={0.1}
            />
        </mesh>
    );
}