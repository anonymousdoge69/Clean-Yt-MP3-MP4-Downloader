import React from 'react';

const LoadingOverlay: React.FC = () => {
    const brutalistBgUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Q0bHZ2MG01ZHBzZDRsZHp3enE2Nzhod3J2dmp3bzF5OGxjeGcwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9Jge0ry6m4qM8/giphy.gif";
    const runningDogUrl = "https://i.gifer.com/origin/c8/c8411a933f67b575005824559828d63f_w200.gif"

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-dark-bg/80 backdrop-blur-sm">
            <div 
                className="absolute inset-0 w-full h-full bg-repeat opacity-30"
                style={{ backgroundImage: `url(${brutalistBgUrl})` }}
            ></div>
            <div className="relative flex flex-col items-center p-8 bg-black/50 rounded-2xl shadow-lg border border-dark-accent/50">
                <img src={runningDogUrl} alt="Running dog" className="w-24 h-24" />
                <div className="text-dark-accent font-mono text-xl mt-4 tracking-widest">
                    Fetching video details...
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
