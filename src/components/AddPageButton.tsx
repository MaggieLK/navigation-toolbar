import { useAppContext } from '../context/AppContext';

interface AddPageButtonProps {
  index: number;
}

export function AddPageButton({ index }: AddPageButtonProps) {
  const {
    showAddButton,
    buttonRotations,
    buttonGlowStates,
    handleAddPage,
    handleSeparatorMouseEnter,
    handleSeparatorMouseLeave,
    handleAddButtonMouseEnter,
    handleAddButtonMouseLeave,
    handleSeparatorDragOver,
    handleSeparatorDragLeave,
    handleSeparatorDrop,
    draggedPageId,
    hoveringOverSeparatorIndex,
  } = useAppContext();

  const isVisible = showAddButton.visible && showAddButton.index === index;
  const isFirstSeparator = index === 0;

  let containerWidthClass = 'w-5';
  if (isFirstSeparator) {
    containerWidthClass = isVisible ? 'w-[48px]' : 'w-0';
  } else if (isVisible) {
    containerWidthClass = 'w-[48px]';
  }

  return (
    <div
      onDragOver={(e) => handleSeparatorDragOver(e, index)}
      onDragLeave={handleSeparatorDragLeave}
      onDrop={(e) => handleSeparatorDrop(e, index)}
      onMouseEnter={() => handleSeparatorMouseEnter(index)}
      onMouseLeave={handleSeparatorMouseLeave}
      className={`
        relative flex items-center justify-center shrink-0 transition-all duration-300 ease-in-out
        ${containerWidthClass} /* Apply the dynamically determined width class */
        h-full
        ${isFirstSeparator && !isVisible ? 'overflow-hidden' : ''} /* Crucial for w-0 state of first separator to hide content */
      `}
    >
      {draggedPageId !== null && hoveringOverSeparatorIndex === index && (
        <div id="highlight" className="absolute inset-0 bg-blue-100 z-20 rounded-lg"></div>
      )}
      <div
        id="page-separator"
        className={`
          flex items-center justify-center w-full relative z-30 transition-opacity duration-300 ease-in-out
          ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div
          className="w-[20px] border-b border-dashed"
          style={{ height: '1.5px', borderWidth: '1px', borderColor: 'rgba(192, 192, 192, 1)' }}
        ></div>
        <button
          id="add-page-button"
          className={`
            w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0
            transition-transform duration-300 ease-in-out /* For smooth spin */
          `}
          onClick={() => handleAddPage(index)}
          onMouseEnter={() => handleAddButtonMouseEnter(index)}
          onMouseLeave={() => handleAddButtonMouseLeave(index)}
          aria-label="Add page here"
          style={{
            border: '0.5px solid rgba(225, 225, 225, 1)',
            transform: `rotate(${buttonRotations[index] || 0}deg)`,
            boxShadow: buttonGlowStates[index] ? '0 0 12px 6px rgba(47, 114, 226, 0.7)' : 'none',
          }}
        >
          <svg
            id="plus-icon"
            className="w-4 h-4 stroke-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
        <div
          className="w-[20px] border-b border-dashed"
          style={{ height: '1.5px', borderWidth: '1px', borderColor: 'rgba(192, 192, 192, 1)' }}
        ></div>
      </div>
      <div
        id="button-not-visible-separator"
        className={`w-full border-b border-dashed absolute inset-y-1/2 transition-opacity duration-300 ease-in-out`}
        style={{
          height: '1.5px',
          borderWidth: '1px',
          borderColor: 'rgba(192, 192, 192, 1)',
          zIndex: 1,
          opacity: !isVisible && !isFirstSeparator ? '1' : '0',
        }}
      ></div>
    </div>
  );
}
