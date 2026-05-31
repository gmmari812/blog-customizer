import { useState, useEffect } from 'react';
import { Article } from './components/article';
import { ArticleParamsForm } from './components/article-params-form';
import {
	ArticleStateType,
	defaultArticleState,
} from './constants/articleProps';
import './styles/index.scss';
import styles from './styles/index.module.scss';

export const App = () => {
	const [articleState, setArticleState] =
		useState<ArticleStateType>(defaultArticleState);

	// Синхронизация CSS‑переменных с состоянием статьи
	useEffect(() => {
		document.documentElement.style.setProperty(
			'--font-family',
			articleState.fontFamilyOption.value
		);
		document.documentElement.style.setProperty(
			'--font-size',
			articleState.fontSizeOption.value
		);
		document.documentElement.style.setProperty(
			'--font-color',
			articleState.fontColor.value
		);
		document.documentElement.style.setProperty(
			'--container-width',
			articleState.contentWidth.value
		);
		document.documentElement.style.setProperty(
			'--bg-color',
			articleState.backgroundColor.value
		);
	}, [articleState]);

	const handleApply = (newState: ArticleStateType) => setArticleState(newState);
	const handleReset = () => setArticleState(defaultArticleState);

	return (
		<main className={styles.main}>
			<ArticleParamsForm
				currentState={articleState}
				onApply={handleApply}
				onReset={handleReset}
			/>
			<Article />
		</main>
	);
};
