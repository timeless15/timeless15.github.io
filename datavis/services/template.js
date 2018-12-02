import request from 'utils/request';
import API from './api';

export async function queryTemplate() {
  return request(API.TEMPLATE_LIST);
}

export async function newTemplate(params) {
  return request(API.TEMPLATE_CREATE, {
    method: 'POST',
    body: params
  });
}

export async function removeTemplate(id) {
  return request(`${API.TEMPLATE_DELETE}/${id}`, {
    method: 'DELETE'
  });
}
