"use client";

import styles from "./style.module.scss";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("./scene"), { ssr: false });

export default function Landing() {
    return (
        <section className={styles.landing}>
            <Scene />
        </section>
    );
}