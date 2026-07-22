# One config for local + production. No environment-specific settings.
PELICAN ?= venv/bin/pelican
PYTHON  ?= venv/bin/python3
INPUT   := content
OUTPUT  := output
CONF    := pelicanconf.py
PORT    ?= 8000

.PHONY: build sync site serve clean help

help:
	@echo "make site   - build + sync to repo root (GitHub Pages tree)"
	@echo "make serve  - build + sync + serve at http://127.0.0.1:$(PORT)/"
	@echo "make build  - pelican only (output/)"
	@echo "make clean  - remove output/"

build:
	$(PELICAN) $(INPUT) -o $(OUTPUT) -s $(CONF)

# Copy the single build into the GitHub Pages root layout used by this repo.
sync: build
	rsync -a --delete $(OUTPUT)/blog/ blog/
	rsync -a --delete $(OUTPUT)/author/ author/
	rsync -a --delete $(OUTPUT)/category/ category/
	rsync -a $(OUTPUT)/contact/ contact/
	rsync -a $(OUTPUT)/work/ work/  # Pelican-generated page from content/pages/work.md via page.html; mirrors /contact/ pattern
	rsync -a $(OUTPUT)/feeds/ feeds/
	rsync -a $(OUTPUT)/theme/ theme/
	rsync -a $(OUTPUT)/images/ images/
	@# Tags: only /tags/ is canonical; drop generated /tag/ if present, then sync
	@rm -rf tag
	@if [ -d $(OUTPUT)/tags ]; then rsync -a --delete $(OUTPUT)/tags/ tags/; fi
	@if [ -d $(OUTPUT)/authors ]; then rsync -a --delete $(OUTPUT)/authors/ authors/; fi
	@if [ -d $(OUTPUT)/categories ]; then rsync -a --delete $(OUTPUT)/categories/ categories/; fi
	@for f in index.html robots.txt CNAME llms.txt llms-full.txt contact-config.js; do \
		if [ -f $(OUTPUT)/$$f ]; then cp $(OUTPUT)/$$f .; fi; \
	done
	@# Keep root OG asset even if output/images only has blog art
	@if [ -f theme/images/og.png ]; then \
		mkdir -p images; \
		cp theme/images/og.png images/og.png; \
		mkdir -p $(OUTPUT)/images; \
		cp theme/images/og.png $(OUTPUT)/images/og.png; \
	fi
	@cp feeds/all.atom.xml atom.xml
	@$(PYTHON) -c "from pathlib import Path; p=Path('atom.xml'); t=p.read_text();\
t=t.replace('href=\"https://www.mohitranka.com/feeds/all.atom.xml\" rel=\"self\"',\
'href=\"https://www.mohitranka.com/atom.xml\" rel=\"self\"'); p.write_text(t)"
	@$(PYTHON) scripts/update_sitemap.py
	@$(PYTHON) scripts/write_legacy_redirects.py

site: sync

serve: site
	@echo "Serving http://127.0.0.1:$(PORT)/  (Ctrl+C to stop)"
	$(PYTHON) -m http.server $(PORT) --bind 127.0.0.1

clean:
	rm -rf $(OUTPUT)
