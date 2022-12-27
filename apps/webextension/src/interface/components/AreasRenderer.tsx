import { ErrorIcon, LoadingIcon } from "../icons";
import { AreaContainer } from "../utils/area";
import { getShadowRoot } from "../utils/shadow";

import styles from "./AreasRenderer.module.scss";

interface AreaElementProps {
	container: AreaContainer;
	isSelected: boolean;
	handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function AreaElement({ container, isSelected, handleClick }: AreaElementProps) {
	const { area, error } = container;

	return (
		<div
			className={`${styles[`area`]} ${isSelected ? styles[`selected`] : ``}`}
			id={`area-${container.id}`}
			style={{
				left: `${area.x}px`,
				top: `${area.y}px`,
				width: `${area.width}px`,
				height: `${area.height}px`,
			}}
			onClick={handleClick}>
			<span>{(area.translated || area.original || area.translated) ?? (error ? <ErrorIcon /> : <LoadingIcon />)}</span>
		</div>
	);
}

interface AreasRendererProps {
	areas: AreaContainer[];
	setSelectedArea?: (id: number) => void;
	selectedArea: number;
}

export function AreasRenderer({ areas, setSelectedArea, selectedArea }: AreasRendererProps) {
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!setSelectedArea) return;

		const areaElements = getShadowRoot(e.currentTarget)
			?.elementsFromPoint(e.clientX, e.clientY)
			.filter((el) => el.id.startsWith(`area-`))
			.sort((a, b) => a.id.localeCompare(b.id));

		if (!areaElements || areaElements.length === 0) return;

		console.log(areaElements);

		for (let i = 0; i < areaElements.length; i++) {
			const element = areaElements[i];

			if (element.classList.contains(styles[`selected`])) {
				console.log(`Selected is ${i}`);

				const index = i === areaElements.length - 1 ? 0 : i + 1;

				console.log(index);

				return setSelectedArea(Number(areaElements[index].id.split(`-`)[1]));
			}
		}

		setSelectedArea(Number(areaElements[0].id.split(`-`)[1]));
	};

	return (
		<>
			{areas.map((container) => (
				<AreaElement key={container.id} container={container} isSelected={Number(container.id) === selectedArea} {...{ handleClick }} />
			))}
		</>
	);
}
