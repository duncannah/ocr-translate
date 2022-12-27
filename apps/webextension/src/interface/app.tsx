import React from "react";
import { useImmer } from "use-immer";
import { merge } from "lodash-es";
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

interface TextBoxProps {
	name: string;
	areaKey: string;
	value?: string;
	updateCurrentArea?: (area: Partial<Area>) => void;
}

function TextBox({ name, areaKey, value, updateCurrentArea }: TextBoxProps) {
	const ref = React.useRef<HTMLTextAreaElement>(null);

	React.useEffect(() => {
		if (!ref.current) return;

		// Don't let the page override default behavior
		// [`input`].forEach((eventName) => {
		// 	ref.current?.addEventListener(eventName, (event) => {
		// 		event.stopPropagation();
		// 	});
		// });
	}, []);

	return (
		<div className={styles[`textbox`]}>
			<div className={styles[`textbox-label`]}>{name}</div>
			<textarea
				className={styles[`textarea`]}
				value={value}
				onChange={(e) => {
					updateCurrentArea &&
						updateCurrentArea({
							[areaKey]: e.target.value,
						});

					e.stopPropagation();
				}}
				ref={ref}
			/>
		</div>
	);
}

export function App() {
	const [mode, setMode] = React.useState(AppMode.Idle);
	const [isDrawing, setIsDrawing] = React.useState(false);
	const [areas, setAreas] = useImmer<Record<number, AreaContainer>>({});
	const [selectedArea, setSelectedArea] = React.useState<number>(-1);

	const element = React.useRef<HTMLDivElement>(null);

	const draggable = useDraggable();

	const startDrawing = () => {
		setMode(AppMode.Draw);
		setSelectedArea(new Date().getTime());
	};

	const startCapturing = (id: number, area: Area) => {
		element.current?.style.setProperty(`opacity`, `0`);

		setAreas((areas) => {
			delete areas[id].error;
		});

		window.requestAnimationFrame(() =>
			window.requestAnimationFrame(async () => {
				try {
					const [captured, ocrd] = OCROnArea(area);

					captured.finally(() => {
						element.current?.style.setProperty(`opacity`, `1`);
					});

					const text = await ocrd;

					setAreas((areas) => {
						areas[id].area.translated = text;
						delete areas[id].error;
					});
				} catch (e) {
					console.error(e);

					setAreas((areas) => {
						areas[id].error = String(e);
					});
				}
			}),
		);
	};

	const addArea = (area: Area) => {
		setAreas((areas) => {
			areas[selectedArea] = {
				id: selectedArea,
				area,
			};
		});

		startCapturing(selectedArea, area);

		setMode(AppMode.Idle);
	};

	const removeCurrentArea = () => {
		setAreas((areas) => {
			const keys = Object.keys(areas);
			const index = keys.indexOf(String(selectedArea));

			setSelectedArea(Number(keys[index + 1] ?? keys[index - 1] ?? -1));

			delete areas[selectedArea];
		});
	};

	const updateCurrentArea = (area: Partial<Area>) => {
		setAreas((areas) => {
			areas[selectedArea] = merge(areas[selectedArea], {
				area,
			});
		});
	};

	const { area } = areas[selectedArea] ?? {};

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
					<TextBox name={`Original`} areaKey={`original`} value={area?.original} updateCurrentArea={updateCurrentArea} />
					<TextBox name={`Translated`} areaKey={`translated`} value={area?.translated} updateCurrentArea={updateCurrentArea} />
					<hr />
					{translationServices.map(([id, name]) => (
						<TextBox areaKey={id} name={name} value={area?.translations?.[id]} />
					))}
				</div>
			</div>

			<AreasRenderer {...{ areas: Object.values(areas), setSelectedArea, selectedArea }} />
		</div>
	);
}

export default App;
