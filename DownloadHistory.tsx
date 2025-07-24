import React from 'react';
import { Download } from '../types';
import { ClockIcon, MusicNoteIcon, VideoCameraIcon } from './Icons';

interface DownloadHistoryProps {
    history: Download[];
}

const DownloadHistory: React.FC<DownloadHistoryProps> = ({ history }) => {
    if (history.length === 0) {
        return null;
    }

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-center text-brand-text dark:text-dark-text">Download History</h3>
            <div className="space-y-3">
                {history.map(item => (
                    <div key={item.id} className="bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border border-white/30 dark:border-dark-border/30 p-4 rounded-xl shadow-soft flex items-center space-x-4 animate-fade-in-up">
                        <div className={`p-3 rounded-full ${item.format === 'MP4' ? 'bg-blue-100 text-blue-600 dark:bg-dark-accent/20 dark:text-dark-accent' : 'bg-green-100 text-green-600 dark:bg-dark-accent/20 dark:text-dark-accent'}`}>
                            {item.format === 'MP4' ? <VideoCameraIcon className="w-6 h-6" /> : <MusicNoteIcon className="w-6 h-6" />}
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <p className="font-semibold text-brand-text dark:text-dark-text truncate pr-4">{item.title}</p>
                            <div className="flex items-center space-x-4 text-sm text-brand-dark-gray dark:text-brand-light-gray mt-1">
                                <span>{item.format} - {item.quality}</span>
                                <span className="flex items-center space-x-1">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>{formatTimestamp(item.timestamp)}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DownloadHistory;
