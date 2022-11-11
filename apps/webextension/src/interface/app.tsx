import React from "react";
import { Area, translationServices } from "@ocr-translate/shared";
import { AreaDrawingArea } from "./components/AreaDrawingArea";
import { AreasRenderer } from "./components/AreasRenderer";
import { useDraggable } from "./hooks/useDraggable";
import { PlusIcon, XIcon } from "./icons";

import styles from "./app.module.scss";

enum AppMode {
	Idle,
	Draw,
}

export function App() {
	const [mode, setMode] = React.useState(AppMode.Idle);
	const [isDrawing, setIsDrawing] = React.useState(false);
	const [areas, setAreas] = React.useState<Area[]>([]);
	const [selectedArea, setSelectedArea] = React.useState<number>(-1);

	const draggable = useDraggable();

	const startDrawing = () => {
		setMode(AppMode.Draw);
		setSelectedArea(areas.length);
	};

	const addArea = (area: Area) => {
		setAreas((areas) => [...areas, area]);

		setMode(AppMode.Idle);
	};

	const removeCurrentArea = () => {
		setAreas((areas) => areas.filter((_, i) => i !== selectedArea));

		if (areas.length === 1) setSelectedArea(-1);
		else if (selectedArea === areas.length - 1) setSelectedArea(selectedArea - 1);
	};

	return (
		<>
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
		</>
	);
}

export default App;
