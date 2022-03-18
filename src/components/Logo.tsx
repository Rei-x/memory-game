import React from 'react';
import NextImage from 'next/image';

const Logo = ({ scale }: { scale?: number }) => {
  return (
    <NextImage
      className="me-auto"
      src="/logo.png"
      height={37 * (scale || 1)}
      width={174 * (scale || 1)}
      quality={100}
    />
  );
};

export default Logo;
