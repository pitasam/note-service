export class Flash {
    /**
     * Инициализирует сервис сообщений и показывает имеющиеся сообщения
     */
    constructor(){
        this.timeout = 4000;
        try {
            this.template = document.querySelector('#flashTemplate');
            this.notificationPlace =  document.querySelector('.js-notification');
            if(this.template === null){
                throw new Error('Can\'t find notification template');
            }
            if(this.notificationPlace === null){
                throw new Error('Can\'t find place for insert notifications');
            }
            this.messages = this.getDataFromLocalStorage();
            if(this.messages.length > 0){
                this.showMessages();
            }
        } catch (e) {
            console.error('Error in notification service:');
            console.error(e);
        }
    }

    /**
     * Получает все сообщения из хранилища
     *
     * @returns {Array}
     */
    getDataFromLocalStorage(){
        let data = JSON.parse(localStorage.getItem('app_flash'));
        return !data ? [] : data;
    }

    /**
     * Добавляет в массив flash сообщений и в LocalStorage новое сообщение
     *
     * Доступные статусы: error, warning, info, success
     *
     * @param status
     * @param title
     * @param text
     */
    add(status, title, text) {
        let message = {
            "status": status,
            "title": title,
            "text": text
        };
        this.messages.push(message);
        try {
            localStorage.setItem('app_flash', JSON.stringify(this.messages));
        } catch (e) {
            console.error('Error in notification service:');
            console.error(e);
        }
    }

    /**
     * Показывает сообщения из хранилища, и запускает очистку хранилища.
     */
    showMessages(){
        this.messages.forEach((i)=>{
            let node = this.template.content.cloneNode(true);
            let id = + new Date();
            node.querySelector('.js-flash-text').innerHTML = i['text'];
            node.querySelector('.js-flash-item').setAttribute('flash-id', ''+id);
            node.querySelector('.js-flash-item').classList.add(i['status']);
            this.notificationPlace.appendChild(node);
            setTimeout(()=>{
                node =  this.notificationPlace.querySelector('[flash-id="'+id+'"]');
                if(node){
                    this.notificationPlace.removeChild(node);
                }
            }, this.timeout);
        });
        this.clearData();
    }

    /**
     * Очищает массив flash сообщений и удаляет их из LocalStorage
     */
    clearData(){
        this.messages = [];
        try {
            localStorage.removeItem('app_flash');
        } catch (e) {
            console.error('Error in notification service:');
            console.error(e);
        }
    }

}