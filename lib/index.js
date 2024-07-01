const { distort } = require('@alxcube/lens');
const { Adapter } = require('@alxcube/lens-jimp');
const color = require('color');
const Jimp = require('jimp');
const Spinnies = require('spinnies');

log = console.log;

let defaultColors = [
  {
    name: "Black",
    value: "#000000"
  },{
    name: "White",
    value: "#FFFFFF"
  },{
    name: "Pink",
    value: "#E600FF"
  },{
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

const processImage = async(logo, colors) => {
  try {
    const logoImg = await Jimp.read(logo);
    logoImg.resize(300, 500);
    // const srcImg = await data.getBase64Async(Jimp.MIME_PNG);
    for (let idx = 0; idx < colors.length; idx ++) {
      const c = colors[idx];
      const colour = color(c);
      // const img = new Jimp.read(srcImg);
      const img = await Jimp.read('https://i.postimg.cc/rsfjt5bj/sample.png');
      img.resize(1000, 1000);
      img.color([
        {apply: "mix", params: [{r: colour.red(), g: colour.green(), b: colour.blue(), a: 1}, 60]},
      ]);
      img.blit(logoImg, 340, 250);
      const output = `output_${idx}.png`;
      await img.writeAsync(output);
      const adapter = await Adapter.createFromFile(output);
      const result = await distort(adapter, "Affine", 
        [
          0, 0, 378, 80,
          0, 1000, -50, 600,
          1000, 0, 1300, 300,
          1000, 1000, 553, 1100
        ]
      );
      const angle = result.image.getResource();
      await angle.writeAsync(`output_${idx}.0.png`);
    }
    return null;
  } catch (e) {
    return e;
  }
}

const generateImage = async (logo, colors) => {
  const spinner = new Spinnies();
  spinner.add('spinner', {text: 'Initializing'});
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
    spinner.fail('spinner', {text: `Operation failed`});
    return;
  }
  spinner.update('spinner', {text: 'Processing Images'});
  const result = await processImage(logo, colorValue);
  if (!!result){
    spinner.fail('spinner', {text: `${result}`});
  } else {
    spinner.succeed('spinner', {text: `${colorValue.length} images generated`});
  }
}

exports.generateImage = generateImage;