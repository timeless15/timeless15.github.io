import request from 'utils/request';
import API from './api';

export async function queryEditor() {
  return request(API.EDITORS_LIST);
}

export async function newEditor(params) {
  return request(API.EDITORS_CREATE, {
    method: 'POST',
    body: params
  });
}

export async function updateEditor(params) {
  const { id } = params;
  return request(`${API.EDITORS_UPDATE}/${id}`, {
    method: 'PUT',
    body: params
  });
}

export async function searchEditor(id) {
  return request(`${API.EDITORS_SEARCH}/${id}`, {
    method: 'GET'
  });
}

export async function removeEditor(id) {
  return request(`${API.EDITOR_DELETE}/${id}`, {
    method: 'DELETE'
  });
}

export async function fetchData(url) {
  return request(url, {
    method: 'GET'
  });
}
