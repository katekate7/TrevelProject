import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default api;

export const fetchTripPlaces = id =>
  api.get(`/trips/${id}/places`);

export const saveTripPlaces = (id, waypoints) =>
  api.post(`/trips/${id}/places`, { waypoints });

export const fetchTripRoute = id =>
  api.get(`/trips/${id}/route`);

export const saveTripRoute = (id, routeData, distance) =>
  api.post(`/trips/${id}/route`, { routeData, distance });
