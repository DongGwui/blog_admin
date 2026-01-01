import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "standalone",

  // 이미지 최적화 설정
  images: {
    // 외부 이미지 도메인 설정
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blog-api.dltmxm.link",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
    ],
    // 최적화된 이미지 포맷
    formats: ["image/avif", "image/webp"],
    // 이미지 크기 제한 (10MB)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 실험적 기능
  experimental: {
    // 무거운 패키지 자동 최적화
    optimizePackageImports: [
      "@uiw/react-md-editor",
      "@tanstack/react-query",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
