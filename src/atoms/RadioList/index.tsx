import { cn, Radio, RadioGroup, RadioGroupProps, RadioProps } from '@nextui-org/react';

type RadioListProps = RadioGroupProps;

export default function RadioList(props: RadioListProps) {
	return (
		<RadioGroup
			{...props}
			classNames={{
				wrapper: 'flex-row gap-1',
			}}>
			{props.children}
		</RadioGroup>
	);
}

export function RadioListItem(props: RadioProps) {
	return (
		<Radio
			{...props}
			classNames={{
				base: cn(
					'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between',
					'flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent',
					'data-[selected=true]:border-primary',
				),
				label: 'ml-0',
			}}>
			{props.children}
		</Radio>
	);
}
