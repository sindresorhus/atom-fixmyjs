/** @babel */
import {CompositeDisposable} from 'atom';
import fixmyjs from 'fixmyjs';
import jshintCli from 'jshint/src/cli';

function init(editor) {
	const file = editor.getURI();
	const config = file ? jshintCli.getConfig(file) : {};
	const selectedText = editor.getSelectedText();
	const text = selectedText || editor.getText();
	let retText = '';

	try {
		if (atom.config.get('fixmyjs.legacy')) {
			const jshint = require('jshint').JSHINT;
			jshint(text, config);
			retText = fixmyjs(jshint.data(), text).run();
		} else {
			retText = fixmyjs.fix(text, config);
		}
	} catch (err) {
		console.error(err);
		atom.notifications.addError('FixMyJS', {detail: err.message});
		return;
	}

	const cursorPosition = editor.getCursorBufferPosition();
	const line = atom.views.getView(editor).getFirstVisibleScreenRow() +
		editor.displayBuffer.getVerticalScrollMargin();

	if (selectedText) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), retText);
	} else {
		editor.setText(retText);
		editor.getBuffer().setTextViaDiff(retText);
	}

	editor.setCursorBufferPosition(cursorPosition);

	if (editor.getScreenLineCount() > line) {
		editor.scrollToScreenPosition([line, 0]);
	}
}

export const config = {
	legacy: {
		type: 'boolean',
		default: true,
		description: 'Legacy mode uses the last stable version of the module which uses JSHint to detect errors in your code and fix them. It does not include all of the fixes the current version of FixMyJS exposes, but does do a much better job of preserving source formatting.'
	}
};

export function deactivate() {
	this.subscriptions.dispose();
}

export const activate = () => {
	this.subscriptions = new CompositeDisposable();

	this.subscriptions.add(atom.commands.add('atom-workspace', 'FixMyJS', () => {
		const editor = atom.workspace.getActiveTextEditor();

		if (editor) {
			init(editor);
		}
	}));
};
