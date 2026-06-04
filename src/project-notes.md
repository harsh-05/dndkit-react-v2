Problem 1. DragOverlay flickering issue :

Solution : pasting this in global.css, seems to have fixed the issue.
    [data-dnd-overlay]:not([style*='--dnd-translate']) {
  display: none;
}


Problem 2. removeChild error

      Possible Cause: 


Problem 3. OptimisticSortingPlugin silently aborts intra-column reordering after cross-column state mutations corrupt internal cache | |

            OptimisticSortingPlugin: intra-column sorting intermittently fails after cross-column drag operations


      