const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');
const landingDir = path.join(rootDir, 'landing');

console.log('\x1b[33m%s\x1b[0m', '==================================================');
console.log('\x1b[33m%s\x1b[0m', '   SIGO-PJ ZULIA - Entorno de Desarrollo Local   ');
console.log('\x1b[33m%s\x1b[0m', '==================================================');
console.log('Iniciando servicios locales sin Docker...\n');

const processes = [];

function runProcess(name, command, args, cwd, colorCode) {
  const isWindows = process.platform === 'win32';
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    env: { ...process.env, PYTHONUNBUFFERED: '1' }
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`\x1b[${colorCode}m[${name}]\x1b[0m ${line}`);
      }
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`\x1b[${colorCode}m[${name}]\x1b[0m ${line}`);
      }
    });
  });

  proc.on('close', (code) => {
    console.log(`[${name}] Proceso finalizado con código ${code}`);
  });

  processes.push(proc);
  return proc;
}

// 1. Iniciar Backend FastAPI
console.log('\x1b[32m%s\x1b[0m', '-> Backend API disponible en: http://localhost:8000');
console.log('\x1b[32m%s\x1b[0m', '   Docs Swagger en:          http://localhost:8000/api/v1/docs');
runProcess('API', 'python', ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000', '--reload'], backendDir, '33');

// 2. Iniciar Landing Page en puerto 3000
console.log('\x1b[36m%s\x1b[0m', '-> Landing Page disponible en: http://localhost:3000');
runProcess('LANDING', 'python', ['-m', 'http.server', '3000', '--directory', landingDir], rootDir, '35');

// 3. Iniciar Frontend SPA (React + Vite) en puerto 5173
console.log('\x1b[34m%s\x1b[0m', '-> Frontend SPA disponible en: http://localhost:5173\n');
runProcess('SPA', 'npm', ['run', 'dev'], frontendDir, '36');

function cleanup() {
  console.log('\nDeteniendo todos los servicios SIGO-PJ...');
  processes.forEach((proc) => {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', proc.pid, '/f', '/t']);
      } else {
        proc.kill('SIGINT');
      }
    } catch (e) {}
  });
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
