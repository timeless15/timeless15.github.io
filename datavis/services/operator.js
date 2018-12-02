import request from 'utils/request';
import API from './api';

export async function newOperator(params) {
  return request(API.OPERATORS_CREATE, {
    method: 'POST',
    body: params
  });
}

export async function deleteOperator(id) {
  return request(`${API.OPERATORS_DELETE}/${id}`, {
    method: 'DELETE'
  });
}

export async function searchOperator(id) {
  return request(`${API.OPERATORS_SEARCH}/${id}`, {
    mehotd: 'GET'
  });
}
