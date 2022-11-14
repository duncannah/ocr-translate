import React from "react";
import { useImmer } from "use-immer";
import { Area, translationServices } from "@ocr-translate/shared";
import { AreaDrawingArea } from "./components/AreaDrawingArea";
import { AreasRenderer } from "./components/AreasRenderer";
import { useDraggable } from "./hooks/useDraggable";
import { AreaContainer, OCROnArea } from "./utils/area";
import { PlusIcon, XIcon } from "./icons";

import styles from "./app.module.scss";

enum AppMode {
	Idle,
	Draw,
}

export function App() {
	const [mode, setMode] = React.useState(AppMode.Idle);
	const [isDrawing, setIsDrawing] = React.useState(false);
	const [areas, setAreas] = useImmer<AreaContainer[]>([]);
	const [selectedArea, setSelectedArea] = React.useState<number>(-1);

	const element = React.useRef<HTMLDivElement>(null);

	const draggable = useDraggable();

	const startDrawing = () => {
		setMode(AppMode.Draw);
		setSelectedArea(new Date().getTime());
	};

	const startCapturing = (id: number, area: Area) => {
		element.current?.style.setProperty(`opacity`, `0`);

		window.requestAnimationFrame(() =>
			window.requestAnimationFrame(async () => {
				try {
					const [captured, ocrd] = OCROnArea(area);

					await captured;

					element.current?.style.setProperty(`opacity`, `1`);

					const text = await ocrd;

					setAreas((areas) => {
						const area = areas.find((a) => a.id === id);
						area && (area.area.original = text);
					});
				} catch (e) {
					console.error(e);

					setAreas((areas) => {
						const area = areas.find((a) => a.id === id);
						area && (area.error = String(e));
					});

					element.current?.style.setProperty(`opacity`, `1`);
				}
			}),
		);
	};

	const addArea = (area: Area) => {
		setAreas((areas) => {
			areas.push({
				id: selectedArea,
				area,
			});
		});

		startCapturing(selectedArea, area);

		setMode(AppMode.Idle);
	};

	const removeCurrentArea = () => {
		setAreas((areas) => {
			delete areas[selectedArea];

			const keys = Object.keys(areas).sort((a, b) => parseInt(a) - parseInt(b));
			const index = keys.indexOf(selectedArea.toString());
			setSelectedArea(parseInt(keys[index + 1] || keys[index - 1] || `-1`));
		});
	};

	return (
		<div ref={element}>
			{mode === AppMode.Draw && <AreaDrawingArea {...{ addArea, isDrawing, setIsDrawing }} />}

			<div className={styles[`container`]} style={{ visibility: isDrawing ? `hidden` : `visible` }}>
				<div className={styles[`top`]} ref={draggable}>
					{`OCR-Translate`}
				</div>

				<div className={styles[`content`]}>
					<div className={styles[`actions`]}>
						<button onClick={removeCurrentArea}>
							<XIcon /> {`Remove`}
						</button>
						<button onClick={startDrawing}>
							<PlusIcon /> {`Add`}
						</button>
					</div>
					<div className={styles[`textbox`]}>
						<div className={styles[`textbox-label`]}>{`Original`}</div>
						<textarea className={styles[`textarea`]}></textarea>
					</div>
					<div className={styles[`textbox`]}>
						<div className={styles[`textbox-label`]}>{`Translated`}</div>
						<textarea className={styles[`textarea`]}></textarea>
					</div>
					<hr />
					{translationServices.map(([id, name]) => (
						<div key={id} className={styles[`textbox`]}>
							<div className={styles[`textbox-label`]}>{name}</div>
							<textarea className={styles[`textarea`]} disabled></textarea>
						</div>
					))}
				</div>
			</div>

			<AreasRenderer {...{ areas, selectedArea }} />
		</div>
	);
}

export default App;
