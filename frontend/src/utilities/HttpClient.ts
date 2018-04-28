interface ResponseOptions {
  headers: {
    'Content-Type': string
    Authorization?: string
  };
}

/**
 *
 * A convenience wrapper a round the ES6 fetch specification.
 *
 * Simplifies some of the management around using fetch.
 *
 * @example "/docs/utilities/HttpClient.md" docs
 *
 */
export class HttpClient {
  defaultOptions: object;
  headers: ResponseOptions;

  /**
   *
   * @param options - default fetch options to be used in every request, these can be overridden and added
   *  to on a per request basis.
   *  @param authToken
   * @param defaultContentType
   */
  constructor(
    options: object = { credentials: "include" },
    authToken: string|null = null,
    defaultContentType: string = "application/json"
  ) {
    let headers;

    //todo handle additional content types
    switch (defaultContentType) {
      case "application/json":
        headers = {
          "Content-Type": defaultContentType
        };
        break;
      default:
        headers = {
          "Content-Type": defaultContentType
        };
        break;
    }

    this.defaultOptions = options;
    this.headers = {
      headers: headers
    };

    if(authToken) {
      this.headers.headers.Authorization = `Bearer ${authToken}`;
    }
  }

  /**
   * Performs a deep copy of an object
   * @param object
   */
  deepCopy(object: object): object {
    return JSON.parse(JSON.stringify(object));
  }

  /**
   * Handles the response and either rejects the promise or
   * returns the valid response feedback.
   *
   * Invalid responses are expected to have http status codes of 400-500's
   * @param response
   * @param options
   * @returns {*}
   */
  handleResponse(response: Response, options: ResponseOptions): Promise<any> {
    if (!response.ok) {
      return this.handleErrorResponse(response, options);
      // return response.json().then(message => {
      //   return Promise.reject({
      //     message: message,
      //     response: response
      //   });
      // });
    } else {
      return this.handleValidResponse(response, options);
    }
  }

  async handleErrorResponse(response: Response, options: ResponseOptions): Promise<any> {
    let contentType = response.headers.get("Content-Type");
    let message = null;

    //try to return the response based of the response header
    if (contentType) {
      if (contentType === "application/json") {
        message = await response.json();
      } else if (contentType.includes("text/html")) {
        message = await response.text();
      } else {
        message = await response.text();
      }
    }

    if (message === null) {
      switch (options.headers["Content-Type"]) {
        case "application/json":
          message = await response.json();
          break;
        case "text/html":
          message = await response.text();
          break;
        default:
          message = await response.text();
          break;
      }
    }

    return Promise.reject(message)
  }

  /**
   * Returns the appropriate date parsed depending on the content type.
   * @param response
   * @param options
   */
  handleValidResponse(response: Response, options: ResponseOptions): Promise<any> {
    let contentType = response.headers.get("Content-Type");

    if (response.status === 204) {
      return Promise.resolve();
    }

    //try to return the response based of the response header
    if (contentType) {
      if (contentType.includes("application/json")) {
        return response.json();
      } else if (contentType.includes("text/html")) {
        return response.text();
      } else {
        return response.text();
      }
    }

    if (response.status !== 204) {
      switch (options.headers["Content-Type"]) {
        case "application/json":
          return response.json();
        case "text/html":
          return response.text();
        default:
          return response.text();
      }
    }

    return response.json();
  }

  /**
   * Performs an http GET request and returns the parsed response.
   *
   * @param url
   * @param options
   */
  get(url: string, options = {}): Promise<any> {
    let defaults = this.deepCopy(this.defaultOptions);
    let optionsToUse = (<any>Object).assign(defaults, this.headers, options, { method: "get" });
    return fetch(url, optionsToUse).then(response => this.handleResponse(response, optionsToUse));
  }

  /**
   * Performs an http PUT request and returns the parsed response
   * @param url
   * @param options
   */
  put(url: string, options = {}): Promise<any> {
    let defaults = this.deepCopy(this.defaultOptions);
    let optionsToUse = (<any>Object).assign(defaults, this.headers, options, { method: "put" });

    return fetch(url, optionsToUse).then(response => this.handleResponse(response, optionsToUse));
  }

  patch(url: string, options = {}): Promise<any> {
    let defaults = this.deepCopy(this.defaultOptions);
    let optionsToUse = (<any>Object).assign(defaults, this.headers, options, { method: "patch" });

    return fetch(url, optionsToUse).then(response => this.handleResponse(response, optionsToUse));
  }

  post(url: string, options = {}): Promise<any> {
    let defaults = this.deepCopy(this.defaultOptions);
    let optionsToUse = (<any>Object).assign(defaults, this.headers, options, { method: "post" });
    return fetch(url, optionsToUse).then(response => this.handleResponse(response, optionsToUse));
  }

  delete(url: string, options = {}): Promise<any> {
    let defaults = this.deepCopy(this.defaultOptions);
    let optionsToUse = (<any>Object).assign(defaults, this.headers, options, { method: "delete" });
    return fetch(url, optionsToUse).then(response => this.handleResponse(response, optionsToUse));
  }
}
