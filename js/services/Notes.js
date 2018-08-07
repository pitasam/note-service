import { Encryption } from "./Encryption";

// import {Http} from './services/HttpService';

// window.http = new Http('http://localhost:3000');

export class Notes{

    static getAll(secretKey = false){
        return new Promise((resolve, reject) => {
            if(!secretKey) { throw new Error('No secretkey');};

            window.http.get('/notes')
            .then((cryptNotes) => {
                let notes = [];
                for (let i=0, len=cryptNotes.length; i<len; i++) {
                    notes.push(Encryption.decryptObj(cryptNotes[i], secretKey));
                }
               
                resolve(notes);
            })
            .catch((e)=>{
                reject(e);
            });
        })
    }

    static getOne(idNote, secretKey = false){
        
        return new Promise((resolve, reject)=>{
            if(!secretKey) { throw new Error('No secretkey');};

            window.http.get(`/notes/${idNote}`)
            .then((cryptNote) => {
                const note = Encryption.decryptObj(cryptNote, secretKey);
               
                resolve(note);
            })
            .catch((e) => {
                reject(e);
            });
        });
    }

    static create(jsonNewNote, secretKey = false){
        return new Promise((resolve, reject) => {
            if(!secretKey) { throw new Error('No secretkey');};
            
            const cryptJsonNewNote = Encryption.encryptObj(jsonNewNote, secretKey);
            const jsonStringNewNote = JSON.stringify(cryptJsonNewNote);

            window.http.post('/notes', jsonStringNewNote)
            .then(function(cryptNewNote){
                const newNote = Encryption.decryptObj(cryptNewNote, secretKey);
               
                resolve(newNote);
            })
            .catch((e)=>{
                reject(e);
            });
        });
    }

    static save(idNote, jsonUpdateNote, secretKey = false) {
        return new Promise((resolve, reject) => {
            if(!secretKey) { throw new Error('No secretkey');};
            const cryptJsonUpdateNote = Encryption.encryptObj(jsonUpdateNote, secretKey);
            const jsonStringUpdateNote = JSON.stringify(cryptJsonUpdateNote);
                        
            window.http.patch(`/notes/${idNote}`, jsonStringUpdateNote)
            .then((cryptNote) => {
                const note = Encryption.decryptObj(cryptNote, secretKey);
               
                resolve(note);
            })
            .catch((e)=>{
                if(e.name == 'ConnectionServerError') {
                    window.flash.add('error', 'Error', 'Sorry, connection to the server is not installed. Try again later.');
                    window.flash.showMessages();
                }
                reject(e);
            });
        });
    }

    static delete(idNote){
        return new Promise((resolve, reject) => {
            window.http.delete(`/notes/${idNote}`)
            .then((deleteNote) => {
                resolve(deleteNote);
            })
            .catch((e) => {
                reject(e);
            });
        });
    }

    static show(note = {'title':'','text':''}, edit = false){
        if(edit) {
            let inputTitle = document.querySelector('.title-note');
            let editorBlock = document.querySelector('.ck-editor');

            inputTitle.value = note['title'];
            window.editor.setData(' ');
            window.editor.model.change( writer => {
                window.editor.setData(note['text']);
            });

            inputTitle.style.display = 'block';
            editorBlock.style.display = 'block';
        } else {            
            let titleBlock = document.querySelector('.header__text-title-note');
            let noteTextBlock = document.querySelector('.note__text');

            //заголовок
            titleBlock.textContent = note['title'];

            //текст
            noteTextBlock.innerHTML = note['text'];

            titleBlock.style.display = 'block';
            noteTextBlock.style.display = 'block';
        }
    }

    //собираем инфу с блочков
    static getDataNoteFromBlocks() {
        const inputTitleData = document.querySelector('.title-note').value;
        const editorData = window.editor.getData();
        const dataNote = {
            'title': inputTitleData,
            'text': editorData
        };

        return dataNote;
    }

    static hide( edit = false){
        if(edit) {
            let inputTitle = document.querySelector('.title-note');
            let editorBlock = document.querySelector('.ck-editor');

            inputTitle.value = '';
            inputTitle.style.display = 'none';
            window.editor.setData(' ');

            inputTitle.style.display = 'none';
            editorBlock.style.display = 'none';

        } else {
            let titleBlock = document.querySelector('.header__text-title-note');
            let noteTextBlock = document.querySelector('.note__text');
            
            //заголовок
            titleBlock.textContent = '';

            //текст
            noteTextBlock.innerHTML = '';

            titleBlock.style.display = 'none';
            noteTextBlock.style.display = 'none';
            
        }
    }
}