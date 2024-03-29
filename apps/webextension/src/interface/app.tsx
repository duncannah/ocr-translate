import React from "react";
import { useImmer } from "use-immer";
import { merge } from "lodash-es";
import { Area, translationServices, OCRLanguages } from "@ocr-translate/shared";
import { MessageType, ResponseType } from "../background/message";
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
				value={value ?? ``}
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
	const [ocrLanguage, setOCRLanguage] = React.useState<keyof typeof OCRLanguages>(``);
	const [location, setLocation] = React.useState<string>(window.location.href);

	const element = React.useRef<HTMLDivElement>(null);

	const draggable = useDraggable();

	const startDrawing = () => {
		setMode(AppMode.Draw);
		setSelectedArea(new Date().getTime());
	};

	const startCapturing = React.useCallback(
		(id: number, area: Area, language: typeof ocrLanguage) => {
			element.current?.style.setProperty(`opacity`, `0`);

			setAreas((areas) => {
				delete areas[id].error;
			});

			window.requestAnimationFrame(() =>
				window.requestAnimationFrame(async () => {
					try {
						const [captured, ocrd] = OCROnArea(area, language);

						captured.finally(() => {
							element.current?.style.setProperty(`opacity`, `1`);
						});

						const text = await ocrd;

						setAreas((areas) => {
							areas[id].area.original = text;
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
		},
		[setAreas],
	);

	const addArea = React.useCallback(
		(area: Area) => {
			setAreas((areas) => {
				areas[selectedArea] = {
					id: selectedArea,
					area,
				};
			});

			startCapturing(selectedArea, area, ocrLanguage);

			setMode(AppMode.Idle);
		},
		[selectedArea, ocrLanguage, setAreas, startCapturing],
	);

	const removeCurrentArea = () => {
		setAreas((areas) => {
			const keys = Object.keys(areas);
			const index = keys.indexOf(String(selectedArea));

			setSelectedArea(Number(keys[index + 1] ?? keys[index - 1] ?? -1));

			delete areas[selectedArea];
		});
	};

	const updateCurrentArea = (area: Partial<Area>) => {
		if (selectedArea === -1) return;

		setAreas((areas) => {
			areas[selectedArea] = merge(areas[selectedArea], {
				area,
			});
		});
	};

	React.useEffect(() => {
		const messageListener: Parameters<typeof chrome.runtime.onMessage.addListener>[0] = (request, sender, sendResponse: (response: ResponseType) => void) => {
			(async () => {
				switch (request.type) {
					case MessageType.HistoryStateUpdated: {
						setLocation(window.location.href);

						return;
					}
				}

				throw new Error(`Unknown message type`);
			})().catch((error) => {
				sendResponse({ type: MessageType.Error, error: String(error) });
			});

			return true;
		};

		chrome.runtime.onMessage.addListener(messageListener);

		return () => chrome.runtime.onMessage.removeListener(messageListener);
	});

	React.useEffect(() => {
		setAreas({});
	}, [setAreas, location]);

	const { area } = areas[selectedArea] ?? {};

	return (
		<div ref={element}>
			{mode === AppMode.Draw && <AreaDrawingArea {...{ addArea, isDrawing, setIsDrawing }} />}

			<div className={styles[`container`]} style={{ visibility: isDrawing ? `hidden` : `visible` }}>
				<div className={styles[`top`]} ref={draggable}>
					{`OCR-Translate`}
				</div>

				<div className={styles[`content`]}>
					<div className={styles[`options`]}>
						<div className={styles[`langSelect`]}>
							<select id={`langSelect-from`} onChange={(e) => setOCRLanguage(e.target.value as typeof ocrLanguage)} value={ocrLanguage}>
								{Object.entries(OCRLanguages).map(([key, value]) => (
									<option key={key} value={key}>
										{value}
									</option>
								))}
							</select>
							{`→`}
							<select id={`langSelect-to`}>
								{/* TODO: Add more languages */}
								<option value={`en`}>{`English`}</option>
							</select>
						</div>
						<div className={styles[`actions`]}>
							<button onClick={removeCurrentArea}>
								<XIcon /> {`Remove`}
							</button>
							<button onClick={startDrawing}>
								<PlusIcon /> {`Add`}
							</button>
						</div>
					</div>
					<TextBox name={`Original`} areaKey={`original`} value={area?.original ?? ``} updateCurrentArea={updateCurrentArea} />
					<TextBox name={`Translated`} areaKey={`translated`} value={area?.translated ?? ``} updateCurrentArea={updateCurrentArea} />
					<hr />
					{translationServices.map(([id, name]) => (
						<TextBox key={id} areaKey={id} name={name} value={area?.translations?.[id]} />
					))}
				</div>
			</div>

			<AreasRenderer {...{ areas: Object.values(areas), setSelectedArea, selectedArea }} />
		</div>
	);
}

export default App;
