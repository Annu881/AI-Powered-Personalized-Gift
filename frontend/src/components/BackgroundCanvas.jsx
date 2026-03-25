import React, { useEffect, useRef } from 'react';

const BackgroundCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let W, H;

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.r = Math.random() * 1.4 + 0.2;
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = -Math.random() * 0.35 - 0.08;
                this.a = Math.random() * 0.45 + 0.08;
                this.c = Math.random() < 0.5 ? '240,208,96' : Math.random() < 0.5 ? '168,85,247' : '34,211,238';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.a -= 0.001;
                if (this.a <= 0 || this.y < 0) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.a;
                ctx.fillStyle = `rgb(${this.c})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const pts = [];
        for (let i = 0; i < 90; i++) pts.push(new Particle());

        const glows = [
            { x: 0.2, y: 0.35, r: 280, c: '240,208,96', a: 0.04, s: 0.0004 },
            { x: 0.8, y: 0.25, r: 230, c: '168,85,247', a: 0.04, s: -0.0003 },
            { x: 0.5, y: 0.75, r: 190, c: '34,211,238', a: 0.025, s: 0.0005 }
        ];

        let tt = 0;
        const drawBg = () => {
            ctx.clearRect(0, 0, W, H);
            tt += 0.5;
            glows.forEach(g => {
                const ox = Math.sin(tt * g.s * 1000) * 65;
                const oy = Math.cos(tt * g.s * 800) * 45;
                const gr = ctx.createRadialGradient(g.x * W + ox, g.y * H + oy, 0, g.x * W + ox, g.y * H + oy, g.r);
                gr.addColorStop(0, `rgba(${g.c},${g.a})`);
                gr.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gr;
                ctx.fillRect(0, 0, W, H);
            });
            pts.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(drawBg);
        };

        drawBg();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default BackgroundCanvas;
