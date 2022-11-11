import { useCallback, useEffect, useRef } from "react";

export function useDraggable() {
	const ref = useRef<HTMLDivElement | null>(null);
	const onMouseDown = useCallback((e: MouseEvent) => {
		if (!ref.current) return;
		const el = ref.current.parentElement ?? ref.current;

		const { left, top } = el.getBoundingClientRect();
		const offsetX = e.clientX - left;
		const offsetY = e.clientY - top;

		const onMouseMove = (e: MouseEvent) => {
			el.style.left = `${Math.min(Math.max(e.clientX - offsetX, 0), window.innerWidth - el.clientWidth)}px`;
			el.style.top = `${Math.min(Math.max(e.clientY - offsetY, 0), window.innerHeight - el.clientHeight)}px`;
		};

		const onMouseUp = () => {
			document.removeEventListener(`mousemove`, onMouseMove);
			document.removeEventListener(`mouseup`, onMouseUp);
		};

		document.addEventListener(`mousemove`, onMouseMove);
		document.addEventListener(`mouseup`, onMouseUp);
	}, []);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		el.addEventListener(`mousedown`, onMouseDown);

		return () => {
			el.removeEventListener(`mousedown`, onMouseDown);
		};
	}, [onMouseDown]);

	return ref;
}
