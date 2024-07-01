#!/usr/bin/env node

let lib = require('../lib')
let args = process.argv.splice(process.execArgv.length + 2)

if (args.length < 2) {
    console.log('Invalide operation');
    console.log('linepicplus-generate-tshirt logoPath color1[,color2][,color3]...');
} else {
    let logoPath = args[0];
    let colors = args[1];

    lib.generateImage(logoPath, colors);
}

// lib.printBestGuitarPlayer(guitarPlayerName);