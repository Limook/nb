import React from 'react';

interface PostcodeIframeProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  style?: React.CSSProperties;
}

export const PostcodeIframe: React.FC<PostcodeIframeProps> = ({ containerRef, isVisible, style }) => {
  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '260px',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--primary)',
        display: isVisible ? 'block' : 'none',
        overflow: 'hidden',
        ...style
      }}
    />
  );
};

export default PostcodeIframe;
