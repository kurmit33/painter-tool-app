const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('painter-tool-token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      'Content-Type': 'application/json',

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || 'Wystąpił błąd podczas komunikacji z serwerem.'
    );
  }

  return data;
}

/*
 * =========================
 * AUTH
 * =========================
 */

export async function register(email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

/*
 * =========================
 * HEALTH
 * =========================
 */

export async function getHealth() {
  return request('/health');
}

/*
 * =========================
 * COLORING SETS
 * =========================
 */

export async function getColoringSets(search = '') {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : '';

  return request(`/coloring-sets${query}`);
}

export async function getColoringSet(id) {
  return request(`/coloring-sets/${id}`);
}

export async function createColoringSet(title, description = '') {
  return request('/coloring-sets', {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
    }),
  });
}

/*
 * =========================
 * COLORING PAGES
 * =========================
 */

export async function getColoringPages(setId) {
  return request(
    `/coloring-pages?setId=${encodeURIComponent(setId)}`
  );
}

export async function getColoringPage(id) {
  return request(`/coloring-pages/${id}`);
}

export async function createColoringPage(page) {
  return request('/coloring-pages', {
    method: 'POST',
    body: JSON.stringify(page),
  });
}

/*
 * =========================
 * ARTWORKS
 * =========================
 */

export async function getMyArtworks() {
  return request('/artworks/my');
}

export async function getArtwork(id) {
  return request(`/artworks/${id}`);
}

export async function getGallery(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.setId) {
    searchParams.set('setId', params.setId);
  }

  if (params.pageId) {
    searchParams.set('pageId', params.pageId);
  }

  const query = searchParams.toString();

  return request(
    `/artworks/gallery${query ? `?${query}` : ''}`
  );
}

export async function createArtwork(artwork) {
  return request('/artworks', {
    method: 'POST',
    body: JSON.stringify(artwork),
  });
}

export async function updateArtwork(id, artwork) {
  return request(`/artworks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(artwork),
  });
}

export async function setArtworkPublic(id, isPublic) {
  return request(`/artworks/${id}/public`, {
    method: 'PATCH',
    body: JSON.stringify({
      isPublic,
    }),
  });
}

export async function deleteArtwork(id) {
  return request(`/artworks/${id}`, {
    method: 'DELETE',
  });
}

export { API_URL };