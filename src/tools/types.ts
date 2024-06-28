export namespace DCC {
	export type Rarity = 'common' | 'rare' | 'epic' | 'eternal' | 'legendary' | 'mythic' | 'relic';

	export type Template = 'classic' | 'eorzean' | 'fullart' | 'clean' | 'cursed';

	export type Type =
		| 'creature'
		| 'item'
		| 'land'
		| 'god'
		| 'action'
		| 'human'
		| 'imperial'
		| 'primordial'
		| 'scion'
		| 'ascian'
		| 'class'
		| 'mount';

	export type ArtFile = {
		data: string;
		width: number;
		height: number;
	};

	export type Texture = 'aluminium' | 'holographic' | 'foil' | 'none' | 'vhs' | 'negative';

	export type Card = {
		code: number;
		title: string;
		type: string;
		description: string;
		collectionName: string;
		illustratorName: string;
		credit: string;
		rarity: DCC.Rarity;
		template: DCC.Template;
		texture: DCC.Texture;
		/* DataURL img */
		image: ArtFile | null;
		horizontalOffset: number;
		verticalOffset: number;
		scale: number;
	};

	export type CardSetters = {
		setCode(n: number): void;
		setTitle(s: string): void;
		setType(s: string): void;
		setDescription(s: string): void;
		setCollectionName(s: string): void;
		setIllustratorName(s: string): void;
		setCredit(s: string): void;
		setRarity(s: string): void;
		setTemplate(s: string): void;
		setImage(s: ArtFile | null): void;
		setHorizontalOffset(n: number): void;
		setVerticalOffset(n: number): void;
		setScale(n: number): void;
		setTexture(s: string): void;
	};

	export type CardKeys = keyof Card;

	export type DevEvents = 'devMode';
}
