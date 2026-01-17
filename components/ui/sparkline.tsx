"use client";

import { motion } from "framer-motion";

interface SparklineProps {
    data: number[];
    color?: string;
}

export function Sparkline({ data, color = "#208099" }: SparklineProps) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 100;
    const height = 40;

    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / (range || 1)) * height,
    }));

    const pathData = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;

    return (
        <div className="w-24 h-10">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full"
                preserveAspectRatio="none"
            >
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </svg>
        </div>
    );
}
