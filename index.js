'use babel';
import fixmyjs from 'fixmyjs';
import jshintCli from 'jshint/src/cli';

function init() {
	const editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

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
		atom.beep();
		return;
	}

	const cursorPosition = editor.getCursorBufferPosition();

	if (selectedText) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), retText);
	} else {
		editor.setText(retText);
	}

	editor.setCursorBufferPosition(cursorPosition);
}

export let config = {
	legacy: {
		type: 'boolean',
		default: true,
		description: 'Legacy mode uses the last stable version of the module which uses JSHint to detect errors in your code and fix them. It does not include all of the fixes the current version of FixMyJS exposes, but does do a much better job of preserving source formatting.'
	}
};

export let activate = () => {
	atom.commands.add('atom-workspace', 'FixMyJS', init);
};
