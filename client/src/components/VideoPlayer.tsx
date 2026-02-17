import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export default function VideoPlayer({ videoUrl, title, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 懒加载:只有滚动到视频区域才加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isLoaded]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    // 循环播放
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      {/* 视频容器 */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
        {isLoaded ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            您的浏览器不支持视频播放。
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-white/60">加载中...</div>
          </div>
        )}

        {/* 播放/暂停按钮覆盖层 */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity cursor-pointer ${
            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
          onClick={togglePlay}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg">
            {isPlaying ? (
              <Pause className="w-8 h-8 md:w-10 md:h-10 text-gray-900" />
            ) : (
              <Play className="w-8 h-8 md:w-10 md:h-10 text-gray-900 ml-1" />
            )}
          </div>
        </div>

        {/* 视频标题 */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white text-sm md:text-base font-light">{title}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
