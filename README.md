# bms_rethink
SEARCA's Bidding Management System 

### Requirements
- [NodeJS >= v8.9.4](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/docs/install#mac-tab)
- [Gulp](https://gulpjs.com/)
- [Documentation.js](http://documentation.js.org/)

### Installation
1. Install **git** or [git-scm](https://git-scm.com/download) for windows 
2. Install **yarn**
3.  `$ npm install -g gulp-cli`
4. `$ npm install -g documentation`
5. `$ git clone https://github.com/SEARCAPhil/bms_rethink.git`
6. `$ cd bms_rethink && git checkout develop` - This is the current development branch
7. `$ cd src/`
8. `$ gulp`
9. Open your browser and go to `http://localhost/bms_rethink/www/`

> For connection configuration, please modify `/src/assets/js/config/network/network.config.js`
 
 > To generate the code documentation, please run   
 `$ documentation build src/assets/js/** -o docs -f html --shallow` and open `docs/index.html`. You must be on your root directory before running this command

    
> Do not forget to run `$ gulp` everytime you modify or add a script