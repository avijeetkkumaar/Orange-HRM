const http = require('http');

let employees = [];
let nextId = 1;

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:3001');

  if (req.method === 'GET' && url.pathname === '/health') {
    return send(res, 200, { status: 'ok' });
  }

  if (req.method === 'GET' && url.pathname === '/employees') {
    return send(res, 200, employees);
  }

  const match = url.pathname.match(/^\/employees\/(\d+)$/);

  if (req.method === 'GET' && match) {
    const item = employees.find(e => e.id === Number(match[1]));
    return item ? send(res, 200, item) : send(res, 404, { message: 'Employee not found' });
  }

  if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let payload = {};
      try { payload = body ? JSON.parse(body) : {}; }
      catch { return send(res, 400, { message: 'Invalid JSON body' }); }

      if (req.method === 'POST' && url.pathname === '/employees') {
        const created = { id: nextId++, ...payload };
        employees.push(created);
        return send(res, 201, created);
      }

      if (match) {
        const index = employees.findIndex(e => e.id === Number(match[1]));
        if (index < 0) return send(res, 404, { message: 'Employee not found' });
        employees[index] = { ...employees[index], ...payload };
        return send(res, 200, employees[index]);
      }

      return send(res, 404, { message: 'Route not found' });
    });
    return;
  }

  if (req.method === 'DELETE' && match) {
    const index = employees.findIndex(e => e.id === Number(match[1]));
    if (index < 0) return send(res, 404, { message: 'Employee not found' });
    const [deleted] = employees.splice(index, 1);
    return send(res, 200, { message: 'Employee deleted', employee: deleted });
  }

  return send(res, 404, { message: 'Route not found' });
});

server.listen(3001, '127.0.0.1', () => {
  console.log('Simulated employee API listening on http://127.0.0.1:3001');
});
