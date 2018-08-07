
import {Http} from './services/HttpService';
import {Flash} from './services/FlashService';
import {App} from './modules/App';

import './crypto-js/crypto-js';

window.http = new Http('http://localhost:3000');
window.flash = new Flash();

window.app = new App();
window.app.run();