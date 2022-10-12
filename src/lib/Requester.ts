export interface IJSONValidObject {
  [key: string]: string|IJSONValidObject|(string|IJSONValidObject)[]
}

export type IRequestBody = string|IJSONValidObject|(IRequestBody)[]

export default class Requester {
  static async get(URL: string, headers?: HeadersInit) {
    const request = await fetch(URL, {
      method:'get',
      headers
    });

    const response = await request.json();

    return response;
  }

  static async post(URL: string, headers?: IJSONValidObject | string, body?: IRequestBody) {
    return await Requester.baseRequest('post', URL, headers, body);
  }

  static async put(URL: string, headers?: IJSONValidObject | string, body?: IRequestBody) {
    return await Requester.baseRequest('put', URL, headers, body);
  }

  static async delete(URL: string, headers?: IJSONValidObject | string, body?: IRequestBody) {
    return await Requester.baseRequest('delete', URL, headers, body);
  }

  static async baseRequest(method: string, URL: string, headers?: IJSONValidObject | string, body?: IRequestBody) {
    if (typeof headers === 'string'){
      if(!body) {
        body = headers;
        headers = {};
      }
      else
        throw new Error('Headers parameter must be an object.');
    }

    if (body && typeof body !== 'string')
      body = JSON.stringify(body);

    // ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  == //
    
    const request = await fetch(URL, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body
    });

    const response = await request.json();

    return response;
  }
}