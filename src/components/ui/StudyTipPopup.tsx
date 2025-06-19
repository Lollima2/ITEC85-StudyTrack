import React, { useEffect, useState } from 'react';
import { Button } from "@heroui/react";

const studyTips = [
  "Basahin mo 'yung notes mo parang chismis—paulit-ulit at may feelings!",
  "Mag-reward ka ng snacks kada tapos ng topic… wag lang kada word.",
  "Ang tunay na multitasking: aral habang niluluto ang kanin.",
  "Tubig lang sapat na... pero kung kape ‘yan, walang judgment. Laban lang, future professional!",
  "TikTok ka ng TikTok, baka yang ‘For You’ page mo na lang ang may plano sa buhay.",
  "Aral muna bago ka magpa-‘I deserve’ ng milk tea at Shopee budol.",
  "Sabi mo ‘study time’ pero ‘bebe time’ pala. Nag-review ka ba o nag-recharge?",
  "Study tip: Wag mong gawing timer ang pagtimpla ng 3-in-1. Di ka pa tapos magbasa, ubos na ‘yan.",
  "Nagbabalak ka pa lang magbasa, pero 11:59pm na. CRAM MODE: ACTIVATED.",
  "Study tip: Pag sinabi mong ‘last video na’, dapat hindi umabot sa sunrise.",
  "Nag-Pomodoro ka nga, pero yung 5 mins break naging 5 episodes.",
  "You can’t manifest a passing grade kung wala kang binasa.",
  "Aral muna bago mag-senti. Hindi pwedeng feelings ang i-submit sa finals.",
  "Study tip: ‘Wag kang ma-fall sa groupmate mong ‘good morning’ lang ang ambag."
];

const StudyTipPopup = () => {
  const [visible, setVisible] = useState(true);
  const [randomTip, setRandomTip] = useState('');
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const tip = studyTips[Math.floor(Math.random() * studyTips.length)];
    setRandomTip(tip);
  }, []);

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/80 dark:bg-[#0a1624]/80
        transition-opacity duration-300
        ${animateOut ? 'opacity-0' : 'opacity-100'}
        backdrop-blur-sm
      `}
    >
      <div
        className={`
          rounded-3xl p-0 max-w-lg w-full shadow-2xl
          transform transition-all duration-300
          ${animateOut ? 'scale-95 opacity-0 translate-y-8' : 'scale-100 opacity-100 translate-y-0'}
          bg-gradient-to-br from-white to-sky-100 dark:from-[#181f2a] dark:to-[#232e3e]
          border border-sky-200 dark:border-none
        `}
      >
        {/* Top Bar with Icon and Close */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-[#38BDF8] to-[#027BF9] rounded-full p-2 shadow-lg shadow-[#027BF9]/40">
              <svg width="32" height="32" fill="none" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="study-tip-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#027BF9" />
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="24" fill="url(#study-tip-gradient)" opacity="0.95" />
                <path d="M24 14v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="24" cy="32" r="1.5" fill="#fff" />
              </svg>
            </div>
            <span
              className="text-lg font-bold tracking-wide text-[#027BF9]"
              style={{
                textShadow: '0 1px 2px rgba(2, 123, 249, 0.5)' // subtle glow
              }}
            >
              Study Tip
            </span>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="rounded-full p-2 hover:bg-sky-100 dark:hover:bg-[#232e3e] transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* Tip Content */}
        <div className="px-8 pb-8 pt-2 flex flex-col items-center">
          <p
            className="text-base md:text-lg text-center italic mb-8 text-slate-700 dark:text-sky-100"
            style={{
              textShadow: '0 1px 2px rgba(56, 189, 248, 0.3)', // lighter, more subtle glow
              lineHeight: 1.6,
              letterSpacing: '0.01em',
            }}
          >
            {randomTip}
          </p>
          <Button
            className="bg-gradient-to-tr from-circle1 to-circle2 text-white shadow-lg mt-6 font-medium"
            radius="full"
            onClick={handleClose}
          >
            OK, Got it!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudyTipPopup;
