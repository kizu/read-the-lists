STYLUS = node_modules/.bin/stylus
YATE = node_modules/.bin/yate

all: yate css

yate: templates.yate.js

templates.yate.js: templates.yate
	$(YATE) $< > $@

css: s/style.css s/style.ie.css

s/style.css: s/style.styl
	$(STYLUS) s/style.styl

s/style.ie.css: s/style.styl s/style.ie.styl
	$(STYLUS) s/style.ie.styl

watch:
	$(STYLUS) --watch s/style.styl

.PHONY: install all yate css
