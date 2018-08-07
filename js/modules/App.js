import {Headers} from '../services/Headers';
import {Notes} from '../services/Notes';
import {Helpers} from '../services/Helpers';
import {Preloader} from '../services/Preloader';
import {Encryption} from '../services/Encryption';

export class App {
    constructor(){
        this.isEditModeActive = false;
        this.deviceIsMobile = this.checkDeviceIsMobile();
        this.isNoteSelected = false;
        this.secretKey = 'песок';
    }

    run(){
        
        const bodyBlock = document.querySelector('body');
        const preloaderFullScreen = new Preloader(bodyBlock, true);
       
        let isFinishFillingListNotes = false;
        let isFinishCreateCKEditor = false;
        const noteEditorBlock = document.querySelector('.note-editor-block');
        
        this.fillingListNotes()
        .then(()=>{
            isFinishFillingListNotes = true;
        })
        .catch((e)=>{
            window.flash.add('error', 'Error', 'Sorry, connection to the server is not installed. Try again later.');
            window.flash.showMessages();
            console.error(e);
        });

        this.createCKEditor()
        .then((editor) => {
            window.editor  = editor;
            this.setUpListeners();

            isFinishCreateCKEditor = true;
        })
        .catch((e) => {
            window.flash.add('error', 'Error', 'Sorry, could not download CKEditor. Try again later.');
            window.flash.showMessages();
            console.error(e);
        });

        Helpers.waiter(function() {
            if(isFinishFillingListNotes && isFinishCreateCKEditor) {
                return true;
            }
        })
        .then(()=>{
            preloaderFullScreen.hide();
        })
        .catch((e)=>{
            preloaderFullScreen.showMessage('Sorry, it is not possible to load the page. Please try again later.');
            
            console.error(e);
        });
    }


    createCKEditor() {
        return new Promise((resolve, reject) => {
            ClassicEditor.create( 
                document.querySelector( '#editor' ) 
            )
            .then((editor) => {
                resolve(editor);
            })
            .catch((e) => {
                reject(e);
            })
        });
    }

    checkDeviceIsMobile(){
        //mobile version
        if (window.innerWidth < 720){
            return true;
        }
        return false;
    }

    setUpListeners(){
        const that = this;
        this.addListener('#save', that.saveButtonClickHandler.bind(that));
        this.addListener('#delete', that.deleteButtonClickHandler.bind(that));
        this.addListener('#add', that.addButtonClickHandler.bind(that));
        this.addListener('#edit', that.editButtonClickHandler.bind(that));
        this.addListener('#end-edit', that.endEditButtonClickHandler.bind(that));
        this.addListener('#mobile-menu', that.mobileMenuButtonClickHandler.bind(that));
        this.addListener('#close', that.closeButtonClickHandler.bind(that));
        this.addListener('.notes', that.listNotesClickHandler.bind(that));

        window.addEventListener('resize', that.windowResizeHandler.bind(that));
    }

    addListener(selector, funcHandler, event = 'click'){
        try{
            if(!selector){throw new Error('Not passed the element\'s selector');}
            if(!funcHandler){throw new Error('Can not find handler function');}
            if(typeof funcHandler !== 'function'){throw new Error('Handler not a function');}
            
            let element = document.querySelector(selector);
            if(!element){throw new Error('Can not find element');}
            
            element.addEventListener(event, funcHandler);
        } catch (e){
            console.error(e.name + ': ' + e.message);
        }
    }

    windowResizeHandler(){
        const sidebar = document.querySelector('.sidebar');
        const closeBtn = document.querySelector('#close');
        let widthWindow = window.innerWidth;

        if (widthWindow < 720) {
            this.deviceIsMobile = true;
           
            if (!this.isNoteSelected) {
                document.querySelector('.first-message').style.display = 'none';
            }

            if (this.isNoteSelected) {
                sidebar.classList.add('visually-hidden');
            }
                        
        } else {
            if (!this.isNoteSelected) {
                document.querySelector('.first-message').style.display = 'inline-block';
            }

            if (sidebar.classList.contains('visually-hidden')){
                sidebar.classList.remove('visually-hidden');
            }

            this.deviceIsMobile = false;
            closeBtn.style.display = 'none';
        }
    }

