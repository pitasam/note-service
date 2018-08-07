export class Helpers {
    //переводит время из timestamp в дату формата ДД.ММ.ГГГГ
    static timestampToDate(timestamp) {
        let d = new Date();
        d.setTime(timestamp);
        return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
    }

    //создает элемент с заданным классом и текстом
    static createElem(tag, className = false, text = false) {
        let elem = document.createElement(tag);

        if (typeof className === 'string') {
            elem.classList.add(className);
        } else if(Array.isArray(className)) {
            className.forEach((className) => {
                elem.classList.add(className);
            });        
        } 

        if(text) {
            elem.textContent = text;
        }

        return elem;
    }

    static waiter(func){
        return new Promise((resolve, reject)=>{
            let timerId = setInterval(function() {
                console.log(func());
                let result = func();
                if(result) {
                    console.log(result);
                    clearInterval(timerId);
                    resolve();
                }
            }, 100);

            setTimeout(function(){
                clearInterval(timerId);
                reject(new Error('Waiting too long'));
            }, 15000);

        });
        
    }
}