import { Card, CardBody } from '@nextui-org/react';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import CardBuilder from '../../tools/cardBuilder.ts';

import TemplateClassic from '../../assets/CardTemplates/classic.png';
import TemplateFullArt from '../../assets/CardTemplates/fullart.png';
import TemplateEorzean from '../../assets/CardTemplates/eorzean.png';

import RarityCommon from '../../assets/CardRarityLayers/common.png';
import RarityEpic from '../../assets/CardRarityLayers/epic.png';
import RarityEternal from '../../assets/CardRarityLayers/eternal.png';
import RarityLegendary from '../../assets/CardRarityLayers/legendary.png';
import RarityMythic from '../../assets/CardRarityLayers/mythic.png';
import RarityRare from '../../assets/CardRarityLayers/rare.png';
import RarityRelic from '../../assets/CardRarityLayers/relic.png';

import TexturesLines from '../../assets/CardTextures/lines.png';
import TexturesNoise from '../../assets/CardTextures/noise.png';
import TexturesPaper from '../../assets/CardTextures/paper.png';
import html2canvas from 'html2canvas';
import { getRarityName, getTypeName, zalgoRandomGeneration } from '../../tools/text.ts';
import { DCC } from '../../tools/types.ts';
import { downloadFile } from '../../tools/file.ts';

const CARD_WIDTH = 744;
const CARD_HEIGHT = 1394;
const CARD_RATIO = CARD_WIDTH / CARD_HEIGHT;

const applyScale = (sizes: Record<string, number>, scale: number) => {
	return Object.keys(sizes).reduce(
		(acc, key) => {
			acc[key] = sizes[key] * scale;

			return acc;
		},
		{} as Record<string, number>,
	);
};

const computeArtSizeFor = (
	image: DCC.ArtFile,
	cardSize: { w: number; h: number },
	scale: number = 1,
) => {
	let result = {
		w: cardSize.w,
		h: cardSize.h,
		left: 0,
		top: 0,
		wMoveMargin: 0,
		hMoveMargin: 0,
	};

	if (!image) {
		return applyScale(result, scale);
	}

	const artRatio = image.width / image.height;

	if (artRatio < CARD_RATIO) {
		const nextHeight = ((image.height * cardSize.w) / image.width) * scale;
		const nextWidth = cardSize.w * scale;

		return {
			w: nextWidth,
			left: 0,

			h: nextHeight,
			top: -(nextHeight - cardSize.h) / 2,

			wMoveMargin: nextWidth - cardSize.w,
			hMoveMargin: nextHeight - cardSize.h,
		};
	} else if (artRatio > CARD_RATIO) {
		const nextWidth = ((image.width * cardSize.h) / image.height) * scale;
		const nextHeight = cardSize.h * scale;

		return {
			h: nextHeight,
			top: 0,

			w: nextWidth,
			left: -(nextWidth - cardSize.w) / 2,

			wMoveMargin: nextWidth - cardSize.w,
			hMoveMargin: nextHeight - cardSize.h,
		};
	} else {
		const nextWidth = cardSize.w * scale;
		const nextHeight = cardSize.h * scale;

		return {
			w: nextWidth,
			h: nextHeight,
			left: 0,
			top: 0,
			wMoveMargin: nextWidth - cardSize.w,
			hMoveMargin: nextHeight - cardSize.h,
		};
	}
};

