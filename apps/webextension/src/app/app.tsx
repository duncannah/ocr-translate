import styles from "./app.module.scss";

export function App() {
	return (
		<div className={styles[`container`]}>
			<div className={styles[`top`]}>OCR-Translate</div>
		</div>
	);
}

export default App;
