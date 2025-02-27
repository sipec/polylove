import { APIHandler } from './helpers/endpoint'

export const searchLocation: APIHandler<'search-location'> = async (body) => {
  const { term, limit } = body
  const apiKey = process.env.GEODB_API_KEY

  if (!apiKey) {
    return { status: 'failure', data: 'Missing GEODB API key' }
  }
  const host = 'wft-geo-db.p.rapidapi.com'
  const baseUrl = `https://${host}/v1/geo`
  const url = `${baseUrl}/cities?namePrefix=${term}&limit=${
    limit ?? 10
  }&offset=0&sort=-population`

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    })
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const data = await res.json()
    return { status: 'success', data: data }
  } catch (error) {
    return { status: 'failure', data: error }
  }
}
