/**
 * There is no backend behind this site. A request nobody mocked lands on the
 * static host, which answers with its HTML fallback page or a 404; that is
 * reported as NoBackendError so the page can tell the reader to run a test.
 * A mocked response is always JSON, so anything JSON is the "server" talking.
 */
export class NoBackendError extends Error {
  constructor() {
    super('No backend answered this request')
  }
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`Request failed with status ${status}`)
  }
}

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json' } })
  } catch {
    throw new NoBackendError()
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  if (!isJson && response.status !== 204) throw new NoBackendError()

  const body: unknown = response.status === 204 ? undefined : await response.json()
  if (!response.ok) throw new HttpError(response.status, body)
  return body as T
}
