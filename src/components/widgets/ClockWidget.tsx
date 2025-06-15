import React, { useEffect, useState } from 'react';

const ClockWidget: React.FC = () => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className="
                flex flex-col items-center justify-center
                px-8 py-6 rounded-xl min-w-[200px]
                font-mono text-2xl tracking-wide select-none
                text-[#232526] dark:text-white
            "
        >
            <div className="flex flex-row gap-2 mb-1 items-center">
                <span className="text-sm opacity-85">
                    {now.toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className="mx-1 text-xs opacity-50">|</span>
                <span className="text-sm opacity-70">
                    {now.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                </span>
            </div>
            <span className="drop-shadow text-4xl font-bold">
                {now.toLocaleTimeString()}
            </span>
        </div>
    );
};

export default ClockWidget;
