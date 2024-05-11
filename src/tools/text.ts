import { DCC } from './types.ts';

export const getTemplateName = (t: DCC.Template) => {
	switch (t) {
		case 'classic':
			return 'Classique';
		case 'fullart':
			return 'Full-art';
		case 'eorzean':
			return 'Eorzéen';
		case 'clean':
			return 'Clean';
		case 'cursed':
			return '[DEV] Cursed';
		default:
			return `MISSING_${t}`;
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
			return 'Eternel';
		case 'legendary':
			return 'Légendaire';
		case 'mythic':
			return 'Mythique';
		case 'relic':
			return 'Relique';
		default:
			return `MISSING_${t}`;
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
		default:
			return `MISSING_${t}`;
	}
};

export const getTextureName = (t: DCC.Texture) => {
	switch (t) {
		case 'aluminium':
			return 'Aluminium';
		case 'foil':
			return 'Foil';
		case 'holographic':
			return 'Holographique';
		case 'none':
			return 'Aucun';
		case 'vhs':
			return '[DEV] VHS';
		case 'negative':
			return '[DEV] Negative';
		default:
			return `MISSING_${t}`;
	}
};

// Zalgo Text Generation from https://github.com/Im-Rises/zalgo-generator/blob/main/src/zalgo-generator.ts
// Code has been changed to work on a deterministic pseudo random

/* Zalgo text arrays */

const zalgoUpArray: string[] = [
	'\u030d' /*     ̍    */,
	'\u030e' /*     ̎    */,
	'\u0304' /*     ̄     */,
	'\u0305' /*     ̅    */,
	'\u033f' /*     ̿    */,
	'\u0311' /*     ̑    */,
	'\u0306' /*     ̆     */,
	'\u0310' /*     ̐    */,
	'\u0352' /*     ͒    */,
	'\u0357' /*     ͗    */,
	'\u0351' /*     ͑    */,
	'\u0307' /*     ̇     */,
	'\u0308' /*     ̈     */,
	'\u030a' /*     ̊     */,
	'\u0342' /*     ͂    */,
	'\u0343' /*     ̓    */,
	'\u0344' /*     ̈́     */,
	'\u034a' /*     ͊    */,
	'\u034b' /*     ͋    */,
	'\u034c' /*     ͌    */,
	'\u0303' /*     ̃     */,
	'\u0302' /*     ̂     */,
	'\u030c' /*     ̌     */,
	'\u0350' /*     ͐    */,
	'\u0300' /*     ̀     */,
	'\u0301' /*     ́     */,
	'\u030b' /*     ̋     */,
	'\u030f' /*     ̏     */,
	'\u0312' /*     ̒     */,
	'\u0313' /*     ̓    */,
	'\u0314' /*     ̔    */,
	'\u033d' /*     ̽    */,
	'\u0309' /*     ̉     */,
	'\u0363' /*     ͣ    */,
	'\u0364' /*     ͤ    */,
	'\u0365' /*     ͥ    */,
	'\u0366' /*     ͦ    */,
	'\u0367' /*     ͧ    */,
	'\u0368' /*     ͨ    */,
	'\u0369' /*     ͩ    */,
	'\u036a' /*     ͪ    */,
	'\u036b' /*     ͫ    */,
	'\u036c' /*     ͬ    */,
	'\u036d' /*     ͭ    */,
	'\u036e' /*     ͮ    */,
	'\u036f' /*     ͯ    */,
	'\u033e' /*     ̾    */,
	'\u035b' /*     ͛    */,
	'\u0346' /*     ͆    */,
	'\u031a' /*     ̚    */,
];

