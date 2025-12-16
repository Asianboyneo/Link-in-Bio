import React, { useRef, useState, useCallback } from 'react';
import Experience from './components/Experience';
import UIOverlay from './components/UIOverlay';
import { ExperienceRef } from './types';

const App: React.FC = () => {
    const experienceRef = useRef<ExperienceRef>(null);
    const [status, setStatus] = useState("Initializing Quantum Field...");
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isPhotoMode, setIsPhotoMode] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleStatusChange = useCallback((text: string, cameraActive: boolean) => {
        setStatus(text);
        setIsCameraActive(cameraActive);
        if (text === "Camera Standby" || text.includes("Processing")) {
            setTimeout(() => setIsLoading(false), 1000);
        }
    }, []);

    const toggleMode = () => {
        const newMode = !isPhotoMode;
        setIsPhotoMode(newMode);
        experienceRef.current?.setPhotoMode(newMode);
    };

    const toggleMusic = () => {
        const playing = !isMusicPlaying;
        setIsMusicPlaying(playing);
        experienceRef.current?.setMusicPlaying(playing);
    };

    return (
        <div className="relative w-full h-full bg-[#020205] text-white overflow-hidden">
            {/* Loading Screen */}
            <div 
                className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020205] transition-opacity duration-1000 pointer-events-none ${isLoading ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="text-lg tracking-[3px] font-light text-center">
                    {status}
                    <br />
                    <span className="text-[0.7em] opacity-60 tracking-widest mt-2 block">Awaiting Input</span>
                </div>
            </div>

            {/* Status Indicator (Top Right) */}
            {!isLoading && (
                 <div className="absolute top-6 right-6 z-20 flex items-center gap-3 bg-glass/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all duration-300 pointer-events-none md:pointer-events-auto">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-500 relative after:content-[''] after:absolute after:-inset-1 after:rounded-full after:border after:border-current after:opacity-30 after:animate-pulse-fast ${isCameraActive ? 'bg-green-400 text-green-400' : 'bg-slate-400 text-slate-400'}`}></div>
                    <span className="text-xs font-mono text-indigo-100 uppercase tracking-wider">{isCameraActive ? "Sensors Online" : "Sensors Standby"}</span>
                 </div>
            )}

            {/* Main Experience */}
            <Experience ref={experienceRef} onStatusChange={handleStatusChange} />

            {/* UI Overlay */}
            <UIOverlay 
                onModeToggle={toggleMode}
                onReset={() => experienceRef.current?.resetView()}
                onExplodeStart={() => experienceRef.current?.triggerExplosion(true)}
                onExplodeEnd={() => experienceRef.current?.triggerExplosion(false)}
                onMusicToggle={toggleMusic}
                isPhotoMode={isPhotoMode}
                isMusicPlaying={isMusicPlaying}
            />
        </div>
    );
};

export default App;
