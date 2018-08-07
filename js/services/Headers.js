// import {Http} from './services/HttpService';

// window.http = new Http('http://localhost:3000');
import {Encryption} from '../services/Encryption';

export class Headers{

    static getAll(secretKey = false){
        return new Promise((resolve, reject) => {
            if(!secretKey) {
                throw new Error('No secret key');
            }

            window.http.get('/titles')
            .then((cryptTitles) => {
                console.log(cryptTitles);
                let titles = [];
                for (let i=0, len=cryptTitles.length; i<len; i++) {
                    titles.push(Encryption.decryptObj(cryptTitles[i], secretKey));
                }
                console.log(titles);
                resolve(titles);
            })
            .catch((e)=>{
                reject(e);
            });
        })
    }

    static getOne(idTitle, secretKey = false){
        return new Promise((resolve, reject)=>{
            if(!secretKey) {
                throw new Error('No secret key');
            }

            window.http.get(`/titles/${idTitle}`)
            .then((cryptTitle) => {
                const title = Encryption.decryptObj(cryptTitle, secretKey);
                resolve(title);
            })
            .catch((e) => {
                reject(e);
            });
        });
    }

    static create(jsonNewTitle, secretKey = false){
        return new Promise((resolve, reject) => {
            if(!secretKey) {
                throw new Error('No secret key');
            }

            const cryptJsonNewTitle = Encryption.encryptObj(jsonNewTitle, secretKey);
            const jsonStringNewTitle = JSON.stringify(cryptJsonNewTitle);
            
            window.http.post('/titles', jsonStringNewTitle)
            .then((cryptNewTitle)=> {
                const newTitle = Encryption.decryptObj(cryptNewTitle, secretKey);
                console.log("newTitle$$$");
                console.log(newTitle);
                resolve(newTitle);
            })
            .catch((e)=>{
                reject(e);
            });
        });
    }

    static save(idTitle, jsonUpdateTitle, secretKey = false) {
        return new Promise((resolve, reject) => {
            if(!secretKey) {
                throw new Error('No secret key');
            }

            const cryptJsonUpdateTitle = Encryption.encryptObj(jsonUpdateTitle, secretKey);
            const jsonStringUpdateTitle = JSON.stringify(cryptJsonUpdateTitle);

            window.http.patch(`/titles/${idTitle}`, jsonStringUpdateTitle)
            .then((cryptTitle) => {
                const title = Encryption.decryptObj(cryptTitle, secretKey);
                resolve(title);
            })
            .catch((e)=>{
                reject(e);
            });
        });
    }

    static delete(idTitle){
        return new Promise((resolve, reject) => {
            window.http.delete(`/titles/${idTitle}`)
            .then((deleteTitle) => {
                resolve(deleteTitle);
            })
            .catch((e) => {
                reject(e);
            });
        });
    }

    // showInListNotes(idTitle){
    //     if(edit) {
    //         let inputTitle = document.querySelector('.title-note');

    //         inputTitle.value = note['title'];
    //         editor.setData(' ');
    //         editor.model.change( writer => {
    //             editor.setData(note['text']);
    //         });
    //     } else {            
    //         let titleBlock = document.querySelector('.header__text-title-note');
    //         let noteTextBlock = document.querySelector('.note__text');

    //         //заголовок
    //         titleBlock.textContent = note['title'];

    //         //текст
    //         noteTextBlock.innerHTML = note['text'];
    //     }
    // }

    // hide(idNote, editor = false, edit = false){
    //     if(edit) {
    //         inputTitle.value = '';
    //         editor.setData(' ');
    //     } else {
    //         //заголовок
    //         titleBlock.textContent = '';

    //         //текст
    //         noteTextBlock.innerHTML = '';
    //     }
    // }
}