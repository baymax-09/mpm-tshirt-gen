const sharp = require('sharp');
const fs = require('fs');
const convert = require('color-convert');
const color = require('color');
const Jimp = require('jimp');

log = console.log;

let defaultColors = [
    {
        name: "Black",
        value: "#000000"
    },
    {
        name: "White",
        value: "#FFFFFF"
    },
    {
        name: "Pink",
        value: "#E600FF"
    },
    {
        name: "Red",
        value: "#FF0000"
    }
]

let getColorValue = function(color) {
    const found = defaultColors.find((e) => e.name === color);
    if (!!found) {
        return found.value;
    }
    let regExp = /^#[0-9A-F]{6}$/i;
    if (regExp.test(color)) {
        return color;
    }
    return undefined;
}

const generateImage = async (logo, colors) => {
  let colorV = colors.split(',');
  let colorValue = [];
  colorV.map((c) => {
    let value = getColorValue(c);
    if (!!value) {
        colorValue.push(value);
    }
  });
  if (colorValue.length === 0) {
    log('Color values are not valid');
    log('Colors should be: Black, White, Red, Pink');
    log("Or '#12f33f' or so");
    return;
  }
  colorValue.map(async (c) => {
    const tmp = `tmp_${c}`;
    const colour = color(c);
    const lch = convert.rgb.lch(colour.red(), colour.green(), colour.blue());
    Jimp.read('assets/tshirt.png')
        .then(async (img) => {
            img.resize(1000, 1000)
                .color([
                    {apply: "tint", params: [60]}
                ])
                .write(tmp);
            // await sharp(tmp)
            //     .composite([
            //         { input: logo }
            //     ]).toFile(`output_${c}.png`);
            // fs.unlink(tmp, (err) => {
            //     if (err) {
            //         console.error(err);
            //     }
            // });
        });
    
    // await sharp('assets/tshirt.png').resize(1000, 1000, {
    //   fit: 'contain'
    // })
    // .toColourspace("lch")
    // .tint(lch).toFile(tmp);
  })
//   if(guitarPlayer === bestGuitarPlayer) {
//     log(`Best guitar player is ${guitarPlayer}`)
//   } else {
//     log(`Really? I guess ${bestGuitarPlayer} is much more better than ${guitarPlayer}`)
//   }
}

exports.generateImage = generateImage;