
import React, { useState, useEffect, useCallback } from 'react';
import { Download, Format, VideoDetails } from './types';
import { playClick, playStartDownload, playToggle } from './constants';
import DownloadHistory from './components/DownloadHistory';
import { useDarkMode } from './hooks/useDarkMode';
import LoadingOverlay from './components/LoadingOverlay';

const getVideoId = (url: string): string | null => {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
};


const App: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    const [downloadSpeed, setDownloadSpeed] = useState<string>('');
    const [history, setHistory] = useState<Download[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    const handleFetchDetails = () => {
        const videoId = getVideoId(url);
        if (!videoId) {
            setError('Please enter a valid YouTube video URL.');
            setVideoDetails(null);
            return;
        }

        playClick();
        setError(null);
        setIsLoading(true);
        setVideoDetails(null);

        // Simulate API call to fetch video details
        setTimeout(() => {
            setVideoDetails({
                id: videoId,
                title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
                author: 'Rick Astley',
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                duration: 212, // in seconds
            });
            setIsLoading(false);
        }, 2500);
    };
    
    const handleStartDownload = useCallback((format: Format, quality: string, startTime: number, endTime: number) => {
        if (!videoDetails) return;
        
        playStartDownload();
        setIsDownloading(true);
        setDownloadProgress(0);

        const downloadInterval = setInterval(() => {
            setDownloadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(downloadInterval);
                    
                    const newDownload: Download = {
                        id: Date.now().toString(),
                        title: videoDetails.title,
                        format,
                        quality,
                        timestamp: new Date(),
                    };
                    setHistory(prevHistory => [newDownload, ...prevHistory.slice(0, 4)]);
                    setIsDownloading(false);
                    
                    // Subtle download completion sound effect
                    try {
                        const audio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjgyLjEwMAAAAAAAAAAAAAAA//uQxAAnkGFsAAC4ADRAAAYU3tAAATEp5u95pVERU//uQxAY8AAAAJAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uQxAgk0GIAAANIAcAAAACWVoAAFwAAAAAAADSAAAEETAAAAC3wAUNTEAAAACAAADSAAAAARsAAAAAMP8/3+CgAAAAAAAAAAAAAADSASwAAAAA//uQxAwQAGLgAACwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFQEAAAACAAADSAAAAEbAAAAAAAAAADD//+EAAAAAAAAAAAA0gEsAAAAAP/7kMQAEGoGLgAALAAARAAAAAABlVgAAFwAAAAAAAaQAAHqQAAAACfAABDSAAAAACAAADSAAAAEbAAAAAAAAP/8/wIAAAAAAAAAANIBLAAAAD//5DEBBAAYuAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUBAAAAAgAAA0gAAABGwAAAAAAAAAww//8RAAAAAAAAAADSASwAAAAD/+5DEAAScBi4AACwAAGVAAAAAGVWAAFwAAAAAAADSAAADSAAAAALfAAQ0gAAAAgAAA0gAAABGwAAAAAAAAD///pCAAAAAAAAADSASwAAAP/7kMQAEGoGLgAACwAAGVAAAAAGVWAAFwAAAAAAAaQAAHqQAAAACfAABDSAAAAACAAADSAAAAEbAAAAAAAAP//+kIAAAAAAAAAANIBLAAAAD//5DEBBAAYuAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUBAAAAAgAAA0gAAABGwAAAAAAAAAww//hAAAAAAAAAAAAAANIBLAAAAA=");
                        audio.play().catch(e => console.error("Audio play failed", e));
                    } catch(e) { console.error("Could not play audio", e); }
                    
                    setTimeout(() => setVideoDetails(null), 1000);
                    return 100;
                }
                const increment = Math.random() * 5 + 1;
                return Math.min(prev + increment, 100);
            });
            setDownloadSpeed(`${(Math.random() * 3 + 2).toFixed(1)} MB/s`);
        }, 200);
        
    }, [videoDetails]);
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedUrl = e.dataTransfer.getData('text');
        if (droppedUrl) {
            setUrl(droppedUrl);
            // Use a short timeout to ensure the state update is reflected before fetching
            setTimeout(() => {
                const fetchButton = document.getElementById('fetch-button');
                fetchButton?.click();
            }, 100);
        } else {
            setError("Please drop a valid YouTube link.");
        }
    };
    
    const handleToggleDarkMode = () => {
        playToggle();
        toggleDarkMode();
    }

    const clearInput = () => {
        playClick();
        setUrl('');
        setVideoDetails(null);
        setError(null);
    };

    return (
        <div 
            className={`min-h-screen font-sans text-brand-text dark:text-dark-text p-4 md:p-8 transition-colors duration-300 ${isDragging ? 'bg-brand-accent/10 dark:bg-dark-accent/10' : 'bg-brand-background dark:bg-dark-bg'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isLoading && <LoadingOverlay />}
            <div className={`fixed inset-0 border-4 border-dashed border-brand-accent dark:border-dark-accent rounded-3xl transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0'} m-4 pointer-events-none`}></div>
            <main className="max-w-3xl mx-auto space-y-8 relative z-10">
                <header className="flex justify-between items-center">
                    <div className="text-left">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">TubeDownloader</h1>
                        <p className="text-brand-dark-gray dark:text-brand-light-gray mt-2">Download YouTube videos and audio with ease.</p>
                    </div>
                    <button onClick={handleToggleDarkMode} className="p-2 rounded-full hover:bg-brand-light-gray dark:hover:bg-dark-border transition-colors">
                        {isDarkMode ? <SunIcon className="w-6 h-6 text-dark-accent-yellow" /> : <MoonIcon className="w-6 h-6 text-brand-dark-gray" />}
                    </button>
                </header>

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-accent to-blue-500 dark:from-dark-accent dark:to-dark-accent-yellow rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white/70 dark:bg-dark-bg/70 backdrop-blur-xl border border-white/20 dark:border-dark-border/20 shadow-soft-md rounded-xl p-6">
                        <div className="flex items-center space-x-4">
                            <LinkIcon className="w-6 h-6 text-brand-dark-gray dark:text-brand-light-gray" />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFetchDetails()}
                                placeholder="Paste or drag a YouTube link here"
                                className="flex-grow bg-transparent focus:outline-none text-lg text-brand-text dark:text-dark-text placeholder-brand-dark-gray dark:placeholder-brand-light-gray peer"
                                disabled={isLoading || isDownloading}
                            />
                            {url && (
                                <button
                                    onClick={clearInput}
                                    className="p-1 rounded-full hover:bg-brand-light-gray dark:hover:bg-dark-border transition-colors"
                                    aria-label="Clear input"
                                >
                                    <XIcon className="w-5 h-5 text-brand-dark-gray dark:text-brand-light-gray" />
                                </button>
                            )}
                            <button
                                id="fetch-button"
                                onClick={handleFetchDetails}
                                disabled={isLoading || isDownloading || !url}
                                className="flex items-center justify-center bg-brand-accent dark:bg-dark-accent text-white dark:text-dark-bg px-5 py-2.5 rounded-lg shadow-soft hover:bg-brand-accent-light dark:hover:opacity-80 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                <SearchIcon className="w-5 h-5 mr-2" />
                                <span>Fetch</span>
                            </button>
                        </div>
                        <div className="h-0.5 bg-brand-light-gray dark:bg-dark-border mt-4 relative">
                            <div className="absolute top-0 left-0 h-0.5 bg-brand-accent dark:bg-dark-accent transition-all duration-300 w-0 peer-focus:w-full"></div>
                        </div>

                    </div>
                </div>

                {error && <div className="text-center text-red-500 dark:text-dark-accent-red bg-red-100 dark:bg-dark-accent-red/20 border border-red-200 dark:border-dark-accent-red/30 rounded-lg p-3">{error}</div>}
                
                {videoDetails && (
                    <VideoPreview 
                        videoDetails={videoDetails}
                        isDownloading={isDownloading}
                        downloadProgress={downloadProgress}
                        downloadSpeed={downloadSpeed}
                        onStartDownload={handleStartDownload}
                    />
                )}

                <DownloadHistory history={history} />

            </main>
        </div>
    );
};

export default App;
