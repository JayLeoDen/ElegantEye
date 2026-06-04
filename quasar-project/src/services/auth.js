export function getUser () {
  try { return JSON.parse(localStorage.getItem('ee_user') || 'null') } catch { return null }
}
export function setUser (payload) {
  localStorage.setItem('ee_user', JSON.stringify(payload.user))
  localStorage.setItem('ee_token', payload.token || '')
}
export function logout () {
  localStorage.removeItem('ee_user')
  localStorage.removeItem('ee_token')
}
export function homeForRole (role) {
  if (role === 'admin') return '/admin'
  if (role === 'fotograf') return '/fotograf/profil'
  return '/korisnik/profil'
}
