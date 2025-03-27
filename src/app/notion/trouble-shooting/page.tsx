import React from 'react';
import SeatSyncIssue from './_components/SeatSyncIssue';
import ZodValidationIssue from './_components/ZodValidationIssue';

const Page = () => {
  return (
    <div className="bg-white rounded-md p-6">
      <div className="flex flex-col gap-4">
        <SeatSyncIssue />
        <ZodValidationIssue />
      </div>
    </div>
  );
};

export default Page;
