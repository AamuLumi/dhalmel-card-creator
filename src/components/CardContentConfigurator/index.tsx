import { Card, CardBody, Input, Slider, Textarea } from '@nextui-org/react';
import { ChangeEvent } from 'react';
import CardBuilder from '../../tools/cardBuilder.ts';
import RadioList, { RadioListItem } from '../../atoms/RadioList';
import { getRarityName, getTemplateName, getTypeName } from '../../tools/text.ts';
import { DCC } from '../../tools/types.ts';
import { convertBase64, imageSize } from '../../tools/file.ts';
import Constants from '../../tools/constants.ts';

export default function CardContentConfigurator(_: any) {
	const type = CardBuilder.use('type');
	const collectionName = CardBuilder.use('collectionName');
	const title = CardBuilder.use('title');
	const code = CardBuilder.use('code');
	const credit = CardBuilder.use('credit');
	const description = CardBuilder.use('description');
	const illustratorName = CardBuilder.use('illustratorName');
	const rarity = CardBuilder.use('rarity');
	const template = CardBuilder.use('template');
	const horizontalOffset = CardBuilder.use('horizontalOffset');
	const verticalOffset = CardBuilder.use('verticalOffset');
	const scale = CardBuilder.use('scale');

	const onCodeChange = (e: string) => {
		CardBuilder.Setters.setCode(parseInt(e, 10));
	};

	const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const file = e.target?.files?.[0];

		if (!file) {
			return;
		}

		const base64 = (await convertBase64(file)) as string;
		const { width, height } = await imageSize(base64);

		CardBuilder.Setters.setImage({
			data: base64,
			height,
			width,
		});
	};

	return (
		<Card className="flex-grow">
			<CardBody>
				<Input
					type="text"
					label="Nom"
					value={title}
					onValueChange={CardBuilder.Setters.setTitle}
				/>

				<Input
					className="mt-4"
					type="number"
					min={0}
					max={9999}
					label="Code"
					value={code}
					onValueChange={onCodeChange}
				/>

				<Textarea
					className="mt-4"
					type="text"
					label="Description"
					value={description}
					onValueChange={CardBuilder.Setters.setDescription}
				/>

				<div className="mt-4 flex w-full items-center justify-between space-x-4 p-2 border-2  hover:border-gray-400 rounded-xl transition-colors duration-300">
					<input
						type="file"
						accept=".png,.jpg,.jpeg,.webp,.bmp"
						name="image"
						onChange={onImageChange}
						className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
					/>
				</div>

				<div className="mt-4 flex flex-row">
					<Slider
						className="flex-shrink"
						label={'Position horizontale'}
						step={0.01}
						minValue={0}
						maxValue={1}
						formatOptions={{ style: 'percent' }}
						showTooltip
						value={horizontalOffset}
						onChange={CardBuilder.Setters.setHorizontalOffset as any}
					/>

					<Slider
						className="flex-shrink ml-2"
						label={'Position verticale'}
						step={0.01}
						minValue={0}
						maxValue={1}
						formatOptions={{ style: 'percent' }}
						showTooltip
						value={verticalOffset}
						onChange={CardBuilder.Setters.setVerticalOffset as any}
					/>
				</div>

				<Slider
					className="flex-shrink mt-2"
					label={'Zoom'}
					step={0.05}
					minValue={1}
					maxValue={8}
					showTooltip
					value={scale}
					onChange={CardBuilder.Setters.setScale as any}
				/>

				<RadioList
					className="mt-4"
					label="Template"
					onValueChange={CardBuilder.Setters.setTemplate}
					value={template}>
					{Constants.Templates.map((type) => (
						<RadioListItem key={type} value={type}>
							{getTemplateName(type as DCC.Template)}
						</RadioListItem>
					))}
				</RadioList>

				<RadioList
					className="mt-4"
					label="Type"
					onValueChange={CardBuilder.Setters.setType}
					value={type}>
					{Constants.Types.sort((a, b) =>
						getTypeName(a as DCC.Type).localeCompare(getTypeName(b as DCC.Type)),
					).map((type) => (
						<RadioListItem key={type} value={type}>
							{getTypeName(type as DCC.Type)}
						</RadioListItem>
					))}
				</RadioList>

				<RadioList
					className="mt-4"
					label="Rareté"
					onValueChange={CardBuilder.Setters.setRarity}
					value={rarity}>
					{Constants.Rarities.map((rarity) => (
						<RadioListItem key={rarity} value={rarity}>
							{getRarityName(rarity as DCC.Rarity)}
						</RadioListItem>
					))}
				</RadioList>

				<Input
					className="mt-4"
					type="text"
					label="Collection"
					value={collectionName}
					onValueChange={CardBuilder.Setters.setCollectionName}
				/>

				<Input
					className="mt-4"
					type="text"
					label="Crédit"
					value={credit}
					onValueChange={CardBuilder.Setters.setCredit}
				/>

				<Input
					className="mt-4"
					type="text"
					label="Illustrateur•trice"
					value={illustratorName}
					onValueChange={CardBuilder.Setters.setIllustratorName}
				/>
			</CardBody>
		</Card>
	);
}
