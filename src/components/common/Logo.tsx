import React, { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  variant?: 'light' | 'dark' | 'auto';
}

/**
 * Single-file Logo component for DigiTechLabs.
 * Pulls directly from /public/logo.svg so replacing /public/logo.svg updates the logo everywhere.
 */
export default function Logo({ 
  className = "h-10 w-auto", 
  height, 
  width,
  variant = 'auto'
}: LogoProps) {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    fetch('/logo.svg')
      .then(res => res.text())
      .then(text => setSvgContent(text))
      .catch(err => console.error("Error loading logo.svg:", err));
  }, []);

  // Text color for "DigiTech" text: White on dark backgrounds ('light' variant), dark charcoal on light backgrounds
  const textColor = variant === 'light' ? '#FFFFFF' : '#141414';

  if (!svgContent) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img 
          src="/logo.svg" 
          alt="DigiTechLabs Logo" 
          style={{ 
            height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
            width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
          }}
          className="h-full w-auto max-h-12 object-contain"
        />
      </div>
    );
  }

  // Replace fill="currentColor" with exact target text color (e.g. #FFFFFF on dark backgrounds, #141414 on light)
  const modifiedSvg = svgContent.replace('fill="currentColor"', `fill="${textColor}"`);

  return (
    <div 
      className={`inline-flex items-center select-none ${className} [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-h-full`}
      style={{ 
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
      }}
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
    />
  );
}

