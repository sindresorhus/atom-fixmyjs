'use strict';
var fixmyjs = require('fixmyjs');
var jshintCli = require('jshint/src/cli');

function init() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	var file = editor.getURI();
	var config = file ? jshintCli.getConfig(file) : {};
	var selectedText = editor.getSelectedText();
	var text = selectedText || editor.getText();
	var retText = '';

	try {
		if (atom.config.get('fixmyjs.legacy')) {
			var jshint = require('jshint').JSHINT;
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

	var cursorPosition = editor.getCursorBufferPosition();

	if (selectedText) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), retText);
	} else {
		editor.setText(retText);
	}

	editor.setCursorBufferPosition(cursorPosition);
}

exports.config = {
	legacy: {
		type: 'boolean',
		default: true,
		description: 'Legacy mode uses the last stable version of the module which uses JSHint to detect errors in your code and fix them. It does not include all of the fixes the current version of FixMyJS exposes, but does do a much better job of preserving source formatting.'
	}
};

exports.activate = function () {
	atom.commands.add('atom-text-editor', 'FixMyJS', init);
};
