const dataURIToCanvas = (dataURI: string): Promise<HTMLCanvasElement> => {
	const img = new Image();
	img.src = dataURI;

	return new Promise((resolve, reject) => {
		img.onload = () => {
			const canvas = document.createElement(`canvas`);
			canvas.width = img.width;
			canvas.height = img.height;

			const ctx = canvas.getContext(`2d`);
			ctx?.drawImage(img, 0, 0);

			resolve(canvas);
		};

		img.onerror = reject;
	});
};

const cropCanvas = (canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number): HTMLCanvasElement => {
	const croppedCanvas = document.createElement(`canvas`);
	croppedCanvas.width = width;
	croppedCanvas.height = height;

	const ctx = croppedCanvas.getContext(`2d`);
	ctx?.drawImage(canvas, x, y, width, height, 0, 0, width, height);

	return croppedCanvas;
};

export const cropDataURI = (dataURI: string, x: number, y: number, width: number, height: number): Promise<string> => {
	return dataURIToCanvas(dataURI).then((canvas) => cropCanvas(canvas, x, y, width, height).toDataURL());
};
