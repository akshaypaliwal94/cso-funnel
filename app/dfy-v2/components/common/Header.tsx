import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-center bg-black/30 py-4 backdrop-blur-sm md:py-4">
      <img
        src="/assets/images/icons/svg/tgo-white.svg"
        alt="tgo"
        className="h-9 w-16 md:h-12 md:w-20"
      />
    </div>
  );
};

export default Header;
