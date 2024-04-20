import ImageClassifier from './components/ImageClassifier';

export default async function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<ImageClassifier />
		</main>
	);
}
