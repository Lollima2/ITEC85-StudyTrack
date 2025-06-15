import React, { useEffect, useState } from 'react';

const WeatherWidget: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const key = '72e0c4ef76fc14fb342c2990d0a32cf6';
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=14.1953&lon=120.8782&units=metric&appid=${key}`
                );
                if (!response.ok) throw new Error('Failed to fetch weather data');
                const json = await response.json();
                setData(json);
            } catch (err: any) {
                setError(err.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading)
        return (
            <div className="w-full rounded-xl shadow-lg bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 flex flex-col items-center animate-pulse">
                <p className="text-sm text-gray-400 dark:text-gray-500">Loading weather...</p>
            </div>
        );

    if (error)
        return (
            <div className="w-full rounded-xl shadow-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-gray-800 dark:to-gray-900 p-6 flex flex-col items-center">
                <p className="text-sm text-red-500">Error: {error}</p>
            </div>
        );

    const { name, weather, main, wind, dt } = data;
    const weatherInfo = weather[0];
    const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png`;

    const date = new Date(dt * 1000);
    const formattedDate = date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="w-full h-full rounded-2xl shadow-xl bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 flex flex-col items-center justify-between gap-4">
            {/* Top: Icon and Basic Info */}
            <div className="flex items-center gap-4 w-full">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    <img
                        src={iconUrl}
                        alt={weatherInfo.description}
                        className="w-full h-full object-contain drop-shadow"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-white/80 dark:bg-gray-700/80 rounded-full px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-100 shadow">
                        {weatherInfo.main}
                    </span>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">{name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{formattedDate}</p>
                    <p className="capitalize text-sm text-gray-700 dark:text-gray-300">{weatherInfo.description}</p>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-blue-300 dark:border-gray-700" />

            {/* Temperature */}
            <div className="flex flex-col items-center w-full">
                <span className="text-3xl sm:text-5xl font-extrabold text-blue-800 dark:text-blue-100">
                    {Math.round(main.temp)}°C
                </span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Feels like {Math.round(main.feels_like)}°C
                </span>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-blue-300 dark:border-gray-700" />

            {/* Weather Stats */}
            <div className="grid grid-cols-3 gap-2 w-full text-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <div>
                    <span className="block font-semibold">Humidity</span>
                    <span>{main.humidity}%</span>
                </div>
                <div>
                    <span className="block font-semibold">Wind</span>
                    <span>{wind.speed} m/s</span>
                </div>
                <div>
                    <span className="block font-semibold">Pressure</span>
                    <span>{main.pressure} hPa</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
