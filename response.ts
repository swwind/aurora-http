import type { Response } from "./deps.ts";

class KResponse {
  private _status = 500;
  private _body: string | Deno.Reader | Uint8Array = "Server Error";
  headers = new Headers();

  /**
   * Set response status
   * @param status Status code
   */
  status(status: number) {
    this._status = status;
    return this;
  }

  /**
   * Response as json file
   * @param obj JSON object
   */
  json(obj: Object) {
    this.headers.set("Content-Type", "application/json");
    return this.body(JSON.stringify(obj));
  }

  /**
   * Response as html content
   * @param html HTML content
   */
  html(html: string) {
    this.headers.set("Content-Type", "text/html");
    return this.body(html);
  }

  /**
   * Response as plain text
   * @param text Plain text
   */
  text(text: string) {
    this.headers.set("Content-Type", "text/plain");
    return this.body(text);
  }

  /**
   * Set response body
   * @param body response body
   */
  body(body: string | Deno.Reader | Uint8Array) {
    this._body = body;
    return this;
  }

  /**
   * fast 400 Bad Request response
   * @param text Error Message or JSON Object
   */
  fail(msg: string | object) {
    if (typeof msg === "string") {
      this.text(msg);
    } else {
      this.json(msg);
    }
    return this.status(400);
  }

  /**
   * fast 302 response
   * @param url location
   */
  redirect(url: string) {
    this.headers.set("Location", url);
    return this.status(302);
  }

  /**
   * Get as response type
   */
  toResponse(): Response {
    return {
      status: this._status,
      body: this._body,
      headers: this.headers,
    };
  }
}

export default KResponse;
