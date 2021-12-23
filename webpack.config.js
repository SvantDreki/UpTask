const path = require('path');
const webpack = require('webpack');

module.exports = {
    //archivo que vamos a utilizar con webpack
    entry : './public/js/app.js',
    //donde se guardaran las acciones hechas en el app.js
    output : {
        //nombre del archivo
        filename : 'bundle.js',
        //la carpeta donde se guardara
        path : path.join(__dirname, './public/dist')
    },
    module : {
        rules : [
            {
                //va a probar todos los archivos .js del entry
                test : /\.m?js$/,
                //los plugins que queremos utilizar
                use : {
                    //nombre del plugin
                    loader : 'babel-loader',
                    options : {
                        presets : ['@babel/preset-env']
                    }
                }
            }
            
        ]
    }
}