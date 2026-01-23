'use client';
import React, { useState } from 'react';
import ReviewListModal from './modal/ReviewListModal';

const HomeReviewsClient = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="min-w-[350px] flex-1 max-w-[400px] shadow-md rounded-lg flex flex-col items-center">
      <div className="w-full flex">
        <button
          onClick={() => setIsReviewModalOpen(true)}
          className="text-sm border-b border-black inline-block w-full h-full"
        >
          <div className="pointer-events-none">
            <ReviewListModal />
          </div>
        </button>
      </div>
      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative  w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg">
            <ReviewListModal onClose={() => setIsReviewModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeReviewsClient;
