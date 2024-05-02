import { DCC } from './cardBuilder.ts';

export const getTemplateName = (t: DCC.Template) => {
	switch (t) {
		case 'classic':
			return 'Classique';
		case 'fullart':
			return 'Full-art';
		case 'eorzean':
			return 'Eorzéen';
	}
};

export const getRarityName = (t: DCC.Rarity) => {
	switch (t) {
		case 'common':
			return 'Commun';
		case 'rare':
			return 'Rare';
		case 'epic':
			return 'Epique';
		case 'eternal':
			return 'Eternelle';
		case 'legendary':
			return 'Légendaire';
		case 'mythic':
			return 'Mythique';
		case 'relic':
			return 'Relique';
	}
};

export const getTypeName = (t: DCC.Type) => {
	switch (t) {
		case 'action':
			return 'Action';
		case 'human':
			return 'Humain';
		case 'god':
			return 'Dieu';
		case 'ascian':
			return 'Ascien';
		case 'creature':
			return 'Créature';
		case 'imperial':
			return 'Impérial';
		case 'item':
			return 'Objet';
		case 'primordial':
			return 'Primordial';
		case 'land':
			return 'Terrain';
		case 'mount':
			return 'Monture';
		case 'scion':
			return 'Héritier';
	}
};