const zalgoDownArray: string[] = [
	'\u0316' /*     ̖     */,
	'\u0317' /*     ̗     */,
	'\u0318' /*     ̘     */,
	'\u0319' /*     ̙     */,
	'\u031c' /*     ̜     */,
	'\u031d' /*     ̝     */,
	'\u031e' /*     ̞     */,
	'\u031f' /*     ̟     */,
	'\u0320' /*     ̠     */,
	'\u0324' /*     ̤     */,
	'\u0325' /*     ̥     */,
	'\u0326' /*     ̦     */,
	'\u0329' /*     ̩     */,
	'\u032a' /*     ̪     */,
	'\u032b' /*     ̫     */,
	'\u032c' /*     ̬     */,
	'\u032d' /*     ̭     */,
	'\u032e' /*     ̮     */,
	'\u032f' /*     ̯     */,
	'\u0330' /*     ̰     */,
	'\u0331' /*     ̱     */,
	'\u0332' /*     ̲     */,
	'\u0333' /*     ̳     */,
	'\u0339' /*     ̹     */,
	'\u033a' /*     ̺     */,
	'\u033b' /*     ̻     */,
	'\u033c' /*     ̼     */,
	'\u0345' /*     ͅ     */,
	'\u0347' /*     ͇     */,
	'\u0348' /*     ͈     */,
	'\u0349' /*     ͉     */,
	'\u034d' /*     ͍     */,
	'\u034e' /*     ͎     */,
	'\u0353' /*     ͓     */,
	'\u0354' /*     ͔     */,
	'\u0355' /*     ͕     */,
	'\u0356' /*     ͖     */,
	'\u0359' /*     ͙     */,
	'\u035a' /*     ͚     */,
	'\u0323' /*     ̣     */,
];

const zalgoMidArray: string[] = [
	'\u0315' /*     ̕    */,
	'\u031b' /*     ̛     */,
	'\u0340' /*     ̀     */,
	'\u0341' /*     ́     */,
	'\u0358' /*     ͘    */,
	'\u0321' /*     ̡    */,
	'\u0322' /*     ̢    */,
	'\u0327' /*     ̧     */,
	'\u0328' /*     ̨     */,
	'\u0334' /*     ̴    */,
	'\u0335' /*     ̵    */,
	'\u0336' /*     ̶     */,
	'\u034f' /*     ͏     */,
	'\u035c' /*     ͜    */,
	'\u035d' /*     ͝    */,
	'\u035e' /*     ͞    */,
	'\u035f' /*     ͟    */,
	'\u0360' /*     ͠    */,
	'\u0362' /*     ͢    */,
	'\u0338' /*     ̸     */,
	'\u0337' /*     ̷     */,
	'\u0361' /*     ͡    */,
	'\u0489' /*     ҉_   */,
];

/* Other functions */

const createPseudoRandomIntGenerator = (seed: number) => {
	let currentNumber = 1;

	return (max: number, min: number = 0): number => {
		currentNumber = Math.floor((1111111 * currentNumber) / (seed + 111)) % 7652029;

		return ((currentNumber % (max - min)) + min) * (currentNumber < 0 ? -1 : 1);
	};
};

const computeValueFromText = (text: string) =>
	text.split('').reduce((acc, cur) => acc + cur.charCodeAt(0), 0);

/* Zalgo text */

const addZalgoToChar = (
	character: string,
	zalgoCount: number,
	zalgoArray: string[],
	getRandomInt: (max: number) => number,
): string => {
	for (let i = 0; i < zalgoCount; i++) {
		character += zalgoArray[getRandomInt(zalgoArray.length)];
	}

	return character;
};

const addZalgoToString = (
	text: string,
	zalgoCount: number,
	zalgoArray: string[],
	getRandomInt: (max: number) => number,
): string => {
	let result = '';

	for (const char of text) {
		result += addZalgoToChar(char, zalgoCount, zalgoArray, getRandomInt);
	}

	return result;
};

const zalgoGeneration = (
	text: string,
	zalgoUpCount: number,
	zalgoMidCount: number,
	zalgoDownCount: number,
	getRandomInt: (max: number) => number,
): string => {
	let transformedText = text;

	transformedText = addZalgoToString(transformedText, zalgoUpCount, zalgoUpArray, getRandomInt);
	transformedText = addZalgoToString(transformedText, zalgoMidCount, zalgoMidArray, getRandomInt);

	return addZalgoToString(transformedText, zalgoDownCount, zalgoDownArray, getRandomInt);
};

export const zalgoRandomGeneration = (text: string, zalgoCount: number): string => {
	const getRandomInt = createPseudoRandomIntGenerator(computeValueFromText(text));

	return zalgoGeneration(
		text,
		getRandomInt(zalgoCount, 1),
		getRandomInt(zalgoCount, 1),
		getRandomInt(zalgoCount, 1),
		getRandomInt,
	);
};
