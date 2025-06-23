import React, { createContext, useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Page } from '../types';

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  pageId: string | null;
  transformOrigin: string;
}

interface AppContextType {
  pages: Page[];
  activePageId: string | null;
  editingPageId: string | null;
  hoveredPageId: string | null;
  draggedPageId: string | null;
  draggedOverPageId: string | null;
  droppedPageId: string | null;
  showAddButton: { visible: boolean; index: number };
  isAddButtonFocused: boolean;
  buttonRotations: { [key: number]: number };
  buttonGlowStates: { [key: number]: boolean };
  contextMenuState: ContextMenuState;
  contextMenuRef: React.RefObject<HTMLDivElement | null>;

  setHoveredPageId: React.Dispatch<React.SetStateAction<string | null>>;
  handlePageClick: (id: string) => void;
  handlePageFocus: (id: string) => void;
  handlePageNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageNameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePageNameBlur: () => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  handleDragEnd: () => void;
  handlePageDragOver: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  handlePageDragLeave: () => void;
  handlePageDrop: (e: React.DragEvent<HTMLDivElement>, dropTargetId: string) => void;
  handleAddPage: (index?: number) => void;
  handleSeparatorMouseEnter: (index: number) => void;
  handleSeparatorMouseLeave: () => void;
  handleAddButtonMouseEnter: (index: number) => void;
  handleAddButtonMouseLeave: (index: number) => void;
  handleSeparatorDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleSeparatorDragLeave: () => void;
  handleSeparatorDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void;
  handleContextMenu: (e: React.MouseEvent<HTMLDivElement | SVGSVGElement>, id: string) => void;
  handleContextMenuItemClick: (action: string) => void;
  setIsAddButtonFocused: React.Dispatch<React.SetStateAction<boolean>>;
  hoveringOverSeparatorIndex: number | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  /////////////// Page Data & Lifecycle Section ///////////////
  const [pages, setPages] = useState<Page[]>([
    { id: '1', name: 'Info' },
    { id: '2', name: 'Details' },
    { id: '3', name: 'Other' },
    { id: '4', name: 'Ending' },
  ]);

  const [activePageId, setActivePageId] = useState<string | null>(() => (pages.length > 0 ? pages[0].id : null));
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [hoveredPageId, setHoveredPageId] = useState<string | null>(null);

  //   Manages the active page selection.
  useEffect(() => {
    if (pages.length > 0 && (!activePageId || !pages.some((p) => p.id === activePageId))) {
      setActivePageId(pages[0].id);
    } else if (pages.length === 0) {
      setActivePageId(null);
    }
  }, [pages, activePageId]);

  const handlePageClick = (id: string) => {
    if (editingPageId !== id) {
      setActivePageId(id);
    }
  };

  const handlePageFocus = (id: string) => {
    setActivePageId(id);
    setContextMenuState((prev) => ({ ...prev, visible: false, pageId: null }));
  };

