export const convertBase64 = (file: File) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
};

export function imageSize(url: string) {
	const img = document.createElement('img');

	const promise = new Promise<{ width: number; height: number }>((resolve, reject) => {
		img.onload = () => {
			// Natural size is the actual image size regardless of rendering.
			// The 'normal' `width`/`height` are for the **rendered** size.
			const width = img.naturalWidth;
			const height = img.naturalHeight;

			// Resolve promise with the width and height
			resolve({ width, height });
		};

		// Reject promise on error
		img.onerror = reject;
	});

	// Setting the source makes it start downloading and eventually call `onload`
	img.src = url;

	return promise;
}

export function readFile(file: File) {
	if (!file) {
		return;
	}

	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onload = (e) => {
			const buffer = e.target?.result;

			resolve(String(buffer));
		};
		reader.onerror = (err) => {
			reject(err);
		};
		reader.readAsText(file);
	});
}

export function downloadFile(url: string, name: string) {
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = name;
	anchor.click();
	anchor.remove();
}
