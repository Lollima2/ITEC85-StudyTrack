    const SpotifyWidget = () => {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="p-4 w-full max-w-md flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center w-full">
                        <div className="flex items-center gap-2 mb-3">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                                alt="Spotify Logo"
                                className="w-8 h-8"
                            />
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Spotify Player
                            </span>
                        </div>
                        <iframe
                            src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
                            width="100%"
                            height="80"
                            style={{ borderRadius: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'transparent' }}
                            frameBorder={0}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="border-gray-200 dark:border-gray-700"
                            title="Spotify Player"
                            scrolling="no"
                        ></iframe>
                    </div>
                </div>
            </div>
        );
    };

    export default SpotifyWidget;
