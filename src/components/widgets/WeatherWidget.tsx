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
            <div className="w-full rounded-xl shadow-lg bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 flex flex-col items-center animate-pulse">
                <p className="text-sm text-gray-400 dark:text-gray-500">Loading weather...</p>
            </div>
        );
    if (error)
        return (
            <div className="w-full rounded-xl shadow-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 flex flex-col items-center">
                <p className="text-sm text-red-500">Error: {error}</p>
            </div>
        );

    const { name, weather, main, wind } = data;
    const weatherInfo = weather[0];
    const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png`;

    return (
        <div className="w-full rounded-2xl shadow-xl bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3">
            {/* Weather Icon */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <img
                    src={iconUrl}
                    alt={weatherInfo.description}
                    className="w-full h-full object-contain drop-shadow-lg"
                />
                <span className="absolute bottom-0 right-0 bg-white/80 dark:bg-gray-700/80 rounded-full px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-200 shadow">
                    {weatherInfo.main}
                </span>
            </div>

            {/* City Name */}
            <h3 className="text-lg sm:text-2xl font-bold tracking-wide text-blue-900 dark:text-blue-200 mb-1">
                {name}
            </h3>
            {/* Description */}
            <p className="capitalize text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-2">
                {weatherInfo.description}
            </p>

            {/* Temperature */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl sm:text-4xl font-extrabold text-blue-800 dark:text-blue-100">
                    {Math.round(main.temp)}°C
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Feels like {Math.round(main.feels_like)}°C
                </span>
            </div>

            {/* Details */}
            <div className="flex justify-between w-full text-xs text-gray-600 dark:text-gray-400">
                <div className="flex flex-col items-center flex-1">
                    <span className="font-semibold">Humidity</span>
                    <span>{main.humidity}%</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                    <span className="font-semibold">Wind</span>
                    <span>{wind.speed} m/s</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                    <span className="font-semibold">Pressure</span>
                    <span>{main.pressure} hPa</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
