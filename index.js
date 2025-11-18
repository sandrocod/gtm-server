import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Endpoint para receber dados do GTM Web
app.post('/data', (req, res) => {
  console.log('Evento recebido:', req.body);
  // Aqui você pode disparar para Facebook CAPI ou outro serviço
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`GTM Server rodando na porta ${port}`);
});
