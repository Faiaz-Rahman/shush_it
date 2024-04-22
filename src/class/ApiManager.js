//import { defaultHeaders } from './apiConfig';
import API_URLS from '../Api';
import Token from './TokenManager';
import CONSTANTS from '../Constants';


const fetchWithTimeout = async (resource, options = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};

export const request = async (endpoint, method, body = null, headers = null) => {

  console.log('ApiManager Network Request end: ' + endpoint)
  const url = `${API_URLS.URL}${endpoint}`;
  console.log('ApiManager Network Request url: ' + url)
  const token = await Token.getToken();
  console.log('ApiManager Token:  ' + token);

  console.log('Header: ' + headers)
  let options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
    },
    body: body ? JSON.stringify(body) : null,
  };

  if (headers != null) {
    options = {
      method,
      headers: headers,
      body: body ? body : null,
    };
  }

  if (method === 'GET') {
    delete options.body; // GET requests don't have a body
  }

  try {
    const response = await fetchWithTimeout(url, options);
    const json = await response.json();
    if (response.ok) {
      const status = response.status;
      switch (status) {
        case CONSTANTS.HTTP_STATUS_CODE.OK:
          return json;
          break;
        case CONSTANTS.HTTP_STATUS_CODE.BAD_REQUEST |
          CONSTANTS.HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR |
          CONSTANTS.HTTP_STATUS_CODE.UNAUTHORIZED |
          CONSTANTS.HTTP_STATUS_CODE.UNAUTHORIZED |
          CONSTANTS.HTTP_STATUS_CODE.NOT_FOUND |
          CONSTANTS.HTTP_STATUS_CODE.GATEWAY_TIMEOUT |
          CONSTANTS.HTTP_STATUS_CODE.FORBIDDEN:
          throw new Error(json.message || 'API Error status: ' + status);
          break;
        default:
          console.log('Status Code' + status);
          throw new Error(json.message || 'API Error' + status);
      }
    } else {
      throw new Error(json.message || 'API Error: ' + response.status);
    }
  } catch (error) {
    console.log('API call error:', error);
    throw (error);
  }
};

export const get = (endpoint, headers = null) => request(endpoint, 'GET', null, headers);
export const post = (endpoint, body, headers = null) => request(endpoint, 'POST', body, headers);
export const put = (endpoint, body, headers = null) => request(endpoint, 'PUT', body, headers);
export const del = (endpoint, headers = null) => request(endpoint, 'DELETE', null, headers);