import {Encryption} from '../services/Encryption';
export class Http {
    constructor(serverUrl){
        this.SERVER_URL = serverUrl || 'http://localhost:8080';
    }

    get(url){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', this.SERVER_URL+url, true);
            
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            
            xhr.onload = function() {
                if (xhr.readyState == 4 && this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    const error = new Error(this.responseText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onerror = function() {
                reject(new ConnectionServerError('Network Error'));
            };

            xhr.send();
        });
    }
    
    post(url, data, xform = false){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', this.SERVER_URL+url, true);
            if(xform){
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            } else {
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            }

            xhr.onload = function() {
                if (xhr.readyState == 4 && this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    const error = new Error(this.responseText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onerror = function() {
             
                reject(new ConnectionServerError('Network Error'));
            };

            xhr.send(data);
        });
    }

    patch(url, data){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('PATCH', this.SERVER_URL+url, true);
            
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            
            xhr.onload = function() {
                var data = JSON.parse(xhr.responseText);
                if (xhr.readyState == 4 && this.status >= 200 && this.status < 300) {

                    resolve(JSON.parse(this.responseText));
                  
                } else {
                    const error = new Error(this.responseText);
                    error.code = this.status;
                    reject(error);
                }
            }

            xhr.onerror = function() {
                reject(new ConnectionServerError('Network Error'));
            };

            xhr.send(data);
        });
    }

    delete(url){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('DELETE', this.SERVER_URL+url, true);
            
            xhr.onload = function() {
                if (xhr.readyState == 4 && this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    const error = new Error(this.responseText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onerror = function() {
                reject(new ConnectionServerError('Network Error'));
            };
          
            xhr.send(null);
        });
    }
}