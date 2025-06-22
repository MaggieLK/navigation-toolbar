import { Page } from '../types';
import {useAppContext} from '../context/AppContext'

interface PageItemProps {
  page: Page;
}

export function PageItem({ page }: PageItemProps) {
  const {
    activePageId,
    editingPageId,
    hoveredPageId,
    draggedPageId,
    draggedOverPageId,
    droppedPageId,
    contextMenuState,
    handlePageClick,
    handlePageFocus,
    handlePageNameChange,
    handlePageNameKeyDown,
    handlePageNameBlur,
    handleDragStart,
    handleDragEnd,
    handlePageDragOver,
    handlePageDragLeave,
    handlePageDrop,
    handleContextMenu,
    setHoveredPageId,
  } = useAppContext();

  const showDotsIcon = activePageId === page.id &&
                       (hoveredPageId === page.id ||
                        editingPageId === page.id ||
                        contextMenuState.pageId === page.id ||
                        draggedPageId === page.id);

  return (
    <div
      id='outer-page-wrapper'
      onDragOver={(e) => handlePageDragOver(e, page.id)}
      onDragLeave={handlePageDragLeave}
      onDrop={(e) => handlePageDrop(e, page.id)}
      className={`
        flex items-center justify-center relative shrink-0
        ${draggedPageId !== null ? 'h-full' : ''}
      `}
    >
      {draggedPageId !== null && draggedOverPageId === page.id && draggedPageId !== page.id && (
        <div id='page-drop-indicator' className="absolute inset-0 bg-blue-200 z-10 rounded-lg"></div>
      )}
      <div
      id='page-element'
        data-page-id={page.id}
        draggable
        onDragStart={(e) => handleDragStart(e, page.id)}
        onDragEnd={handleDragEnd}
        onClick={() => handlePageClick(page.id)}
        onFocus={() => handlePageFocus(page.id)}
        onMouseEnter={() => hoveredPageId !== page.id && hoveredPageId === null && !draggedPageId && setHoveredPageId(page.id)}
        onMouseLeave={() => hoveredPageId === page.id && setHoveredPageId(null)}
        onContextMenu={(e) => handleContextMenu(e, page.id)}
        tabIndex={0}
        className={`
          rounded-lg cursor-grab flex items-center select-none
          transition-all duration-300 ease-in-out
          py-1.5 px-3
          ${draggedPageId === page.id ? 'opacity-50 border-2 border-dashed border-blue-400 bg-blue-100' : ''}
          ${activePageId === page.id
            ? 'bg-white'
            : 'bg-[#9DA4B2]/15 hover:bg-[#9DA4B2]/35 shadow-sm'
          }
          ${showDotsIcon
            ? 'border-[0.5px] border-[#2F72E2] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),_0px_1px_1px_0px_rgba(0,0,0,0.02),_0px_0px_0px_1.5px_rgba(47,114,226,0.25)]'
            : ''
          }
          ${activePageId === page.id && !showDotsIcon
            ? 'border-[0.5px] border-[rgba(225, 225, 225, 1)]'
            : ''
          }
          relative z-20
          ${droppedPageId === page.id ? 'animate-[pop_0.3s_ease-out]' : ''}
        `}
      >
        {/* Conditional icon for 'Info' and 'Ending' pages, otherwise default document icon */}
        {page.id === '1' ? (
          <svg className={`w-5 h-5 ${activePageId === page.id ? 'stroke-[#F59D0E]' : 'stroke-gray-500'} mr-[6px]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11v5m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        ) : page.id === '4' ? (
          <svg className={`w-5 h-5 ${activePageId === page.id ? 'stroke-[#F59D0E]' : 'stroke-gray-500'} mr-[6px]`} fill="none" stroke="currentColor" viewBox="0 0 24 24" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        ) : (
          <svg className={`w-5 h-5 ${activePageId === page.id ? 'stroke-[#F59D0E]' : 'stroke-gray-500'} mr-[6px]`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
        )}

        {editingPageId === page.id ? (
          <input
            type="text"
            value={page.name}
            onChange={handlePageNameChange}
            onKeyDown={handlePageNameKeyDown}
            onBlur={handlePageNameBlur}
            autoFocus
            className="bg-transparent border-b border-blue-400 focus:outline-none font-inter font-medium text-sm leading-tight tracking-tighter w-24"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={`truncate font-inter font-medium text-sm leading-tight tracking-tighter text-center ${activePageId === page.id ? 'text-[#1A1A1A]' : 'text-[#677289]'}`}>
            {page.name}
          </span>
        )}
        <svg
          id='vertical-dots-icon'
          className={`
            h-5 text-gray-500 transition-all duration-300 ease-in-out
            ${showDotsIcon
                ? 'w-5 opacity-100 ml-[6px] hover:scale-150 hover:text-blue-500 cursor-pointer'
                : 'w-0 opacity-0'
            }
          `}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={(e) => {

            e.stopPropagation();
            handleContextMenu(e, page.id);
          }}
        >
          <circle cx="12" cy="7" r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="12" cy="17" r="1.5"/>
        </svg>
      </div>
    </div>
  );
}