  const handlePageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setPages(pages.map((page) => (page.id === editingPageId ? { ...page, name: newName } : page)));
  };

  const handlePageNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditingPageId(null);
      e.currentTarget.blur();
    }
  };

  const handlePageNameBlur = () => {
    setEditingPageId(null);
  };

  /////////////// Drag and Drop Section ///////////////
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [draggedOverPageId, setDraggedOverPageId] = useState<string | null>(null);
  const [hoveringOverSeparatorIndex, setHoveringOverSeparatorIndex] = useState<number | null>(null);
  const [droppedPageId, setDroppedPageId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedPageId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setShowAddButton({ visible: false, index: -1 });
    setContextMenuState((prev) => ({ ...prev, visible: false }));
    if (addButtonTimeoutRef.current) {
      clearTimeout(addButtonTimeoutRef.current);
    }
    setEditingPageId(null);
    setActivePageId(id);
    setDroppedPageId(null);
    setHoveredPageId(null);
  };

  const handlePageDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverPageId(id);
    setHoveringOverSeparatorIndex(null);
  };

  const handlePageDragLeave = () => {
    setDraggedOverPageId(null);
  };

  const handlePageDrop = (e: React.DragEvent<HTMLDivElement>, dropTargetId: string) => {
    e.preventDefault();
    const idToMove = e.dataTransfer.getData('text/plain');

    if (!idToMove || idToMove === dropTargetId) {
      setDraggedPageId(null);
      setDraggedOverPageId(null);
      setHoveringOverSeparatorIndex(null);
      return;
    }

    const draggedPageIndex = pages.findIndex((page) => page.id === idToMove);
    const dropTargetIndex = pages.findIndex((page) => page.id === dropTargetId);

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggedPageIndex, 1);
    newPages.splice(dropTargetIndex, 0, draggedPage);

    setPages(newPages);
    setDraggedPageId(null);
    setDraggedOverPageId(null);
    setHoveringOverSeparatorIndex(null);
    setDroppedPageId(draggedPage.id);
    setTimeout(() => {
      setDroppedPageId(null);
    }, 300);
  };

  const handleDragEnd = () => {
    setDraggedPageId(null);
    setDraggedOverPageId(null);
    setHoveringOverSeparatorIndex(null);
  };

  const handleSeparatorDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveringOverSeparatorIndex(index);
    setDraggedOverPageId(null);
  };

  const handleSeparatorDragLeave = () => {
    setHoveringOverSeparatorIndex(null);
  };

  const handleSeparatorDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const idToMove = e.dataTransfer.getData('text/plain');

    if (!idToMove) {
      setDraggedPageId(null);
      setHoveringOverSeparatorIndex(null);
      return;
    }

    const draggedPageIndex = pages.findIndex((page) => page.id === idToMove);
    if (draggedPageIndex === -1) {
      setDraggedPageId(null);
      setHoveringOverSeparatorIndex(null);
      return;
    }

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggedPageIndex, 1);
    const adjustedDropIndex = draggedPageIndex < dropIndex ? dropIndex - 1 : dropIndex;

    newPages.splice(adjustedDropIndex, 0, draggedPage);

    setPages(newPages);
    setDraggedPageId(null);
    setHoveringOverSeparatorIndex(null);
    setDraggedOverPageId(null);
    setDroppedPageId(draggedPage.id);
    setTimeout(() => {
      setDroppedPageId(null);
    }, 300);
  };

  /////////////// Add Page Circle Icon and Seperator Section ///////////////

  const [showAddButton, setShowAddButton] = useState<{ visible: boolean; index: number }>({
    visible: false,
    index: -1,
  });
  const [isAddButtonFocused, setIsAddButtonFocused] = useState<boolean>(false);
  const [buttonRotations, setButtonRotations] = useState<{ [key: number]: number }>({});
  const [buttonGlowStates, setButtonGlowStates] = useState<{ [key: number]: boolean }>({});

  const addButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSeparatorMouseEnter = (index: number) => {
    if (addButtonTimeoutRef.current) {
      clearTimeout(addButtonTimeoutRef.current);
    }
    setShowAddButton({ visible: true, index });
    setButtonRotations((prev) => ({ ...prev, [index]: 180 }));
  };

  const handleSeparatorMouseLeave = () => {
    addButtonTimeoutRef.current = setTimeout(() => {
      setShowAddButton({ visible: false, index: -1 });
      setButtonRotations((prev) => {
        const newRotations = { ...prev };
        if (showAddButton.index !== -1) {
          delete newRotations[showAddButton.index];
        }
        return newRotations;
      });
      setButtonGlowStates((prev) => {
        const newGlowStates = { ...prev };
        if (showAddButton.index !== -1) {
          delete newGlowStates[showAddButton.index];
        }
        return newGlowStates;
      });
    }, 100);
  };

  const handleAddButtonMouseEnter = (index: number) => {
    setButtonRotations((prev) => ({ ...prev, [index]: (prev[index] || 0) + 180 }));
    setButtonGlowStates((prev) => ({ ...prev, [index]: true }));
  };

  const handleAddButtonMouseLeave = (index: number) => {
    setButtonGlowStates((prev) => ({ ...prev, [index]: false }));
  };

  const handleAddPage = (index: number = -1) => {
    const newId = (pages.length > 0 ? Math.max(...pages.map((p) => parseInt(p.id))) + 1 : 1).toString();
    const newPage: Page = { id: newId, name: `New Page ${newId}` };

    const newPages = [...pages];
    if (index === -1 || index > pages.length) {
      newPages.push(newPage);
    } else {
      newPages.splice(index, 0, newPage);
    }
    setPages(newPages);

    setShowAddButton({ visible: false, index: -1 });
    if (addButtonTimeoutRef.current) {
      clearTimeout(addButtonTimeoutRef.current);
    }
    setActivePageId(newPage.id);
    setButtonRotations((prev) => {
      const newRotations = { ...prev };
      delete newRotations[index];
      return newRotations;
    });
    setButtonGlowStates((prev) => {
      const newGlowStates = { ...prev };
      delete newGlowStates[index];
      return newGlowStates;
    });
  };

  /////////////// Context Menu Section ///////////////

  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    pageId: null,
    transformOrigin: 'top left',
  });

  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  // handles right-click context menu for a page item.
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement | SVGSVGElement>, id: string) => {
    e.preventDefault();
    setActivePageId(id);

    setContextMenuState({
      visible: true,
      x: 0,
      y: 0,
      pageId: id,
      transformOrigin: 'top left',
    });
  };

  const hideContextMenu = useCallback(() => {
    setContextMenuState((prevState) => ({ ...prevState, visible: false, pageId: null }));
  }, []);

  //Adds/removes a global click listener to hide the context menu.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        hideContextMenu();
      }
    };

    if (contextMenuState.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenuState.visible, hideContextMenu]);

  const handleContextMenuItemClick = (action: string) => {
    const pageId = contextMenuState.pageId;
    hideContextMenu();

    switch (action) {
      case 'setAsFirst':
        setPages((prevPages) => {
          const pageToMove = prevPages.find((p) => p.id === pageId);
          if (!pageToMove) return prevPages;
          const filteredPages = prevPages.filter((p) => p.id !== pageId);
          return [pageToMove, ...filteredPages];
        });
        break;
      case 'rename':
        if (pageId) {
          setEditingPageId(pageId);
        }
        break;
      case 'copy':
        console.log(`Copy page: ${pageId}`);
        // To Do: Implement copy logic here
        break;
      case 'duplicate':
        setPages((prevPages) => {
          const pageToDuplicate = prevPages.find((p) => p.id === pageId);
          if (!pageToDuplicate) return prevPages;
          const newId = (Math.max(...prevPages.map((p) => parseInt(p.id))) + 1).toString();
          const duplicatedPage: Page = { ...pageToDuplicate, id: newId, name: `${pageToDuplicate.name} (Copy)` };
          const insertIndex = prevPages.findIndex((p) => p.id === pageId) + 1;
          const newArr = [...prevPages];
          newArr.splice(insertIndex, 0, duplicatedPage);
          return newArr;
        });
        setActivePageId(null);
        break;
      case 'delete':
        setPages((prevPages) => {
          const newPages = prevPages.filter((page) => page.id !== pageId);
          if (pageId === activePageId) {
            const deletedPageIndex = prevPages.findIndex((p) => p.id === pageId);
            if (newPages.length > 0) {
              setActivePageId(newPages[Math.min(deletedPageIndex, newPages.length - 1)].id);
            } else {
              setActivePageId(null);
            }
          }
          return newPages;
        });
        break;
      default:
        break;
    }
  };

  const contextValue: AppContextType = {
    pages,
    activePageId,
    editingPageId,
    hoveredPageId,
    draggedPageId,
    draggedOverPageId,
    droppedPageId,
    showAddButton,
    isAddButtonFocused,
    buttonRotations,
    buttonGlowStates,
    contextMenuState,
    contextMenuRef,
    hoveringOverSeparatorIndex,

    setHoveredPageId,
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
    handleAddPage,
    handleSeparatorMouseEnter,
    handleSeparatorMouseLeave,
    handleAddButtonMouseEnter,
    handleAddButtonMouseLeave,
    handleSeparatorDragOver,
    handleSeparatorDragLeave,
    handleSeparatorDrop,
    handleContextMenu,
    handleContextMenuItemClick,
    setIsAddButtonFocused,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
