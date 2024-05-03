import { ChangeEvent, useCallback, useRef } from 'react';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Link,
	NextUIProvider,
} from '@nextui-org/react';
import { VscCloseAll, VscExport, VscFile, VscGithub, VscSave } from 'react-icons/vsc';

import CardContentConfigurator from './components/CardContentConfigurator';
import CardMetaInfos from './components/CardMetaInfos';
import CardVisualizer from './components/CardVisualizer';
import CardBuilder from './tools/cardBuilder.ts';
import Storage from './tools/storage.ts';
import { downloadFile, readFile } from './tools/file.ts';

import './App.css';
import './textures.css';

Storage.init(CardBuilder);

function App() {
	const title = CardBuilder.use('title');
	const visualizerRef = useRef(null);
	const inputLoadFileRef = useRef<HTMLInputElement>(null);

	const downloadImage = useCallback(() => {
		(visualizerRef.current as any)?.downloadImage();
	}, [visualizerRef.current]);

	const resetCard = useCallback(() => {
		CardBuilder.initCard();
	}, [CardBuilder]);

	const loadFile = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target?.files?.[0];

			if (!file) return;

			const fileContent = (await readFile(file)) as string;

			CardBuilder.initCardFromString(fileContent);
		},
		[CardBuilder],
	);

	const saveFile = useCallback(() => {
		const f = new Blob([CardBuilder.getCurrentCardToString()], {
			type: 'application/json',
		});

		downloadFile(URL.createObjectURL(f), `${title}.dcf`);
	}, [title]);

	const openFileExplorer = useCallback(() => {
		if (inputLoadFileRef.current) {
			inputLoadFileRef.current.click();
		}
	}, []);

	return (
		<NextUIProvider style={{ width: '100%', height: '100%' }}>
			<main className={`text-foreground w-full h-full flex flex-col`}>
				<div className="grid grid-cols-6 grid-rows-6 gap-4 justify-stretch items-stretch max-w-full max-h-full h-0 flex-1 p-4 auto-rows-fr">
					<div className="flex flex-col col-span-1 row-span-3">
						<Card className="flex-shrink-0 flex-grow">
							<CardHeader>
								<span className="font-title text-2xl tracking-tighter font-light">
									Dhalmel Card Creator
								</span>
							</CardHeader>

							<CardBody>
								<Button startContent={<VscFile />} onClick={openFileExplorer}>
									Charger
								</Button>

								<Button
									startContent={<VscSave />}
									onClick={saveFile}
									className="mt-2">
									Sauvegarder
								</Button>

								<input
									type="file"
									accept=".dcf,.json"
									className="hidden"
									onChange={loadFile}
									ref={inputLoadFileRef}
								/>

								<Button
									startContent={<VscExport />}
									className="mt-2"
									onClick={downloadImage}>
									Exporter
								</Button>

								<Button
									startContent={<VscCloseAll />}
									onClick={resetCard}
									className="mt-2"
									color="danger">
									Réinitialiser
								</Button>
							</CardBody>
							<CardFooter>
								<Button
									isExternal
									fullWidth={true}
									variant="ghost"
									startContent={<VscGithub />}
									as={Link}
									href="https://github.com/AamuLumi/dhalmel-card-creator"
									color="success">
									Github
								</Button>
							</CardFooter>
						</Card>
					</div>

					<div className="flex col-span-3 row-span-6">
						<CardVisualizer ref={visualizerRef} />
					</div>

					<div className="flex col-span-2 row-span-6">
						<CardContentConfigurator />
					</div>

					<div className="flex flex-col col-span-1 row-span-3">
						<CardMetaInfos />
					</div>
				</div>
			</main>
		</NextUIProvider>
	);
}

export default App;
