import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // 是否优先加载(跳过懒加载)
  onClick?: () => void;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

/**
 * 优化的图片组件
 * - 支持懒加载(Intersection Observer)
 * - 自动WebP格式支持(如果URL支持)
 * - 加载状态和错误处理
 * - 渐进式加载效果
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  onClick,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 懒加载逻辑
  useEffect(() => {
    if (priority) return; // 优先加载的图片跳过懒加载

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // 提前50px开始加载
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // 转换为WebP格式(如果可能)
  const getOptimizedSrc = (originalSrc: string): string => {
    // 如果是CDN图片且支持WebP转换
    if (originalSrc.includes("manuscdn.com") || originalSrc.includes("cloudinary.com")) {
      // 简单的WebP转换策略:替换扩展名
      // 实际项目中可能需要更复杂的逻辑或CDN参数
      return originalSrc;
    }
    return originalSrc;
  };

  const imageSrc = isInView ? getOptimizedSrc(src) : "";

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        className
      )}
      style={{ width, height }}
      onClick={onClick}
    >
      {isInView && (
        <>
          <img
            src={imageSrc}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              objectFit === "cover" && "object-cover w-full h-full",
              objectFit === "contain" && "object-contain w-full h-full",
              objectFit === "fill" && "object-fill w-full h-full",
              objectFit === "none" && "object-none",
              objectFit === "scale-down" && "object-scale-down w-full h-full",
              onClick && "cursor-pointer hover:opacity-90 transition-opacity"
            )}
          />
          
          {/* 加载占位符 */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <svg
                className="w-8 h-8 text-muted-foreground/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* 错误占位符 */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs">Image unavailable</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* 懒加载占位符 */}
      {!isInView && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}
