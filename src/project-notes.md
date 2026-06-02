Problem 1. DragOverlay flickering issue :

Solution : pasting this in global.css, seems to have fixed the issue.
    [data-dnd-overlay]:not([style*='--dnd-translate']) {
  display: none;
}