export default forwardRef(function CardVisualizer(_, ref) {
	const [cardSize, setCardSize] = useState({
		w: 0,
		h: 0,
	});
	const elRef = useRef<HTMLDivElement>(null);
	const exportDivImageRef: any = useRef();
	const [downloading, setDownloading] = useState(false);

	const type = CardBuilder.use('type');
	const collectionName = CardBuilder.use('collectionName');
	const title = CardBuilder.use('title');
	const code = CardBuilder.use('code');
	const credit = CardBuilder.use('credit');
	const description = CardBuilder.use('description');
	const illustratorName = CardBuilder.use('illustratorName');
	const image = CardBuilder.use('image');
	const rarity = CardBuilder.use('rarity');
	const template = CardBuilder.use('template');
	const horizontalOffset = CardBuilder.use('horizontalOffset');
	const verticalOffset = CardBuilder.use('verticalOffset');
	const scale = CardBuilder.use('scale');
	const texture = CardBuilder.use('texture');

	const templateUrl = useMemo(() => {
		switch (template) {
			case 'classic':
			case 'clean':
				return TemplateClassic;
			case 'fullart':
				return TemplateFullArt;
			case 'eorzean':
				return TemplateEorzean;
		}
	}, [template]);

	const rarityUrl = useMemo(() => {
		switch (rarity) {
			case 'common':
				return RarityCommon;
			case 'epic':
				return RarityEpic;
			case 'eternal':
				return RarityEternal;
			case 'legendary':
				return RarityLegendary;
			case 'mythic':
				return RarityMythic;
			case 'relic':
				return RarityRelic;
			case 'rare':
				return RarityRare;
		}
	}, [rarity]);

	const computeSize = useCallback(
		(n: number) => {
			return (cardSize.h / CARD_HEIGHT) * n;
		},
		[cardSize],
	);

	const artSize = useMemo(
		() => computeArtSizeFor(image, cardSize, scale),
		[image, cardSize, scale],
	);

	const createImage = useCallback(async () => {
		const cardElement = exportDivImageRef.current;

		// Fix from : https://github.com/niklasvh/html2canvas/issues/2775#issuecomment-1316356991
		const style = document.createElement('style');
		document.head.appendChild(style);
		style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

		const result = await html2canvas(cardElement, {
			allowTaint: true,
			useCORS: true,
			backgroundColor: 'transparent',
			width: CARD_WIDTH,
			height: CARD_HEIGHT,
		});

		style.remove();

		downloadFile(result.toDataURL('image/png'), `${title}.png`);
	}, [title]);

	const downloadImage = useCallback(async () => {
		let cardElement = exportDivImageRef.current;

		if (!cardElement) return;

		try {
			const oldSize = cardSize;

			setCardSize({
				h: CARD_HEIGHT,
				w: CARD_WIDTH,
			});
			setDownloading(true);

			setTimeout(async () => {
				await createImage();
				setCardSize({ ...oldSize });
				setDownloading(false);
			});
		} catch (reason) {
			console.log(reason);
		}
	}, [cardSize, setCardSize, createImage]);

	const manageMouseMove = (e: any) => {
		const { nativeEvent } = e;

		nativeEvent.target.style.setProperty('--curPos_X', nativeEvent.layerX);
		nativeEvent.target.style.setProperty('--curPos_Y', nativeEvent.layerY);
	};

	useImperativeHandle(
		ref,
		() => {
			return {
				downloadImage,
			};
		},
		[downloadImage],
	);

	useEffect(() => {
		const height = (elRef.current?.offsetHeight ?? 32) - 32;

		setCardSize({
			h: height,
			w: (height / CARD_HEIGHT) * CARD_WIDTH,
		});
	}, []);

	const transformedDescription =
		template === 'cursed' || template === 'eorzean'
			? zalgoRandomGeneration(description, 3)
			: description;

	const cardBlock = (className: string = '') => (
		<div
			className={className}
			style={{
				width: cardSize.w,
				height: cardSize.h,
				position: 'absolute',
				borderRadius: computeSize(44),
			}}>
			<div
				className="card-illustration-container"
				style={{
					width: cardSize.w,
					height: cardSize.h,
					position: 'absolute',
					borderRadius: computeSize(44),
				}}>
				<img
					src={image?.data}
					className="absolute card-illustration"
					style={{
						borderRadius: computeSize(44),
						width: artSize.w,
						height: artSize.h,
						top: `calc(-${artSize.hMoveMargin}px * ${verticalOffset})`,
						left: `calc(-${artSize.wMoveMargin}px * ${horizontalOffset})`,
						maxWidth: 'none',
					}}
				/>
			</div>

			<img
				src={templateUrl}
				className="absolute"
				style={{
					top: 0,
					left: 0,
					borderRadius: computeSize(44),
					width: cardSize.w,
					height: cardSize.h,
				}}
			/>

			<div
				className="absolute"
				style={{
					color: '#706F6F',
					fontFamily: 'Eurostyle',
					fontSize: `${computeSize(15)}pt`,
					top: computeSize(64),
					left: computeSize(70),
				}}>
				NB {String(code).padStart(4, '0')}
			</div>

			<div
				className="absolute"
				style={{
					color: '#706F6F',
					fontFamily: template === 'eorzean' ? 'EorzeanCompact' : 'Eurostyle',
					fontSize: `${computeSize(15)}pt`,
					top: computeSize(64),
					right: computeSize(70),
					textTransform: 'capitalize',
				}}>
				{getTypeName(type)}/{getRarityName(rarity)}
			</div>

			<div
				className="absolute"
				style={{
					color: '#000000',
					fontFamily: template === 'eorzean' ? 'Eorzean' : 'Trajan',
					fontSize: `${computeSize(34)}pt`,
					top: computeSize(996),
					left: computeSize(82),
				}}>
				{title}
			</div>

			<div
				className="absolute"
				style={{
					color: '#B19B50',
					fontFamily: template === 'eorzean' ? 'Eorzean' : 'Trajan',
					fontSize: `${computeSize(34)}pt`,
					top: computeSize(994),
					left: computeSize(80),
				}}>
				{title}
			</div>

			<div
				className="absolute"
				style={{
					color: '#000000',
					fontFamily: template === 'eorzean' ? 'Eorzean' : 'Myriad',
					fontSize: `${computeSize(15)}pt`,
					top: computeSize(1072),
					left: computeSize(72),
					width: computeSize(600),
					lineHeight: `${computeSize(21)}pt`,
				}}>
				{transformedDescription}
			</div>

			<div
				className="absolute"
				style={{
					color: '#EDE1C5',
					fontFamily: template === 'eorzean' ? 'Eorzean' : 'Myriad',
					fontSize: `${computeSize(15)}pt`,
					top: computeSize(1070),
					left: computeSize(70),
					width: computeSize(600),
					lineHeight: `${computeSize(21)}pt`,
					overflow: 'visible',
				}}>
				{transformedDescription}
			</div>

			<div
				className="absolute"
				style={{
					color: '#6F6F6E',
					fontFamily: 'Eurostyle',
					fontSize: `${computeSize(11)}pt`,
					top: computeSize(1304),
					left: computeSize(70),
					verticalAlign: 'bottom',
				}}>
				Collection {collectionName}{' '}
				<span
					style={{
						lineHeight: `${computeSize(0)}px`,
						height: `${computeSize(0)}px`,
						verticalAlign: 'middle',
						fontSize: `${computeSize(10)}pt`,
						fontFamily: 'sans-serif',
					}}>
					&#9658;
				</span>{' '}
				Illustration : {illustratorName}
			</div>

			<div
				className="absolute"
				style={{
					color: '#6F6F6E',
					fontFamily: 'Eurostyle',
					fontSize: `${computeSize(11)}pt`,
					top: computeSize(1304),
					right: computeSize(70),
				}}>
				<span
					style={{
						fontFamily: 'FuturaLightCondensed',
						fontSize: `${computeSize(9)}pt`,
					}}>
					©
				</span>
				2024 Dhalmel Corp/
				{credit}
			</div>

			<img
				src={TexturesLines}
				style={{
					borderRadius: computeSize(44),
					width: cardSize.w,
					height: cardSize.h,
					opacity: 0.21,
				}}
				className="absolute"
			/>

			<img
				src={TexturesNoise}
				style={{
					borderRadius: computeSize(44),
					width: cardSize.w,
					height: cardSize.h,
					opacity: 0.21,
				}}
				className="absolute"
			/>

			<img
				src={TexturesPaper}
				style={{
					borderRadius: computeSize(44),
					width: cardSize.w,
					height: cardSize.h,
					opacity: 0.12,
				}}
				className="absolute"
			/>

			<div
				style={{
					borderRadius: computeSize(44),
					width: cardSize.w,
					height: cardSize.h,
					opacity: 0.06,
					backgroundColor: 'black',
				}}
				className="absolute"
			/>

			{template !== 'clean' && (
				<img
					src={rarityUrl}
					style={{
						borderRadius: computeSize(44),
						width: cardSize.w,
						height: cardSize.h,
					}}
					className="absolute"
				/>
			)}
		</div>
	);

	return (
		<Card className="flex-shrink-0 flex flex-grow">
			<CardBody
				// @ts-ignore
				ref={elRef}
				className={`effect ${texture === 'none' ? '' : `texture-container-${texture}`}`}
				style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
				<div
					className="card-container"
					ref={exportDivImageRef}
					onMouseMove={manageMouseMove}
					style={{
						width: cardSize.w,
						height: cardSize.h,
						position: 'relative',
						borderRadius: computeSize(44),
					}}>
					<div
						style={{
							width: cardSize.w,
							position: 'relative',
							borderRadius: computeSize(44),
							height: cardSize.h,
							overflow: 'hidden',
						}}>
						{cardBlock(downloading ? '' : 'card-group-1')}
						{!downloading && cardBlock('card-group-2')}
						{!downloading && cardBlock('card-group-3')}

						{!downloading && (
							<div
								style={{
									borderRadius: computeSize(44),
									width: cardSize.w,
									height: cardSize.h,
								}}
								className={`effect ${texture === 'none' ? '' : texture}`}
							/>
						)}
					</div>
				</div>
			</CardBody>
		</Card>
	);
});
