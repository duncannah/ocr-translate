import { ErrorIcon, LoadingIcon } from "../icons";
import { AreaContainer } from "../utils/area";

import styles from "./AreasRenderer.module.scss";

interface AreaElementProps {
	container: AreaContainer;
	isSelected: boolean;
}

function AreaElement({ container, isSelected }: AreaElementProps) {
	const { area, error } = container;

	return (
		<div
			className={`${styles[`area`]} ${isSelected ? styles[`selected`] : ``}`}
			style={{
				left: `${area.x}px`,
				top: `${area.y}px`,
				width: `${area.width}px`,
				height: `${area.height}px`,
			}}>
			<span>{(area.translated || area.original) ?? (error ? <ErrorIcon /> : <LoadingIcon />)}</span>
		</div>
	);
}

interface AreasRendererProps {
	areas: AreaContainer[];
	selectedArea: number;
}

export function AreasRenderer({ areas, selectedArea }: AreasRendererProps) {
	return (
		<>
			{areas.map((container) => (
				<AreaElement key={container.id} container={container} isSelected={Number(container.id) === selectedArea} />
			))}
		</>
	);
}
