import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const onMouseDown = () => setIsActive(true);
        const onMouseUp = () => setIsActive(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    useEffect(() => {
        let frameId;
        const smoothRing = () => {
            setRingPosition((prev) => ({
                x: prev.x + (position.x - prev.x) * 0.12,
                y: prev.y + (position.y - prev.y) * 0.12,
            }));
            frameId = requestAnimationFrame(smoothRing);
        };
        frameId = requestAnimationFrame(smoothRing);
        return () => cancelAnimationFrame(frameId);
    }, [position]);

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    left: position.x,
                    top: position.y,
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#f0d060',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    transform: `translate(-50%, -50%) scale(${isActive ? 1.8 : 1})`,
                    mixBlendMode: 'difference',
                    transition: 'transform 0.1s',
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    left: ringPosition.x,
                    top: ringPosition.y,
                    width: '28px',
                    height: '28px',
                    border: '1px solid rgba(240, 208, 96, 0.5)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 99998,
                    transform: `translate(-50%, -50%) scale(${isActive ? 0.6 : 1})`,
                    transition: 'all 0.12s ease',
                    mixBlendMode: 'difference',
                }}
            />
        </>
    );
};

export default CustomCursor;
