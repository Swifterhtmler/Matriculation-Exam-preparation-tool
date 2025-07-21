import { todoItems, cards, motivationval, editorTextStore } from '../src/routes/stores.js';
const fs = window.require('fs');
const path = window.require('path');
const { app } = window.require('@electron/remote');

const savePath = path.join(app.getPath('userData'), 'saved.json');

if (fs.existsSync(savePath)) {
	const json = fs.readFileSync(savePath);
	try {
		const data = JSON.parse(json);
		if (data.todoItems) todoItems.set(data.todoItems);
		if (data.cards) cards.set(data.cards);
		if (data.motivationval) motivationval.set(data.motivationval);
		if (data.editorTextStore) editorTextStore.set(data.editorTextStore);
		console.log('Loaded from file:', savePath);
	} catch (e) {
		console.error('Could not parse saved.json', e);
	}
}
