---

layout: post
title:  hxparse
date:   2015-02-07 08:11:12
categories: haxelib

---

[haxe Lexer/Parser library](https://github.com/Simn/hxparse)

<!-- more -->


### Lexer

Lexer matches a sequence of characters against a set of rule patterns.

An instance of Lexer is created once for each input and maintains state for that input. Tokens can then be obtained by calling the `token` method, passing an instance of `Ruleset`.

Rule sets can be created manually, or by calling the static `buildRuleset` method.

https://github.com/Simn/hxparse/wiki/Writing-a-Lexer

 1. Create a Lexer class, extending hxparse.Lexer.

 2. Create lexer rulesets as static variables.

 3. Instantiate your lexer class, passing it an instance of byte.ByteData and optionally the name of the source (for position tracking).

 4. Keep calling yourLexerInstance.token(ruleset) with the ruleset to get tokens.

#### Rules

Rules are a mapping of a regular expression String to a semantic action. They are expressed using the regex => action map notation:

```haxe
public static var token = hxparse.Lexer.build([
    "rule-regex-1" => function(lexer:hxparse.Lexer) {
        // semantic action 1
    },
    "rule-regex-2" => function(lexer) {
        // semantic action 2
    }
]);
```

This can be simplified by letting the lexer implement hxparse.RuleBuilder, and then use the special @:rule metadata:

```haxe
public static var token = @:rule ([
    "rule-regex-1" => {
        // semantic action 1, access to lexer identifier
    },
    "rule-regex-2" => {
        // semantic action 2, access to lexer identifier
    }
]);
```

Example: 

```haxe
class JSONLexer extends hxparse.Lexer implements hxparse.RuleBuilder {

	static var buf:StringBuf;

	public static var tok = @:rule [
		"{" => TBrOpen,
		"}" => TBrClose,
		"," => TComma,
		":" => TDblDot,
		"[" => TBkOpen,
		"]" => TBkClose,
		"-" => TDash,
		"\\." => TDot,
		"true" => TTrue,
		"false" => TFalse,
		"null" => TNull,
		"-?(([1-9][0-9]*)|0)(.[0-9]+)?([eE][\\+\\-]?[0-9]?)?" => TNumber(lexer.current),
		'"' => {
			buf = new StringBuf();
			lexer.token(string);
			TString(buf.toString());
		},
		"[\r\n\t ]" => lexer.token(tok),
		"" => TEof
	];

	static var string = @:rule [
		"\\\\t" => {
			buf.addChar("\t".code);
			lexer.token(string);
		},
		"\\\\n" => {
			buf.addChar("\n".code);
			lexer.token(string);
		},
		"\\\\r" => {
			buf.addChar("\r".code);
			lexer.token(string);
		},
		'\\\\"' => {
			buf.addChar('"'.code);
			lexer.token(string);
		},
		"\\\\u[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]" => {
			buf.add(String.fromCharCode(Std.parseInt("0x" +lexer.current.substr(2))));
			lexer.token(string);
		},
		'"' => {
			lexer.curPos().pmax;
		},
		'[^"]' => {
			buf.add(lexer.current);
			lexer.token(string);
		},
	];
}
```

#### Semantic action Api

An instance of hxparse.Lexer is available in the semantic action definitions, exposing the following Api:

 * `lexer.current`: the String that was matched

 * `lexer.curPos()`: the position information of the matched String

 * `lexer.token()`: get the next token (can be used to ignore the current token) 

#### RuleBuilder macro

Other than the `@:rule` metadata described above, implementing `hxparse.RuleBuilder` provides the following helpers:

 * `static var keywords = @:mapping Keyword;` : Transforms the constructors of enum Keyword to a `keyword => Keyword` mapping, where the left side is the lower-case String representation of the enum constructor (example: `"public" => Keyword.Public`).

 * `@:ruleHelper static var someRule = "regex" => { // semantic action }`: This allows someRule to be used in multiple rule sets.

### Parser
