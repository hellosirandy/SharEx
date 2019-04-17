import queryString from 'query-string';

export default class Api {
  constructor() {
    this.url = 'https://j5haq78dsa.execute-api.us-east-1.amazonaws.com/dev';
  }

  get = async (endpoint: string, token: string, params: any) => {
    const url = params ? `${this.url}${endpoint}?${queryString.stringify(params)}` : `${this.url}${endpoint}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    const parsedRes = await res.json();
    if (!res.ok) {
      throw parsedRes;
    }
    return parsedRes;
  }

  post = async (endpoint: string, token: string, body: any) => {
    const res = await fetch(`${this.url}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return res.json();
  }

  put = async (endpoint: string, token: string, body: any) => {
    const res = await fetch(`${this.url}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return res.json();
  }

  delete = async (endpoint: string, token: string, params: any) => {
    const url = params ? `${this.url}${endpoint}?${queryString.stringify(params)}` : `${this.url}${endpoint}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
    const parsedRes = await res.json();
    if (!res.ok) {
      throw parsedRes;
    }
    return parsedRes;
  }
}
