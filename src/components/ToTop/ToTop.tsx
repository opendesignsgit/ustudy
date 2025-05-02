import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
}

export const BackToTop = (props: Props) => {
  const { className } = props;

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={clsx(
        'fixed bottom-4 right-4 bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded flex items-center',
        className
      )}
      onClick={handleScrollToTop}
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 11l7-7 7 7M5 19v-6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H5z"
        />
      </svg>
      Back to Top
    </button>
  );
};