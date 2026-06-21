import { useRef } from 'react';
import type { MouseEventHandler } from 'react';
import clsx from 'clsx';
import { OptionType } from 'src/constants/articleProps';
import { Text } from 'src/ui/text';
import { isFontFamilyClass } from './helpers/isFontFamilyClass';
import { useEnterOptionSubmit } from './hooks/useEnterOptionSubmit';

import styles from './Select.module.scss';

type OptionProps = {
	option: OptionType;
	onClick: (value: OptionType['value']) => void;
	isDisabled?: boolean;
};

export const Option = (props: OptionProps) => {
	const {
		option: { value, title, optionClassName, className },
		onClick,
		isDisabled = false,
	} = props;
	const optionRef = useRef<HTMLLIElement>(null);

	const handleClick: MouseEventHandler<HTMLLIElement> = () => {
		if (!isDisabled) {
			onClick(value);
		}
	};

	useEnterOptionSubmit({
		optionRef,
		value,
		onClick: () => {
			if (!isDisabled) {
				onClick(value);
			}
		},
	});

	return (
		<li
			className={clsx(styles.option, styles[optionClassName || ''], {
				[styles.option_disabled]: isDisabled,
				[styles.option_shaded]: isDisabled,
			})}
			value={value}
			onClick={handleClick}
			tabIndex={isDisabled ? -1 : 0}
			aria-disabled={isDisabled}
			data-testid={`select-option-${value}`}
			ref={optionRef}>
			<Text family={isFontFamilyClass(className) ? className : undefined}>
				{title}
			</Text>
		</li>
	);
};
