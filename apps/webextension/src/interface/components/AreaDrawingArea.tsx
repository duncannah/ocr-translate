import React from "react";
import { Area } from "@ocr-translate/shared";
import { AreasRenderer } from "./AreasRenderer";

import styles from "./AreaDrawingArea.module.scss";

const getMouseCoords = (e: React.MouseEvent) => {
	const x = window.scrollX + e.clientX;
	const y = window.scrollY + e.clientY;

	return { x, y };
};

interface AreaDrawingAreaProps {
	addArea: (area: Area) => void;
	isDrawing: boolean;
	setIsDrawing: (isDrawing: boolean) => void;
}
export function AreaDrawingArea({ addArea, isDrawing, setIsDrawing }: AreaDrawingAreaProps) {
	const [coords, setCoords] = React.useState({ startX: 0, startY: 0, endX: 0, endY: 0 });

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		setIsDrawing(true);

		const { x, y } = getMouseCoords(e);
		setCoords({
			startX: x,
			startY: y,
			endX: x,
			endY: y,
		});
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isDrawing) {
			const { x, y } = getMouseCoords(e);

			setCoords((coords) => ({
				...coords,
				endX: x,
				endY: y,
			}));
		}
	};

	const handleMouseUp = () => {
		setIsDrawing(false);

		const x = Math.min(coords.startX, coords.endX);
		const y = Math.min(coords.startY, coords.endY);
		const width = Math.abs(coords.startX - coords.endX);
		const height = Math.abs(coords.startY - coords.endY);

		if (width >= 20 && height >= 20) addArea({ x, y, width, height });
	};

	return (
		<>
			<div
				className={`${styles[`drawingArea`]} ${isDrawing ? styles[`isDrawing`] : ``}`}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}></div>
			{isDrawing && (
				<AreasRenderer
					areas={[
						{
							x: Math.min(coords.startX, coords.endX),
							y: Math.min(coords.startY, coords.endY),
							width: Math.abs(coords.startX - coords.endX),
							height: Math.abs(coords.startY - coords.endY),
							original: ``,
						},
					]}
					selectedArea={0}
				/>
			)}
		</>
	);
}
