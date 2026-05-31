import { useEffect, RefObject } from 'react';

/**
 * Хук для закрытия элемента при клике вне его области или нажатии Escape
 * @param ref — ссылка на элемент, который нужно отслеживать
 * @param onClose — функция закрытия (устанавливает isOpen = false)
 * @param isOpenElement — флаг, открыт ли элемент (позволяет хуку работать только при isOpenElement === true)
 * @param ignoreRefs — массив рефов элементов, клики по которым не должны закрывать элемент
 */
export const useClickOutsideAndEscape = (
	ref: RefObject<HTMLElement>,
	onClose: () => void,
	isOpenElement: boolean,
	ignoreRefs?: RefObject<Element>[]
) => {
	useEffect(() => {
		// Если элемент закрыт, не добавляем обработчики
		if (!isOpenElement) {
			return;
		}

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			// Проверяем, что ref существует
			if (!ref.current) {
				return;
			}

			// Если клик внутри отслеживаемого элемента — ничего не делаем
			if (ref.current.contains(target)) {
				return;
			}

			// Проверяем клики по элементам, которые нужно игнорировать
			if (ignoreRefs) {
				for (const ignoreRef of ignoreRefs) {
					if (ignoreRef.current && ignoreRef.current.contains(target)) {
						return; // Игнорируем клик, если он по элементу из ignoreRefs
					}
				}
			}

			// Если клик вне элемента и не по игнорируемым элементам — закрываем
			onClose();
		};

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		// Добавляем обработчики событий
		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscapeKey);

		// Функция очистки — удаляет обработчики при размонтировании компонента
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [onClose, ref, isOpenElement, ignoreRefs]);
};
