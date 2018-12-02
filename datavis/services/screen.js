import request from 'utils/request';
import API from './api';

export async function queryScreen() {
  return request(API.SCREEN_LIST);
}

export async function newScreen(params) {
  return request(API.SCREEN_CREATE, {
    method: 'POST',
    body: params
  });
}

export async function removeScreen(id) {
  return request(`${API.SCREEN_DELETE}/${id}`, {
    method: 'DELETE'
  });
}

export async function updateScreen(params) {
  const { id } = params;
  return request(`${API.SCREEN_UPDATE}/${id}`, {
    method: 'PUT',
    body: params
  });
}
