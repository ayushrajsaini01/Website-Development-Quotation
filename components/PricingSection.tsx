"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";

export default function PricingSection() {
  const [mode, setMode] = useState("new");
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    gsap.from(".card", {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({ size: 0.02 });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  const handleWhatsApp = (plan) => {
    const rawMessage = `Hi, I'm interested in your ${plan.title} (Price: ${plan.price}) package. Please share more details.`;
    const encodedMessage = encodeURIComponent(rawMessage);

    // Use more reliable WhatsApp API URL
    const url = `https://api.whatsapp.com/send?phone=918434575879&text=${encodedMessage}`;

    // Open in new tab (prevents blocking issues)
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const plans = [
    {
      title: "Basic Website",
      price: "₹49,999",
      features: [
        "3–5 Pages",
        "Modern UI Design",
        "Basic Animations",
        "Mobile Responsive",
        "2–3 Weeks Delivery",
        "Unlimited changes until you are happy",
      ],
    },
    {
      title: "Cinematic 3D Website",
      price: "₹99,999",
      recommended: true,
      features: [
        "Custom UI/UX",
        "3D Camera Effects",
        "Parallax Scrolling",
        "Motion Graphics",
        "Glassmorphism",
        "4–6 Weeks Delivery",
        "Unlimited changes until you are happy",
      ],
    },
    {
      title: "Elite Production",
      price: "₹1,49,000",
      features: [
        "Everything in Cinematic",
        "Advanced 3D Storytelling",
        "Morph Animations",
        "Interactive Scenes",
        "Backend (Optional)",
        "6–8 Weeks Delivery",
        "Unlimited changes until you are happy",
      ],
    },
  ];

  const handleTilt = (e, el) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * 10;
    const rotateY = ((x / rect.width) - 0.5) * -10;

    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const resetTilt = (el) => {
    el.style.transform = "rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white flex flex-col items-center py-20 px-4 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight text-center">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 mb-10 text-center max-w-xl">
          Premium cinematic web experiences designed to elevate your brand.
        </p>

        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={mode === "new" ? "text-white" : "text-gray-500"}>
            New Project
          </span>
          <button
            onClick={() => setMode(mode === "new" ? "maintain" : "new")}
            className="w-16 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full relative"
          >
            <motion.div
              layout
              className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full absolute top-0.5 shadow-lg"
              style={{ left: mode === "new" ? 3 : 34 }}
            />
          </button>
          <span className={mode === "maintain" ? "text-white" : "text-gray-500"}>
            Maintenance
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="relative group card"
              onMouseMove={(e) => handleTilt(e, e.currentTarget)}
              onMouseLeave={(e) => resetTilt(e.currentTarget)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition"></div>

              <div className="relative rounded-2xl p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition">
                {plan.recommended && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-xs px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  {plan.price}
                </p>

                <ul className="space-y-2 text-gray-300 mb-6 text-sm">
                  {plan.features.map((f, idx) => (
                    <li key={idx}>✔ {f}</li>
                  ))}
                </ul>

                <button
                  onClick={() => handleWhatsApp(plan)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:opacity-90"
                >
                  Start Your Project
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl text-center mt-16 text-gray-400 leading-relaxed">
          <p>
            We propose to design and develop a professional, fully responsive website tailored to your business needs, with a strong emphasis on performance, seamless user experience, and modern design standards.
          </p>
          <p className="mt-4">
            As specialists in advanced web experiences, we excel in creating visually stunning websites using cutting-edge 3D camera tracking, immersive parallax effects, and high-quality 3D motion graphics.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm border-t border-white/10 pt-6 w-full max-w-6xl">
          © 2026 India Voltoro.tech — All Rights Reserved
        </div>
      </div>
    </div>
  );
}
