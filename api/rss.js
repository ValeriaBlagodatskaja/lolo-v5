// * Bypass CORS restrictions by fetching the RSS feed from the server
import fetch from 'node-fetch'

export default async function handler(req, res) {
  const { url } = req.query
  const requestOptions = {
    headers: {
      ...req.headers,
      host: new URL(url).host,
    },
    method: req.method,
  }

  if (req.method === 'POST' && req.body) {
    requestOptions.body = JSON.stringify(req.body)
    requestOptions.headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, requestOptions)
    const data = await response.text()
    res.status(response.status).send(data)
  } catch (error) {
    console.error('Failed to forward request:', error)
    res.status(500).send('Server error')
  }
}
