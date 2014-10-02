# fixmyjs

[Atom package](https://atom.io/packages/fixmyjs)

> Automagically fix JSHint lint warnings using [fixmyjs](https://github.com/jshint/fixmyjs)

<img src="https://cloud.githubusercontent.com/assets/170270/4474662/ceab387a-4962-11e4-99ab-17dd5c44847c.gif" width="399">

*Issues with the output should be reported on the fixmyjs [issue tracker](https://github.com/jshint/fixmyjs/issues).*


## Install

```sh
$ apm install fixmyjs
```

Or Settings → Packages → Search for `fixmyjs`


## Usage

Open the Command Palette, and type `fixmyjs`.

Can also be run on just a selection. For example the code in a `<script>` tag.


## Legacy mode

By default, this plugin uses the FixMyJS `legacy` mode. This option uses the last stable version of the module which uses JSHint to detect errors in your code and fix them.

It does not include all of the fixes the current version of FixMyJS exposes, but does do a much better job of preserving source formatting. Legacy mode can be disabled in the Settings.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
