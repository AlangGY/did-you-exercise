"use client";

import Script from "next/script";

export default function KakaoClient() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
      crossOrigin="anonymous"
      onLoad={() => {
        if (!window?.Kakao.isInitialized()) {
          window.Kakao.cleanup();
        }

        window.Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY);
      }}
    />
  );
}