    saveButtonClickHandler() {
        this.saveNoteFromEditMode()
        .then((noteData)=>{
            window.flash.add('success', 'Success', 'The note was saved successfully');
            window.flash.showMessages();
        })
        .catch((e)=>{
            console.error(e.name);
            if(e.name == 'ConnectionServerError') {
               
                window.flash.add('error', 'Error', 'Sorry, connection to the server is not installed. Try again later.');
                window.flash.showMessages();
            } else {
                
                window.flash.add('error', 'Error', 'Sorry, the note is not saved. Try again.');
                window.flash.showMessages();
            }
            console.error(e);
        });
    }
    
    deleteButtonClickHandler() {

        const list = document.querySelector('.notes');
        let numberOfItemsBefore = list.children.length;

        if (numberOfItemsBefore === 0) {
            window.flash.add('error', 'Error', 'No notes.');
            window.flash.showMessages();
            return;
        }

        const that = this;
        const item = document.querySelector('.notes__item.active');
    
        const idNote = item.dataset.idNote;
        const idTitle = item.dataset.idTitle;

        let idNoteNewActiveItem;
        let newActiveItem = false;

        if (numberOfItemsBefore >= 2) {
            
            if (item.previousElementSibling) {
                newActiveItem = item.previousElementSibling;
            } else {
                newActiveItem = item.nextElementSibling;
            }

            idNoteNewActiveItem = newActiveItem.dataset.idNote;
            newActiveItem.classList.add('active');
        }

        if (this.isEditModeActive) {
            Notes.hide(true);
        }


        Notes.delete(idNote)
        .then((success)=>{
            return Headers.delete(idTitle);
        })
        .then(()=>{
            
                item.remove();
    
                Notes.hide();

                //если был удалён не последний элемент
                if(newActiveItem) {
                    Notes.getOne(idNoteNewActiveItem, that.secretKey)
                    .then((noteData)=>{
                        Notes.show({
                            'title': noteData.title,
                            'text': noteData.text
                        });

                        window.flash.add('success', 'Success', 'The note was deleted successfully');
                        window.flash.showMessages();
                    })
                } else {
                    if (that.deviceIsMobile) {
                        
                    } else {
                        document.querySelector('.note-editor-block').classList.add('visually-hidden');
                        document.querySelector('.first-message').classList.remove('visually-hidden');
                        this.isNoteSelected = false;
                    }
                }
        })
        .catch((e)=>{
            window.flash.add('error', 'Error', 'Sorry, note not deleted. Try again.');
            window.flash.showMessages();
            console.error(e);
        });
    }

