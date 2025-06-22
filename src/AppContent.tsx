 import React from 'react';

 import { ContextMenu } from './components/ContextMenu';
 import { AddPageButton } from './components/AddPageButton';
 import { PageItem } from './components/PageItem';
 import { BackgroundAnimation } from './components/BackgroundAnimation';
 import { useAppContext} from './context/AppContext';

export function AppContent() {

    const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Melodia+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    @keyframes unfold-menu {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;

  const {
    pages,
    isAddButtonFocused,
    handleAddPage,
    setIsAddButtonFocused,
  } = useAppContext();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center p-4 font-inter">
      <style>{globalStyles}</style>
      <BackgroundAnimation />
      <h1
        className="text-4xl font-extrabold mb-8 tracking-tight mt-6 relative z-10"
        style={{
          color: '#FFFFFF',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}
      >
        Page Navigation Toolbar
      </h1>
      <div id='toolbar-container' className="flex-grow flex items-center justify-center w-full relative z-10">
        <div
          className="w-full max-w-[1140px] h-[72px] bg-gray-50 px-5 flex flex-wrap justify-start items-center relative"
          style={{
            borderTop: '0.5px solid rgba(225, 225, 225, 1)',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1px 1px 0px rgba(0, 0, 0, 0.02)'
          }}
        >
          <AddPageButton index={0} />

          {pages.map((page, index) => (
            <React.Fragment key={page.id}>
              <PageItem page={page} />
              <AddPageButton index={index + 1} />
            </React.Fragment>
          ))}
          <button
            id='last-add-page-button'
            onClick={() => handleAddPage()}
            onFocus={() => setIsAddButtonFocused(true)}
            onBlur={() => setIsAddButtonFocused(false)}
            className={`
              py-1 px-2.5 rounded-lg
              transition-all duration-200 ease-in-out
              flex items-center gap-1
              ${isAddButtonFocused
                ? 'bg-white text-[#1A1A1A] border-[0.5px] border-[#2F72E2] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),_0px_1px_1px_0px_rgba(0,0,0,0.02),_0px_0px_0px_1.5px_rgba(47,114,226,0.25)]'
                : 'bg-[#9DA4B2]/15 text-[#677289] shadow-sm hover:bg-[#9DA4B2]/35'
              }
              font-inter font-medium text-sm leading-tight tracking-tighter /* Added font formatting */
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add page
          </button>
        </div>
      </div>
      <ContextMenu />
    </div>
  );
}