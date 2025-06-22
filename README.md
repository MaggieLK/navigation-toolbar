# Page Navigation Toolbar
This is a dynamic and interactive page navigation toolbar built with React and Tailwind CSS. It allows users to easily navigate, add, rename, duplicate, reorder, and delete pages within a sleek, responsive interface. The application features an animated background (from my 100 days of CSS project https://codepen.io/collection/DxNzrp?cursor=eyJwYWdlIjoxfQ==) and a context menu for advanced page management.

## Features
Page Navigation: Click on any page to make it active.s

Drag & Drop Reordering: Reorder pages intuitively by dragging and dropping them. Pages can be dropped onto other pages or into the separators between them.

Context Menu: Right-click on a page (or click the three dots icon when a page is active) to open a context menu with the following actions:

Set as first page: Moves the selected page to the beginning of the list.

Rename: Allows inline editing of the page name.

Copy: Not yet implemented - copying page content.

Duplicate: Creates an exact copy of the page and inserts it next to the original.

Delete: Removes the selected page from the toolbar.

Dynamic Add Page Buttons: Hover between pages or at the beginning of the toolbar to reveal an "Add Page" button, allowing precise insertion of new pages.

Always-Visible "Add Page" Button: A convenient button at the end of the toolbar to quickly add new pages.

Animated Background: A subtle twinkling and shooting star animation in the background enhances the visual appeal.

Modern UI/UX: Utilizes Tailwind CSS for a clean, modern look, with smooth transitions and animations.

## Components Overview
The application is structured into several React components and a central context for state management:

App: The main entry point that wraps the entire application with the AppProvider.

AppProvider (src/context/AppContext.tsx): Manages the global state and functions related to pages, active/editing states, drag-and-drop, and the context menu. It provides a useAppContext hook for child components to consume this state.

AppContent (src/AppContent.tsx): The primary UI component that consumes the AppContext and renders the overall layout, including the background, title, toolbar, and context menu.

BackgroundAnimation (src/components/BackgroundAnimation.tsx): Responsible for rendering the animated stars and shooting stars in the background.

PageItem (src/components/PageItem.tsx): Represents an individual page button. It handles clicks, drag-and-drop interactions, name editing, and context menu triggering.

AddPageButton (src/components/AddPageButton.tsx): Renders the interactive separator/add button that appears on hover between pages or at the beginning. It also serves as a drop target for dragged pages.

ContextMenu (src/components/ContextMenu.tsx): Displays the right-click context menu, handling its positioning to ensure it stays within the viewport and offers various page actions.

## How to Use
Navigate Pages: Click on any page button to make it the active page.

Open the Menu: Right-click on a page or click the three vertical dots icon that appears when a page is active.

Rename a Page: From the menu, select "Rename". The page name will become an editable input field. Type the new name and press Enter or click outside the input field to save.

Reorder Pages: Click and hold (drag) a page button. Drag it over another page or over the dashed separators that appear and release.

Add Pages: Between existing pages: Hover your mouse cursor between two pages, or at the very beginning of the toolbar, and a circular + button with dashed lines will appear. Click this button to insert a new page at that specific spot. At the end: Click the "Add page" button located at the far right of the toolbar.

Duplicate a Page: From the menu, select "Duplicate". A copy of the page will be created next to the original.

Delete a Page: From the menu, select "Delete". The page will be removed from the toolbar.

Set as first page: From the menu, select "Set as first page". The selected page will move to the very beginning of the toolbar.

## Styling
Tailwind CSS: Used extensively for utility-first styling, enabling rapid UI development and ensuring responsiveness.

Custom CSS Animations: flickr for twinkling stars, shooting-star for moving stars, pop for dropped page animation, and unfold-menu for context menu appearance.

## Development Notes
Context API: React Context is used for global state management, allowing components to access shared data without prop drilling.

useLayoutEffect: Employed in the ContextMenu component to precisely position the menu after DOM mutations but before painting, preventing layout shifts and ensuring correct placement relative to the target element.

Ref Management: useRef is used to reference DOM elements (like the context menu) for direct measurements and event handling.

Event Handling: Comprehensive event listeners for drag-and-drop, mouse enter/leave, click, focus, blur, and context menu events ensure a rich user experience.