    addButtonClickHandler() {
        if (this.isEditModeActive) {
            window.flash.add('error', 'Title', 'First you need to finish editing');
            window.flash.showMessages();
            return;
        };

        //если клик первый раз, то убираем блок
        if (!this.isNoteSelected) {
            this.isNoteSelected = true;
            this.hidePreviewBlock();
        }

        if (this.deviceIsMobile) {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.add('visually-hidden');
        }

        const that = this;
        const timestamp = Date.now();
        const timestampString = timestamp.toString();
        const date = Helpers.timestampToDate(timestamp);
        
        const jsonNewNote = {
            "title": "New title", 
            "text": ""
        };
        
        // создаем новую заметку
        Notes.create(jsonNewNote, that.secretKey)
        .then(function(newNoteData){ 
            //очищаем редактор
            Notes.hide();

            const jsonNewNote = {
                "title": "New title", 
                "text": ""
            };
            Notes.show(jsonNewNote);

            //создаем новый заголовок
            let jsonNewTitle = {
                "idNote": newNoteData.id,
                "title": "New title", 
                "date": timestampString,
                "author": "Nick"
            };

           
            // window.http.post('/titles', jsonNewTitle, that.secretKey);
            return Headers.create(jsonNewTitle, that.secretKey);
        }).then(function(newTitleData){
            
             //добавляем li
             const list = document.querySelector('.notes');
             const item = that.createItemTitleNote( newTitleData.title, date, newTitleData.idNote, newTitleData.id, true);
            list.appendChild(item);

            if (that.deviceIsMobile) {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.add('visually-hidden');
            }

            window.flash.add('success', 'Title', 'New note created successfully');
            window.flash.showMessages();

        }).catch(function(e) {
            if(document.querySelector('.notes__item.active')){
                const currentActiveItem = document.querySelector('.notes__item.active');
                const currentIdNote = currentActiveItem.dataset.idNote;
                Notes.show(currentIdNote);
            };
            
            window.flash.add('error', 'Title', 'Could not create new note');
            window.flash.showMessages();
            console.error(e);
        });
    }

    editButtonClickHandler() {
        this.onEditMode();
    }

    endEditButtonClickHandler() {
        this.saveNoteFromEditMode()
        .then((noteData)=>{
            const endEditBtn = document.querySelector('#end-edit');
            const saveBtn = document.querySelector('#save');
            const editBtn = document.querySelector('#edit');

            Notes.hide(true);
            Notes.show({
                'title': noteData.title,
                'text': noteData.text
            });

            endEditBtn.style.display = 'none';
            saveBtn.style.display = 'none';
            editBtn.style.display = 'inline-block';

            window.flash.add('success', 'Success', 'Save and exit edit mode was successful');
            window.flash.showMessages();

            this.isEditModeActive = false;
        })
        .catch((e)=>{
            window.flash.add('error', 'Error', 'Sorry, could not exit edit mode. Try again.');
            window.flash.showMessages();
            console.error(e);
        });
    }

    mobileMenuButtonClickHandler(){
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('visually-hidden');
    }

    closeButtonClickHandler(){
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.add('visually-hidden');
    }


    hidePreviewBlock() {
        const noteEditorBlock = document.querySelector('.note-editor-block');
        const previewBlock = document.querySelector('.first-message');
        //const mobilePreviewBlock = document.querySelector('.mobile-message')
        
        noteEditorBlock.classList.remove('visually-hidden');
        previewBlock.classList.add('visually-hidden');

        // if (this.deviceIsMobile) {
        //     mobilePreviewBlock.remove();
        // }
    }

