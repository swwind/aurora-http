import { Response } from "./deps.ts";

class KResponse {
  private _status = 404;
  private _body: string = "404 NOT FOUND";
  headers = new Headers();

  status(status: number) {
    this._status = status;
    return this;
  }

  json(obj: Object) {
    this.headers.set('Content-Type', 'application/json');
    this._body = JSON.stringify(obj);
    return this;
  }

  html(html: string) {
    this.headers.set('Content-Type', 'text/html');
    this._body = html;
    return this;
  }

  text(text: string) {
    this.headers.set('Content-Type', 'text/plain');
    this._body = text;
    return this;
  }

  body(body: string) {
    this._body = body;
    return this;
  }

  redirect(url: string) {
    this._status = 302;
    this.headers.set('Location', url);
    return this;
  }

  getResponse(): Response {
    return {
      status: this._status,
      body: this._body,
      headers: this.headers,
    };
  }
}

export default KResponse;
