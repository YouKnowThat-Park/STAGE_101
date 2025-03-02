import React from 'react';
import Logout from './(auth)/_components/Logout';

const Header = () => {
  return (
    <div className="w-full h-16 bg-white mb-[50px]">
      <Logout />
    </div>
  );
};

export default Header;
