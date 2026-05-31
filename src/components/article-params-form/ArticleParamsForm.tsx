import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useState, useEffect, useRef } from 'react';
import { useClickOutsideAndEscape } from 'src/hooks/useClickOutsideAndEscape';
import {
	OptionType,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';
import styles from './ArticleParamsForm.module.scss';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Text } from 'src/ui/text';
import { Separator } from 'src/ui/separator';
import clsx from 'clsx';

type ArticleParamsFormProps = {
	currentState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	currentState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	// Локальное состояние для управления видимостью сайдбара
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Рефы для отсележивания элементов
	const sidebarRef = useRef<HTMLElement>(null);
	const arrowButtonRef = useRef<HTMLDivElement>(null);

	// Используем хук с флагом isMenuOpen и списком элементов, клики по которым не закрывают сайдбар
	useClickOutsideAndEscape(sidebarRef, () => setIsMenuOpen(false), isMenuOpen);

	// Временное локальное состояние формы
	const [localState, setLocalState] = useState<ArticleStateType>(currentState);

	// Состояние для отслеживания использованных цветов
	const [usedColors, setUsedColors] = useState<string[]>([]);

	const isFontColorDisabled = (option: OptionType): boolean => {
		// Блокируем, если цвет уже используется В ЛЮБОМ ПОЛЕ (шрифт и фон)
		return (
			usedColors.includes(option.value) &&
			option.value !== localState.fontColor?.value
		);
	};

	const isBgColorDisabled = (option: OptionType): boolean => {
		// Блокируем, если цвет уже используется В ЛЮБОМ ПОЛЕ (шрифт и фон)
		return (
			usedColors.includes(option.value) &&
			option.value !== localState.backgroundColor?.value
		);
	};

	// Синхронизируем localState с currentState при его изменении
	useEffect(() => {
		if (!isMenuOpen) {
			setLocalState(currentState);
		}
	}, [currentState]);

	// Синхронизируем usedColors с currentState при открытии формы
	useEffect(() => {
		if (isMenuOpen) {
			const newUsedColors: string[] = [];
			if (localState.fontColor?.value) {
				newUsedColors.push(localState.fontColor.value);
			}
			if (localState.backgroundColor?.value) {
				newUsedColors.push(localState.backgroundColor.value);
			}
			setUsedColors(newUsedColors);
		}
	}, [isMenuOpen, localState]);

	// Обработчик применения настроек
	const handleApply = (e: React.FormEvent) => {
		e.preventDefault(); // Предотвращаем стандартную отправку формы
		onApply(localState);
		setIsMenuOpen(false);
		console.log('Применяем', localState);
	};

	// Обработчик сброса настроек
	const handleReset = () => {
		setLocalState(defaultArticleState);
		setUsedColors([]); // Очищаем список использованных цветов
		onReset();
	};

	// Обработчик клика по кнопке-стрелке
	const handleArrowClick = () => {
		const newIsOpen = !isMenuOpen;
		setIsMenuOpen(newIsOpen);
		if (newIsOpen) {
			// При открытии обновлем localState текущим состоянием
			setLocalState(currentState);
		}
	};

	return (
		<>
			{/* Кнопка-стрелка для открытия/закрытия сайдбара */}
			<div ref={arrowButtonRef}>
				<ArrowButton isOpen={isMenuOpen} onClick={handleArrowClick} />
			</div>

			<aside
				ref={sidebarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					<div className={styles.option}>
						<Text as='h2' size={31} weight={800} uppercase>
							Задайте параметры
						</Text>

						<Select
							title='Шрифт'
							selected={localState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={(fontFamilyOption) =>
								setLocalState((prev) => ({ ...prev, fontFamilyOption }))
							}
						/>

						<RadioGroup
							selected={localState.fontSizeOption}
							onChange={(fontSizeOption) =>
								setLocalState((prev) => ({ ...prev, fontSizeOption }))
							}
							name='fontSize'
							title='Размер шрифта'
							options={fontSizeOptions}
						/>

						<Select
							selected={localState.fontColor}
							onChange={(selectedOption: OptionType) => {
								const oldFontColor = localState.fontColor?.value;

								setLocalState((prev) => ({
									...prev,
									fontColor: selectedOption,
								}));

								// Обновляем usedColors: убираем старый, добавляем новый
								setUsedColors((prevUsedColors) => {
									let newColors = [...prevUsedColors];

									// Удаляем старый цвет шрифта, если он был
									if (oldFontColor) {
										newColors = newColors.filter(
											(color) => color !== oldFontColor
										);
									}

									// Добавляем новый цвет, если его ещё нет
									if (
										selectedOption.value &&
										!newColors.includes(selectedOption.value)
									) {
										newColors.push(selectedOption.value);
									}

									return newColors;
								});
							}}
							options={fontColors}
							isOptionDisabled={isFontColorDisabled}
							title='Цвет шрифта'
						/>

						<Separator />

						<Select
							selected={localState.backgroundColor}
							onChange={(selectedOption: OptionType) => {
								const oldBgColor = localState.backgroundColor?.value;

								setLocalState((prev) => ({
									...prev,
									backgroundColor: selectedOption,
								}));

								// Обновляем usedColors: убираем старый, добавляем новый
								setUsedColors((prevUsedColors) => {
									let newColors = [...prevUsedColors];

									// Удаляем старый цвет фона, если он был
									if (oldBgColor) {
										newColors = newColors.filter(
											(color) => color !== oldBgColor
										);
									}

									// Добавляем новый цвет, если его ещё нет
									if (
										selectedOption.value &&
										!newColors.includes(selectedOption.value)
									) {
										newColors.push(selectedOption.value);
									}

									return newColors;
								});
							}}
							options={backgroundColors}
							isOptionDisabled={isBgColorDisabled}
							title='Цвет фона'
						/>

						<Select
							selected={localState.contentWidth}
							onChange={(contentWidth) =>
								setLocalState((prev) => ({ ...prev, contentWidth }))
							}
							options={contentWidthArr}
							title='Ширина контента'
						/>
					</div>

					{/* Кнопки управления */}
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='button'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