    saveNoteFromEditMode() {
        const that = this;
        const dataNoteFromBlocks = Notes.getDataNoteFromBlocks();
        const activeItem = document.querySelector('.notes__item.active');
        let idNote = activeItem.dataset.idNote;
        let idTitle = activeItem.dataset.idTitle;

        const jsonUpdateNote = {
            "title": dataNoteFromBlocks.title, 
            "text": dataNoteFromBlocks.text,
        };
        const jsonUpdateTitle = {
            "title": dataNoteFromBlocks.title
        };

        return new Promise((resolve, reject) => {
            let noteData;

            Notes.save(idNote, jsonUpdateNote, that.secretKey)            
            .then((noteDataResolve)=>{
                noteData = noteDataResolve;

                return Headers.save(idTitle, jsonUpdateTitle, that.secretKey);
            })
            .then((titleData)=> {
                activeItem.querySelector('.notes__title').textContent = titleData.title;
               
                resolve(noteData);
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

    listNotesClickHandler(e) {
       
        //если клик первый раз, то убираем блок
        if (!this.isNoteSelected) {
            this.isNoteSelected = true;
            this.hidePreviewBlock();
        }

        if (this.deviceIsMobile && this.isNoteSelected) {
            const closeBtn = document.querySelector('#close');
            closeBtn.style.display = 'inline-block';
        }

        if (this.isEditModeActive) {
            window.flash.add('error', 'Title', 'First you need to finish editing');
            window.flash.showMessages();
            return;
        };

        if (this.deviceIsMobile) {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.add('visually-hidden');
        }
        
        const that = this;
        let currentItem;       
        const items = e.currentTarget.children;
        let idNote;
        let dataNote;

        if (e.target.classList.contains('notes__item')) {
            currentItem = e.target;
        } else {
            currentItem = e.target.closest('.notes__item');
        }

        for (let i=0; i<items.length; i++) {
            items[i].classList.remove('active');
        }
       
        currentItem.classList.add('active');
        
        idNote = +currentItem.dataset.idNote;
        
        Notes.getOne(idNote, that.secretKey)
        .then((dataNoteResolve) => {
            dataNote = dataNoteResolve;
            
            Notes.show(dataNote);

        })
        .catch((e) => {
            console.error(e);
        });
    }

     //наполняет noteList в сайдбаре
     fillingListNotes() {
         const that = this;
         return new Promise((resolve, reject)=>{
           
            Headers.getAll(that.secretKey)
            .then((titlesResponse) => {
              
                if(titlesResponse.length == 0){
                    resolve();
                };
                const list = document.querySelector('.notes');
                const fragment = document.createDocumentFragment();
                let item;
                let titles = titlesResponse;
                  
                titles.forEach(function(currentTitle, i) {
                    item = that.createItemTitleNote( currentTitle['title'], 
                                        Helpers.timestampToDate(currentTitle['date']), 
                                        currentTitle['idNote'],
                                        currentTitle['id']
                                    );
                    fragment.appendChild(item);
                });
    
                list.appendChild(fragment);

                resolve();
            })
            .catch((e) => {
                reject(e);
            });
         });
        
    }

     //создает li и заполняет
     createItemTitleNote(title, date, idNote, idTitle, active = false) {
        let item,
            titleNote,
            dateBlock;
        
        item = Helpers.createElem('li', ['notes__item', 'list-group-item', 'list-group-item-action']);

        if(active) {
            const list = document.querySelector('.notes');
            const items = list.children;
            for (let i=0; i<items.length; i++) {
                items[i].classList.remove('active');
            }
            item.classList.add('active');
        }

        titleNote = Helpers.createElem('div', 'notes__title', title);
        dateBlock = Helpers.createElem('div', 'notes__date', date);
        item.dataset['idNote'] = idNote; 
        item.dataset['idTitle'] = idTitle; 
        item.append(titleNote, dateBlock);

        return item;
    }

    onEditMode() {
        const that = this;
        const editBtn = document.querySelector('#edit');
        let titleBlock = document.querySelector('.header__text-title-note');
        let noteTextBlock = document.querySelector('.note__text');
        let saveBtn = document.querySelector('#save');
        let endEditBtn = document.querySelector('#end-edit');
        let inputTitle = document.querySelector('.title-note');
        let editorBlock = document.querySelector('.ck-editor');
        let idNote = document.querySelector('.notes__item.active').dataset.idNote;
        let dataNote;

        this.isEditModeActive = true;

        //скрываем кнопку edit, блок заголовка, блок текста
        editBtn.style.display = 'none';
        titleBlock.style.display = 'none';
        noteTextBlock.style.display = 'none';
        //добавляем заголовок в инпут, текст в редактор
     
        Notes.getOne(idNote, that.secretKey)
        .then((dataNoteResolve) => {
            dataNote = dataNoteResolve;
           
            Notes.show(dataNote, window.editor, true);
        })
        .catch((e) => {
            console.error(e);
        });

        //показываем кнопку save, инпут, редактор
        saveBtn.style.display = 'inline-block';
        endEditBtn.style.display = 'inline-block';
        inputTitle.style.display = 'block';
        editorBlock.style.display = 'block';
    }

}