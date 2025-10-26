import React from 'react';
import QrCode from './_components/QrCode';
import Sidebar from './_components/Sidebar';
import Building from './_components/Building';

const Page = () => {
  return (
    <div className="bg-white rounded-md p-6">
      <div className="flex flex-col gap-4">
        <QrCode />
        <Sidebar />
        <Building />
      </div>
    </div>
  );
};

export default Page;
