
OUTPUT   ?= bin
CSS      := $(OUTPUT)/style.css
JS       := $(OUTPUT)/all.js
POLYFILL := $(OUTPUT)/polyfill.js
HXLIBS   := no-vdom

#start#
all: js css
	@echo done!
	
clean:
	@echo $@...
	@rm -rf dump $(CSS) $(JS) $(CSS_MD)

js: $(JS) $(POLYFILL)

css: $(CSS)

.PHONY: all clean css js


$(CSS): hss/style.hss hss/markdown.hss $(wildcard hss/comm/*.hss)
	hss -output $(OUTPUT) -D ie8 $<

$(JS): $(wildcard src/*.hx)
	haxe -dce full -cp src -D analyzer-optimize -D no_stack_trace $(addprefix -lib , $(HXLIBS)) --main Main --js $@

$(POLYFILL): $(wildcard polyfill/*.js)
	closure --js_output_file $@ --compilation_level WHITESPACE_ONLY --js $^