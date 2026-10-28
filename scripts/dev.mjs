import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const input = process.argv.slice(2);
const args = [];
// Accept the preview supervisor's Vite-style flags and translate them to the
// equivalent Next CLI. Normal npm run dev remains a regular Next dev server.
for (const arg of input) {
  if (arg === '--strictPort') continue;
  args.push(arg === '--host' ? '--hostname' : arg);
}
if (!args.includes('--hostname')) args.push('--hostname', '0.0.0.0');
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...args], { stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 0; });
