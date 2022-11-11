import { LoadingIcon } from "../icons";
import { Area } from "@ocr-translate/shared";

import styles from "./AreasRenderer.module.scss";

interface AreaElementProps {
	area: Area;
	isSelected: boolean;
}

function AreaElement({ area, isSelected }: AreaElementProps) {
	return (
		<div
			className={`${styles[`area`]} ${isSelected ? styles[`selected`] : ``}`}
			style={{
				left: `${area.x}px`,
				top: `${area.y}px`,
				width: `${area.width}px`,
				height: `${area.height}px`,
			}}>
			{area.translated ?? area.original ?? (
				<span>
					<LoadingIcon />
				</span>
			)}
		</div>
	);
}

interface AreasRendererProps {
	areas: Area[];
	selectedArea: number;
}

export function AreasRenderer({ areas, selectedArea }: AreasRendererProps) {
	return (
		<>
			{areas.map((area, i) => (
				<AreaElement key={i} isSelected={selectedArea === i} {...{ area }} />
			))}
		</>
	);
}
