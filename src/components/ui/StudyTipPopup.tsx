import React, { useEffect, useState } from 'react';

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
      className={`fixed inset-0 bg-black bg-opacity-40 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ${
        animateOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-green-200 dark:border-green-700
        transform transition-all duration-300
        ${animateOut ? 'scale-95 opacity-0 translate-y-8' : 'scale-100 opacity-100 translate-y-0'}
        `}
        style={{
          boxShadow:
            '0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 4px 0 rgba(0,0,0,0.08)'
        }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="24" fill="#22C55E" opacity="0.15"/>
              <path d="M24 14v12" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="32" r="1.5" fill="#22C55E"/>
            </svg>
          </div>
          <p className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Study Tip
          </p>
          <p className="text-base mb-8 text-gray-700 italic dark:text-gray-300">{randomTip}</p>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
          >
            OK, Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyTipPopup;
