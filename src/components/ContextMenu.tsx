import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export function ContextMenu({}) {
  const { contextMenuState, contextMenuRef, handleContextMenuItemClick } = useAppContext();
  const [positionedX, setPositionedX] = useState(-9999);
  const [positionedY, setPositionedY] = useState(-9999);
  const [currentTransformOrigin, setCurrentTransformOrigin] = useState('top left');

  useLayoutEffect(() => {
    if (contextMenuState.visible && contextMenuRef.current) {
      const menuWidth = contextMenuRef.current.offsetWidth;
      const menuHeight = contextMenuRef.current.offsetHeight;

      const targetElement = document.querySelector(`[data-page-id="${contextMenuState.pageId}"]`);

      if (!targetElement) {
        console.error('Context menu target element not found for ID:', contextMenuState.pageId);
        setPositionedX(-9999);
        setPositionedY(-9999);
        setCurrentTransformOrigin('top left');
        return;
      }
      const targetRect = targetElement.getBoundingClientRect();

      let newX = targetRect.left;
      let newY;
      let newTransformOrigin = 'bottom left';

      newY = targetRect.top - menuHeight - 9;

      if (newY < 0) {
        newY = 0;
        newTransformOrigin = 'top left';
      }

      // Ensure X doesn't go off-screen
      if (newX + menuWidth > window.innerWidth - 10) {
        newX = window.innerWidth - menuWidth - 10;
        newTransformOrigin = newTransformOrigin.replace('left', 'right');
      }
      if (newX < 10) {
        newX = 10;
        newTransformOrigin = newTransformOrigin.replace('right', 'left');
      }

      if (positionedX !== newX || positionedY !== newY || currentTransformOrigin !== newTransformOrigin) {
        setPositionedX(newX);
        setPositionedY(newY);
        setCurrentTransformOrigin(newTransformOrigin);
      }
    } else if (!contextMenuState.visible) {
      setPositionedX(-9999);
      setPositionedY(-9999);
      setCurrentTransformOrigin('top left');
    }
  }, [contextMenuState.visible, contextMenuState.pageId, contextMenuRef]);

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: positionedY,
    left: positionedX,
    transformOrigin: currentTransformOrigin,
    visibility: contextMenuState.visible ? 'visible' : 'hidden',
    opacity: contextMenuState.visible ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out, visibility 0s linear 0.2s',
    pointerEvents: contextMenuState.visible ? 'auto' : 'none',
  };

  return (
    <div
      ref={contextMenuRef}
      className={`z-50 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),_0px_1px_1px_0px_rgba(0,0,0,0.02)] border-[0.5px] border-gray-200 w-48 text-gray-800
            ${contextMenuState.visible ? 'animate-[unfold-menu_0.2s_ease-out_forwards]' : ''}`}
      style={menuStyle}
    >
      <div
        id="menu-header"
        className="flex flex-col gap-1 border-b-[0.5px] border-b-gray-200 p-3 bg-gray-50 rounded-t-xl"
      >
        <span className="font-melodia-one font-medium text-base leading-6 tracking-tighter text-[#1A1A1A]">
          Settings
        </span>
      </div>
      <div id="menu-items" className="flex flex-col gap-3 py-3 px-3">
        <button
          id="setAsFirst-button"
          className="group flex items-center w-full text-left font-inter font-medium text-sm leading-4 tracking-tighter rounded-md hover:bg-gray-100 p-2"
          onClick={() => handleContextMenuItemClick('setAsFirst')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-flag mr-2 text-gray-500 group-hover:stroke-[rgb(47,114,226)]"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
          </svg>
          Set as first page
        </button>
        <button
          id="rename-button"
          className="group flex items-center w-full text-left font-inter font-medium text-sm leading-4 tracking-tighter rounded-md hover:bg-gray-100 p-2"
          onClick={() => handleContextMenuItemClick('rename')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucude-pen-line mr-2 text-gray-500 group-hover:stroke-[rgb(47,114,226)]"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Rename
        </button>
        <button
          id="copy-button"
          className="group flex items-center w-full text-left font-inter font-medium text-sm leading-4 tracking-tighter rounded-md hover:bg-gray-100 p-2"
          onClick={() => handleContextMenuItemClick('copy')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-clipboard mr-2 text-gray-500 group-hover:stroke-[rgb(47,114,226)]"
          >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          </svg>
          Copy
        </button>
        <button
          id="duplicate-button"
          className="group flex items-center w-full text-left font-inter font-medium text-sm leading-4 tracking-tighter rounded-md hover:bg-gray-100 p-2"
          onClick={() => handleContextMenuItemClick('duplicate')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-copy mr-2 text-gray-500 group-hover:stroke-[rgb(47,114,226)]"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2" />
          </svg>
          Duplicate
        </button>
        <div id="separator-bar" className="h-px w-full" style={{ background: 'rgba(225, 225, 225, 1)' }}></div>
        <button
          id="delete-button"
          className="group flex items-center w-full text-left font-inter font-medium text-sm leading-4 tracking-tighter rounded-md hover:bg-gray-100 p-2 text-[rgb(239,73,79)] group-hover:text-[rgb(200,50,56)]"
          onClick={() => handleContextMenuItemClick('delete')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-2 mr-2 text-[rgb(239,73,79)] group-hover:stroke-[rgb(200,50,56)]"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
