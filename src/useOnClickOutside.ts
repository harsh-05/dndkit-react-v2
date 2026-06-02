import { useEffect, useRef } from "react";

export function useOutsideClick(ref: React.RefObject<Element | null>, callback: (event: MouseEvent | TouchEvent)=> void) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!ref.current) return;
            if (ref.current.contains(event.target as Node)) return;
            callbackRef.current(event);
        };

        // Use { capture: true } to listen on the capturing phase
        document.addEventListener('click', handleClickOutside, { capture: true });
        // update touchstart to touchend to match the click 
        document.addEventListener('touchstart', handleClickOutside, { capture: true });

        return () => {
            // Make sure to pass { capture: true } to removeEventListener as well!
            document.removeEventListener('click', handleClickOutside, { capture: true });
            // update touchstart to touchend to match the click 
            document.removeEventListener('touchstart', handleClickOutside, { capture: true });
        };
    }, [ref]);
}