const translationServices = [
	[`google`, `Google`],
	[`microsoft`, `Microsoft`],
	[`yandex`, `Yandex`],
	[`deepl`, `DeepL`],
];

interface Area {
	x: number;
	y: number;
	width: number;
	height: number;

	original?: string;
	translated?: string;

	translations?: Record<string, string>;
}

export { translationServices, Area };
