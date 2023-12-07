export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private handleResponse<T>(xhr: XMLHttpRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const responseData = JSON.parse(xhr.responseText) as T;
        resolve(responseData);
      } else {
        reject(new Error(`Request failed with status: ${xhr.status}`));
      }
    });
  }

  private sendRequest<T>(
    method: string,
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}/${endpoint}`;
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = () => {
        // readyState
        // 0: 초기화되지 않음
        // 1: 서버 연결 설정됨
        // 2: 요청이 받아들여짐
        // 3: 요청이 처리 중
        // 4: 요청이 완료됨
        if (xhr.readyState === 4) {
          this.handleResponse<T>(xhr).then(resolve).catch(reject);
        }
      };

      if (data) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.sendRequest<T>("GET", endpoint);
  }

  public post<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    return this.sendRequest<T>("POST", endpoint, data);
  }

  public patch<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    return this.sendRequest<T>("PATCH", endpoint, data);
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.sendRequest<T>("DELETE", endpoint);
  }

  public put<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    return this.sendRequest<T>("PUT", endpoint, data);
  }
}
