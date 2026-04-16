import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const signUp  = (body) => api.post('/auth/signup', body)
export const signIn  = (body) => api.post('/auth/signin', body)

// Books
export const getAllBooks = ()          => api.get('/books/all')
export const addBook     = (body)      => api.post('/books/new', body)
export const updateBook  = (id, body)  => api.put(`/books/edit/${id}`, body)
export const deleteBook  = (id)        => api.delete(`/books/remove/${id}`)

// Authors
export const getAllAuthors = ()     => api.get('/author/all')
export const addAuthor     = (body) => api.post('/author/add', body)
export const updateAuthor   = (id, body)  => api.put(`/author/edit/${id}`, body)  
export const deleteAuthor   = (id)        => api.delete(`/author/delete/${id}`)    

// Favoris API
export const addFavourite    = (bookId) => api.post(`/favourites/${bookId}`)
export const removeFavourite = (bookId) => api.delete(`/favourites/${bookId}`)
export const getMyFavourites = ()       => api.get('/favourites/mine')
export const getFavStats     = ()       => api.get('/favourites/stats')

export default api
