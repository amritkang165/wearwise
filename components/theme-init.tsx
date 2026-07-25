"use client";

import Script from "next/script";

export function ThemeInit() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme');
              var d = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
              if (d) document.documentElement.classList.add('dark');
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}
