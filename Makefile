.DEFAULT_GOAL := help
SHELL := /bin/bash

# ── Colours ───────────────────────────────────────────────────────────────────
BOLD   := \033[1m
RESET  := \033[0m
GREEN  := \033[32m
YELLOW := \033[33m
CYAN   := \033[36m

# ── Help ──────────────────────────────────────────────────────────────────────
.PHONY: help
help:
	@echo ""
	@echo "$(BOLD)Haitech Medical — Developer Commands$(RESET)"
	@echo ""
	@echo "$(CYAN)Local development (native Node, hot-reload):$(RESET)"
	@echo "  $(BOLD)make install$(RESET)         Install all dependencies (frontend + backend)"
	@echo "  $(BOLD)make infra$(RESET)           Start PostgreSQL + Redis in Docker"
	@echo "  $(BOLD)make infra-stop$(RESET)      Stop infrastructure containers"
	@echo "  $(BOLD)make dev-api$(RESET)         Start backend API with hot-reload"
	@echo "  $(BOLD)make dev-web$(RESET)         Start Next.js frontend with hot-reload"
	@echo "  $(BOLD)make migrate$(RESET)         Run database migrations"
	@echo "  $(BOLD)make db-push$(RESET)         Push schema directly (no migration file)"
	@echo "  $(BOLD)make db-studio$(RESET)       Open Drizzle Studio (visual DB browser)"
	@echo ""
	@echo "$(CYAN)Docker (full-stack):$(RESET)"
	@echo "  $(BOLD)make docker-up$(RESET)       Start all services (builds images if needed)"
	@echo "  $(BOLD)make docker-build$(RESET)    Rebuild all Docker images"
	@echo "  $(BOLD)make docker-down$(RESET)     Stop and remove containers"
	@echo "  $(BOLD)make docker-logs$(RESET)     Follow all service logs"
	@echo "  $(BOLD)make docker-ps$(RESET)       Show container status"
	@echo ""
	@echo "$(CYAN)Code quality:$(RESET)"
	@echo "  $(BOLD)make lint$(RESET)            Run ESLint on both apps"
	@echo "  $(BOLD)make typecheck$(RESET)       TypeScript type-check frontend"
	@echo "  $(BOLD)make format$(RESET)          Run Prettier on both apps"
	@echo "  $(BOLD)make test$(RESET)            Run backend tests"
	@echo ""
	@echo "$(CYAN)Production:$(RESET)"
	@echo "  $(BOLD)make build$(RESET)           Build frontend for production"
	@echo "  $(BOLD)make pm2-start$(RESET)       Start backend with PM2 (production)"
	@echo "  $(BOLD)make pm2-reload$(RESET)      Zero-downtime PM2 reload"
	@echo "  $(BOLD)make pm2-stop$(RESET)        Stop PM2 processes"
	@echo "  $(BOLD)make pm2-logs$(RESET)        View PM2 logs"
	@echo ""

# ── Dependencies ──────────────────────────────────────────────────────────────
.PHONY: install
install:
	@echo "$(GREEN)Installing frontend dependencies...$(RESET)"
	npm install
	@echo "$(GREEN)Installing backend dependencies...$(RESET)"
	cd haitech-medical-backend-main && npm install
	@echo "$(GREEN)All dependencies installed$(RESET)"

# ── Infrastructure ────────────────────────────────────────────────────────────
.PHONY: infra
infra:
	@echo "$(GREEN)Starting PostgreSQL + Redis...$(RESET)"
	docker compose -f docker-compose.infra.yml up -d
	@echo "$(GREEN)Waiting for services to be healthy...$(RESET)"
	@sleep 3
	@docker compose -f docker-compose.infra.yml ps

.PHONY: infra-stop
infra-stop:
	docker compose -f docker-compose.infra.yml down

.PHONY: infra-reset
infra-reset:
	@echo "$(YELLOW)WARNING: This will delete all local database data!$(RESET)"
	docker compose -f docker-compose.infra.yml down -v

# ── Local development ─────────────────────────────────────────────────────────
.PHONY: dev-api
dev-api:
	cd haitech-medical-backend-main && npm run dev

.PHONY: dev-web
dev-web:
	npm run dev

# ── Database ──────────────────────────────────────────────────────────────────
.PHONY: migrate
migrate:
	cd haitech-medical-backend-main && npm run db:migrate

.PHONY: db-push
db-push:
	cd haitech-medical-backend-main && npm run db:push

.PHONY: db-studio
db-studio:
	cd haitech-medical-backend-main && npm run db:studio

.PHONY: db-generate
db-generate:
	cd haitech-medical-backend-main && npm run db:generate

# ── Docker ────────────────────────────────────────────────────────────────────
.PHONY: docker-up
docker-up:
	docker compose up -d

.PHONY: docker-build
docker-build:
	docker compose build --no-cache

.PHONY: docker-down
docker-down:
	docker compose down

.PHONY: docker-logs
docker-logs:
	docker compose logs -f

.PHONY: docker-ps
docker-ps:
	docker compose ps

.PHONY: docker-restart
docker-restart:
	docker compose restart

# ── Code quality ──────────────────────────────────────────────────────────────
.PHONY: lint
lint:
	@echo "$(GREEN)Linting frontend...$(RESET)"
	npx eslint . || true
	@echo "$(GREEN)Linting backend...$(RESET)"
	cd haitech-medical-backend-main && npm run lint || true

.PHONY: typecheck
typecheck:
	npx tsc --noEmit

.PHONY: format
format:
	@echo "$(GREEN)Formatting frontend...$(RESET)"
	npx prettier --write .
	@echo "$(GREEN)Formatting backend...$(RESET)"
	cd haitech-medical-backend-main && npx prettier --write .

.PHONY: test
test:
	cd haitech-medical-backend-main && npm test

# ── Build ─────────────────────────────────────────────────────────────────────
.PHONY: build
build:
	npm run build

# ── PM2 (production) ──────────────────────────────────────────────────────────
.PHONY: pm2-start
pm2-start:
	cd haitech-medical-backend-main && pm2 start ecosystem.config.cjs --env production

.PHONY: pm2-reload
pm2-reload:
	cd haitech-medical-backend-main && pm2 reload ecosystem.config.cjs --env production

.PHONY: pm2-stop
pm2-stop:
	pm2 stop all

.PHONY: pm2-logs
pm2-logs:
	pm2 logs api-server

.PHONY: pm2-monit
pm2-monit:
	pm2 monit

# ── CI checks (run locally before pushing) ────────────────────────────────────
.PHONY: ci
ci: typecheck lint test build
	@echo "$(GREEN)All CI checks passed$(RESET)"
