import React from 'react';
import Login from './_components/Login';
import BackEnd from './_components/BackEnd';
import FrontEnd from './_components/FrontEnd';
import GlobalState from './_components/GlobalState';
import ServerState from './_components/ServerState';
import Payments from './_components/Payments';
import Calendar from './_components/Calendar';
import Motion from './_components/Motion';
import Css from './_components/Css';

const Page = () => {
  return (
    <div className="bg-white rounded-md p-6">
      <div className="flex flex-col gap-4">
        <BackEnd />
        <FrontEnd />
        <Login />
        <GlobalState />
        <ServerState />
        <Css />
        <Payments />
        <Calendar />
        <Motion />
      </div>
    </div>
  );
};

export default Page;
