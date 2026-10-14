import api from './api'

const STATUS_ALIASES = {
  published: ['published', 'publish'],
  draft: ['draft', 'drafts'],
  trashed: ['trashed', 'trash'],
}

const getStatusValue = (article) => String(article?.status ?? '').toLowerCase()

const matchesStatus = (article, expectedStatus) => {
  const aliases = STATUS_ALIASES[expectedStatus] ?? [expectedStatus]
  return aliases.includes(getStatusValue(article))
}

const normalizeArticlesResponse = (payload) => {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: payload.length,
    }
  }

  if (Array.isArray(payload?.data)) {
    return {
      items: payload.data,
      total: Number(payload?.total ?? payload?.meta?.total ?? payload.data.length),
    }
  }

  if (Array.isArray(payload?.items)) {
    return {
      items: payload.items,
      total: Number(payload?.total ?? payload?.meta?.total ?? payload.items.length),
    }
  }

  return {
    items: [],
    total: 0,
  }
}

export const listArticles = async ({ status, limit, offset } = {}) => {
  const params = {}

  if (status) params.status = status
  if (typeof limit === 'number') params.limit = limit
  if (typeof offset === 'number') params.offset = offset

  const { data } = await api.get('/articles', { params })
  const normalized = normalizeArticlesResponse(data)

  if (status) {
    normalized.items = normalized.items.filter((article) => matchesStatus(article, status))
  }

  return normalized
}

export const getArticle = async (id) => {
  const { data } = await api.get(`/articles/${id}`)
  return data?.data ?? data
}

export const createArticle = async (article) => {
  const { data } = await api.post('/articles', article)
  return data?.data ?? data
}

export const updateArticle = async (id, article) => {
  const { data } = await api.put(`/articles/${id}`, article)
  return data?.data ?? data
}

export const trashArticle = async (id) => {
  await api.delete(`/articles/${id}`)
}
