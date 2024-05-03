import { Card, CardBody } from '@nextui-org/react';
import RadioList, { RadioListItem } from '../../atoms/RadioList';
import CardBuilder from '../../tools/cardBuilder.ts';
import { getTextureName } from '../../tools/text.ts';
import { DCC } from '../../tools/types.ts';
import Constants from '../../tools/constants.ts';

export default function CardMetaInfos(_: any) {
	const texture = CardBuilder.use('texture');

	return (
		<Card className="flex-shrink-0">
			<CardBody>
				<RadioList
					label="Texture"
					onValueChange={CardBuilder.Setters.setTexture}
					value={texture}>
					{Constants.Textures.map((type) => (
						<RadioListItem key={type} value={type}>
							{getTextureName(type as DCC.Texture)}
						</RadioListItem>
					))}
				</RadioList>
			</CardBody>
		</Card>
	);
}
