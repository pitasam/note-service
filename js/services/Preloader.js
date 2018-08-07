import {Helpers} from './Helpers';

export class Preloader {
    constructor(elemIntoInsert, isGlobal = false){
        
        const preloader = Helpers.createElem('div', 'preloader');
        const loader = Helpers.createElem('div', 'loader');
        preloader.append(loader);

        elemIntoInsert.insertBefore(preloader, elemIntoInsert.firstChild);

        this.preloader = preloader;
        this.isGlobalPreloader = isGlobal;

        if(this.isGlobalPreloader){
            this.show();
        }
    }

  show() {
    if(this.isGlobalPreloader){
        this.preloader.style.display = 'block';
    } else {
        return setTimeout(()=>{
            this.preloader.style.display = 'block';
        }, 1000);
    }
  }

  hide(){
    this.preloader.style.display = 'none';

    if(this.isGlobalPreloader){
        const wrapper = document.querySelector('.wrapper');
        wrapper.style.display = 'block';
    }
  }

  showMessage(text){
    this.preloader.querySelector('.loader').style.display = 'none';

    const mesBlock = Helpers.createElem('div', 'preloader__message', text);
    this.preloader.append(mesBlock);
  }

  hideMessage(){
    this.preloader.querySelector('.loader').style.display = 'block';
    this.preloader.querySelector('.preloader__message').style.display = 'none';
  }
}