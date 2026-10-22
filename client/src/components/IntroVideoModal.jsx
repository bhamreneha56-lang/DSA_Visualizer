import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ArrowRight, SkipForward } from 'lucide-react';

export default function IntroVideoModal({ onComplete }) {
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setVideoEnded(true);
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleManualPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Fullscreen Video Element */}
      <video
        ref={videoRef}
        src="/intro_video.mp4"
        autoPlay
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        onClick={handleManualPlay}
      />

      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-white uppercase">
            DSA Interactive Platform
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mute/Unmute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition border border-white/10 cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quick Skip Button */}
          <button
            onClick={onComplete}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 text-white text-xs font-medium backdrop-blur-md transition border border-white/10 cursor-pointer"
          >
            <span>Skip Intro</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Area: Tap to Start Button positioned at the bottom with frosted/glass backdrop matching video */}
      <div className="relative z-20 pb-10 flex flex-col items-center justify-center">
        <button
          onClick={onComplete}
          className={`group flex items-center space-x-3 px-8 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-base font-semibold backdrop-blur-xl border border-white/25 shadow-2xl transition-all duration-300 cursor-pointer ${
            videoEnded ? 'ring-2 ring-white/50 scale-105' : ''
          }`}
        >
          <span className="tracking-wide">Tap to Start</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Subtle Bottom Progress Line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-20">
        <div
          className="h-full bg-white/50 backdrop-blur-sm transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
