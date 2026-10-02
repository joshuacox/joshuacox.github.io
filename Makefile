.PHONY: all help serve build drafts lint clean

all: help

help:
	@echo ""
	@echo "-- Joshua Cox Blog - Next.js System"
	@echo ""
	@echo "   1. make serve        - start Next.js local development server (pnpm dev)"
	@echo "   2. make drafts       - start dev server including drafts (SHOW_DRAFTS=true pnpm dev)"
	@echo "   3. make build        - build static production export (pnpm build)"
	@echo "   4. make lint         - run linter (pnpm lint)"
	@echo "   5. make clean        - remove build artifacts (.next, out)"
	@echo ""

serve:
	pnpm dev

drafts:
	SHOW_DRAFTS=true pnpm dev

build:
	pnpm build

lint:
	pnpm lint

clean:
	rm -rf .next out
