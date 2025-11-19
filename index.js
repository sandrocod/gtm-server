import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(bodyParser.json());

// Endpoint para receber dados do GTM Web
app.post('/data', async (req, res) => {
  console.log('Evento recebido:', req.body);

  // EXEMPLO: disparar para Facebook CAPI
  const pixel_id = process.env.FB_PIXEL_ID || '<SEU_PIXEL_ID>';
  const access_token = process.env.FB_ACCESS_TOKEN || '<SEU_ACCESS_TOKEN>';

  const body = {
    data: [
      {
        event_name: req.body.event_name || 'FormDataHashed',
        event_time: Math.floor(Date.now() / 1000),
        event_id: req.body.event_id || '',
        action_source: 'website',
        user_data: {
          em: req.body.email || '',
          ph: req.body.telefone || '',
          fn: req.body.nome || '',
          ln: req.body.sobrenome || '',
          client_ip_address: req.body.user_ip || '',
          client_user_agent: req.body.user_agent || '',
          fbp: req.body.fbp || '',
          fbc: req.body.fbc || ''
        },
        custom_data: {
          cep: req.body.cep || '',
          cidade: req.body.cidade || '',
          estado: req.body.estado || '',
          rua: req.body.rua || '',
          numero: req.body.numero || '',
          pais: req.body.pais || '',
          external_id: req.body.external_id || ''
        }
      }
    ],
    access_token: access_token
  };

  try {
    const fbRes = await fetch(`https://graph.facebook.com/v19.0/${pixel_id}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const fbJson = await fbRes.json();
    console.log('Facebook CAPI response:', fbJson);

    res.json({ status: 'ok', facebook: fbJson });
  } catch (err) {
    console.error('Erro ao enviar para Facebook CAPI:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => res.send('GTM Server rodando!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`GTM Server rodando na porta ${port}`);
});
