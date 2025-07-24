
import React, { useState, useEffect } from 'react';
import { VideoDetails, Format } from '../types';
import { AUDIO_QUALITIES, VIDEO_QUALITIES, playToggle } from '../constants';
import { DownloadIcon, MusicNoteIcon, VideoCameraIcon, ChevronDownIcon } from './Icons';

interface VideoPreviewProps {
    videoDetails: VideoDetails;
    isDownloading: boolean;
    downloadProgress: number;
    downloadSpeed: string;
    onStartDownload: (format: Format, quality: string, startTime: number, endTime: number) => void;
}

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const VideoPreview: React.FC<VideoPreviewProps> = ({
    videoDetails,
    isDownloading,
    downloadProgress,
    downloadSpeed,
    onStartDownload,
}) => {
    const [format, setFormat] = useState<Format>('MP4');
    const [quality, setQuality] = useState<string>(VIDEO_QUALITIES[1].value); // Default to 720p
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(videoDetails.duration);
    const [estimatedSize, setEstimatedSize] = useState<string>('');

    const qualityOptions = format === 'MP3' ? AUDIO_QUALITIES : VIDEO_QUALITIES;

    useEffect(() => {
        // Reset quality when format changes
        const newQuality = format === 'MP3' ? AUDIO_QUALITIES[1].value : VIDEO_QUALITIES[1].value;
        setQuality(newQuality);
    }, [format]);

    useEffect(() => {
        // Simulate file size estimation
        const duration = endTime - startTime;
        let baseSize = 0;
        if (format === 'MP3') {
            const bitrate = parseInt(quality, 10); // 128, 192, 320
            baseSize = (duration * bitrate * 1000) / 8 / 1024 / 1024; // MB
        } else {
            const qualityMap: { [key: string]: number } = { '480p': 1.5, '720p': 2.5, '1080p': 5, '4k': 15 };
            const megabitsPerSecond = qualityMap[quality] || 2.5;
            baseSize = (duration * megabitsPerSecond) / 8;
        }
        setEstimatedSize(baseSize > 0 ? `${baseSize.toFixed(1)} MB` : '');
    }, [format, quality, startTime, endTime]);

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = parseInt(e.target.value, 10);
        if (newStart < endTime) {
            setStartTime(newStart);
        }
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = parseInt(e.target.value, 10);
        if (newEnd > startTime) {
            setEndTime(newEnd);
        }
    };
    
    const handleSetFormat = (newFormat: Format) => {
        if(format !== newFormat) {
            playToggle();
            setFormat(newFormat);
        }
    }

    if (isDownloading) {
        return (
             <div className="bg-white/70 dark:bg-dark-bg/70 backdrop-blur-xl border border-white/20 dark:border-dark-border/20 shadow-soft-md rounded-xl p-6 w-full animate-fade-in">
                 <div className="flex items-center space-x-4">
                     <img src={videoDetails.thumbnail} alt="Video thumbnail" className="w-24 h-auto rounded-lg" />
                     <div className="flex-grow">
                         <h3 className="font-semibold text-brand-text dark:text-dark-text truncate">{videoDetails.title}</h3>
                         <p className="text-sm text-brand-dark-gray dark:text-brand-light-gray">Downloading...</p>
                         <div className="w-full bg-brand-light-gray dark:bg-dark-border rounded-full h-4 mt-2 overflow-hidden relative">
                            <div className="bg-brand-accent dark:bg-dark-accent h-4 rounded-full transition-width duration-150" style={{ width: `${downloadProgress}%` }}></div>
                            <div className="absolute inset-0 bg-black/20 animate-scanline opacity-30"></div>
                         </div>
                         <div className="flex justify-between text-sm text-brand-dark-gray dark:text-brand-light-gray mt-1 font-mono">
                             <span>{downloadProgress.toFixed(0)}%</span>
                             <span>{downloadSpeed}</span>
                         </div>
                     </div>
                 </div>
             </div>
        )
    }

    return (
        <div className="bg-white/70 dark:bg-dark-bg/70 backdrop-blur-xl border border-white/20 dark:border-dark-border/20 shadow-soft-md rounded-xl p-6 w-full animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <img src={videoDetails.thumbnail} alt={videoDetails.title} className="w-full md:w-48 h-auto rounded-lg shadow-soft object-cover" />
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-brand-text dark:text-dark-text">{videoDetails.title}</h2>
                    <p className="text-brand-dark-gray dark:text-brand-light-gray">{videoDetails.author}</p>
                </div>
            </div>

            {/* Time Scrubber */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-brand-dark-gray dark:text-brand-light-gray">Trim</span>
                    <span className="px-2 py-1 bg-brand-light-gray dark:bg-dark-border rounded-md text-brand-text dark:text-dark-text">{formatTime(startTime)} - {formatTime(endTime)}</span>
                </div>
                <div className="relative h-2">
                    <input type="range" min="0" max={videoDetails.duration} value={startTime} onChange={handleStartTimeChange} className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-0 z-10 custom-range" />
                    <input type="range" min="0" max={videoDetails.duration} value={endTime} onChange={handleEndTimeChange} className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-0 z-10 custom-range" />
                    <div className="absolute rounded-full bg-brand-light-gray dark:bg-dark-border h-2 w-full top-0"></div>
                    <div className="absolute rounded-full bg-brand-accent dark:bg-dark-accent h-2 top-0" style={{ left: `${(startTime / videoDetails.duration) * 100}%`, right: `${100 - (endTime / videoDetails.duration) * 100}%` }}></div>
                </div>
            </div>
            <style>{`
                .custom-range::-webkit-slider-thumb {
                   -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border: 2px solid #4e4ef7;
                    border-radius: 50%;
                    cursor: pointer;
                    pointer-events: auto;
                    margin-top: -7px;
                }
                .dark .custom-range::-webkit-slider-thumb {
                    background: #111;
                    border-color: #00ff00;
                }
                .custom-range::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: white;
                    border: 2px solid #4e4ef7;
                    border-radius: 50%;
                    cursor: pointer;
                    pointer-events: auto;
                }
                 .dark .custom-range::-moz-range-thumb {
                    background: #111;
                    border-color: #00ff00;
                }
            `}</style>


            {/* Format & Quality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-dark-gray dark:text-brand-light-gray">Format</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-brand-light-gray dark:bg-dark-border rounded-lg">
                        <button onClick={() => handleSetFormat('MP4')} className={`flex items-center justify-center space-x-2 py-2 rounded-md transition-all duration-200 ${format === 'MP4' ? 'bg-white dark:bg-dark-bg shadow-soft' : 'hover:bg-white/50 dark:hover:bg-white/10'}`}>
                            <VideoCameraIcon className="w-5 h-5 text-brand-accent dark:text-dark-accent"/>
                            <span className="font-semibold">MP4</span>
                        </button>
                        <button onClick={() => handleSetFormat('MP3')} className={`flex items-center justify-center space-x-2 py-2 rounded-md transition-all duration-200 ${format === 'MP3' ? 'bg-white dark:bg-dark-bg shadow-soft' : 'hover:bg-white/50 dark:hover:bg-white/10'}`}>
                            <MusicNoteIcon className="w-5 h-5 text-brand-accent dark:text-dark-accent"/>
                            <span className="font-semibold">MP3</span>
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-dark-gray dark:text-brand-light-gray">Quality</label>
                    <div className="relative">
                        <select
                            value={quality}
                            onChange={(e) => {
                                playToggle();
                                setQuality(e.target.value);
                            }}
                            className="w-full appearance-none bg-brand-light-gray dark:bg-dark-border border-none text-brand-text dark:text-dark-text font-semibold rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent dark:focus:ring-dark-accent"
                        >
                            {qualityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-brand-dark-gray dark:text-brand-light-gray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <div className="pt-4 border-t border-brand-light-gray/50 dark:border-dark-border/50 flex items-center justify-between">
                <div>
                     <p className="text-sm text-brand-dark-gray dark:text-brand-light-gray">Est. size: <span className="font-bold text-brand-text dark:text-dark-text">{estimatedSize}</span></p>
                </div>
                <button
                    onClick={() => onStartDownload(format, quality, startTime, endTime)}
                    className="flex items-center justify-center bg-brand-accent dark:bg-dark-accent text-white dark:text-dark-bg px-6 py-3 rounded-lg shadow-soft hover:bg-brand-accent-light dark:hover:opacity-80 transform hover:scale-105 transition-all duration-300"
                >
                    <DownloadIcon className="w-6 h-6 mr-2" />
                    <span className="font-bold text-lg">Download</span>
                </button>
            </div>
        </div>
    );
};

export default VideoPreview;