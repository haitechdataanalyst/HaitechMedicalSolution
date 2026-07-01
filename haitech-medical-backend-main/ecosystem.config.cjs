/**
 * PM2 Ecosystem Configuration
 *
 * Usage:
 *   Development  : pm2 start ecosystem.config.cjs --env development
 *   Production   : pm2 start ecosystem.config.cjs --env production
 *   Reload zero-downtime: pm2 reload ecosystem.config.cjs --env production
 *   Logs         : pm2 logs api-server
 *   Monitor      : pm2 monit
 */
module.exports = {
	apps: [
		{
			name: 'api-server',
			script: 'index.js',

			// ── Cluster mode ─────────────────────────────────────────────────
			// Fork one worker per logical CPU core so all cores are utilised.
			// PM2 load-balances incoming connections across workers automatically.
			exec_mode: 'cluster',
			instances: 'max',

			// ── Restart policy ───────────────────────────────────────────────
			// Restart immediately on crash but apply exponential back-off after
			// repeated failures to avoid a rapid restart loop.
			autorestart: true,
			max_restarts: 10,
			min_uptime: '5s', // process must stay up ≥5 s to count as a successful start
			restart_delay: 1000, // ms between automatic restarts

			// Kill the old process only after the new one is ready (zero-downtime reload).
			wait_ready: true,
			listen_timeout: 10000, // ms PM2 waits for app to send process.send('ready')
			kill_timeout: 5000, // ms to wait for graceful shutdown before SIGKILL

			// ── Memory threshold ─────────────────────────────────────────────
			// Restart a worker if it exceeds this heap threshold.
			// Prevents slow OOM-induced degradation in long-running processes.
			max_memory_restart: '512M',

			// ── Logs ─────────────────────────────────────────────────────────
			// Separate files per stream; date-based rotation keeps disk usage bounded.
			out_file: './logs/pm2-out.log',
			error_file: './logs/pm2-err.log',
			merge_logs: false, // keep stdout / stderr in separate files
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

			// ── Log rotation (requires pm2-logrotate module) ─────────────────
			// Install once: pm2 install pm2-logrotate
			// These env vars are picked up by pm2-logrotate automatically.
			env: {
				PM2_LOGROTATE_MAX_SIZE: '20M',
				PM2_LOGROTATE_RETAIN: '14', // keep 14 rotated files
				PM2_LOGROTATE_COMPRESS: 'true',
				PM2_LOGROTATE_ROTATE_INTERVAL: '0 0 * * *', // daily at midnight
			},

			// ── Per-environment overrides ─────────────────────────────────────
			// Merged on top of the base config when --env flag is passed.
			env_development: {
				NODE_ENV: 'development',
				instances: 1, // single worker is easier to debug
				watch: false,
			},

			env_production: {
				NODE_ENV: 'production',
				instances: 'max',
				watch: false,
				// Source maps let PM2 report correct file/line in error logs.
				source_map_support: true,
			},
		},
	],
};
