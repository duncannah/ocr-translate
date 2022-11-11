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

export { dataURIToCanvas };
