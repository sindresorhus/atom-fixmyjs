'use strict';
var fixmyjs = require('fixmyjs');
var jshintCli = require('jshint/src/cli');
var plugin = module.exports;

function run() {
	var editor = atom.workspace.getActiveEditor();

	if (!editor) {
		return;
	}

	var retText = '';
	var file = editor.getUri();
	var config = jshintCli.getConfig(file);
	var selectedText = editor.getSelectedText();
	var text = selectedText || editor.getText();

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

	if (selectedText) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), retText);
	} else {
		editor.setText(retText);
	}
}

plugin.configDefaults = {
	legacy: true
};

plugin.activate = function () {
	return atom.workspaceView.command('FixMyJS', run);
};
