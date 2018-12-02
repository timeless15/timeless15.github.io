import request from 'utils/request';
import API from './api';

export async function queryData() {
  return request(API.DATA_LIST);
}

export async function uploadData(params) {
  return request(API.DATA_UPLOAD, {
    method: 'POST',
    body: params
  });
}

export async function deleteData(id) {
  return request(`${API.DATA_DELETE}/${id}`, {
    method: 'DELETE'
  });
}

export async function searchData(id) {
  return request(`${API.DATA_SEARCH}/${id}`, {
    mehotd: 'GET'
  });
}
