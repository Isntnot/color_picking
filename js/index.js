
const channels = [
  {slider: "red-slide", counter:"red-number"},
  {slider: "green-slide", counter:"green-number"},
  {slider: "blue-slide", counter:"blue-number"},
]
var output = document.getElementById("color-block");
var complementaryblock = document.getElementById("complementary-block")
var rgb_text = document.getElementById("rgb-text")
function loaddefault() {
  channels.forEach(({ slider, counter }) => {
  let value = localStorage.getItem(slider)
  if (value == null){
    value = 0;
  }
  const s = document.getElementById(slider);
  const c = document.getElementById(counter);
  // Slider → Counter
  s.value = value
  c.value = value
})
 colorchange()
}
function colorchange() {
  const value = channels.map( c => document.getElementById(c.slider).value );
  channels.forEach(c => {
  localStorage.setItem(
    c.slider,
    document.getElementById(c.slider).value
  );
});
  let compl_color = complementarycolor({"red": value[0], "green":value[1],"blue": value[2] })
  let rgb_compl_color = `rgb(${compl_color.red}, ${compl_color.green},${compl_color.blue})` 
  output.style.backgroundColor = rgb_compl_color
  complementaryblock.style.backgroundColor = `rgb(${value.join(',')})`;
  rgb_text.textContent = rgb_compl_color
}
loaddefault()
channels.forEach(({ slider, counter }) => {
  const s = document.getElementById(slider);
  const c = document.getElementById(counter);
  // Slider → Counter
  s.oninput = () => {
    c.value = s.value;
    colorchange();
  };

  // Counter → Slider
  c.oninput = () => {
    s.value = c.value;
    colorchange();
  };
});
// Color convertion functions
function rgb2hsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var c   = max - min;
  var hue;
  var saturation;
  var light = (max + min)/2
  if (c == 0) {
    hue = 0;
    saturation = 0
  } else {
    saturation = c / (1 - Math.abs(2 * light - 1))
    switch(max) {
      case r:
        var segment = (g - b) / c;
        var shift   = 0 / 60;       // R° / (360° / hex sides)
        if (segment < 0) {          // hue > 180, full rotation
          shift = 360 / 60;         // R° / (360° / hex sides)
        }
        hue = segment + shift;
        break;
      case g:
        var segment = (b - r) / c;
        var shift   = 120 / 60;     // G° / (360° / hex sides)
        hue = segment + shift;
        break;
      case b:
        var segment = (r - g) / c;
        var shift   = 240 / 60;     // B° / (360° / hex sides)
        hue = segment + shift;
        break;
    }
  }
  hue = hue * 60
  return {hue, saturation, light}
}
function hsl2rgb(h, s, l) {
  // Normalize hue
  h = ((h % 360) + 360) % 360;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) {
    r = c; g = x;
  } else if (h < 120) {
    r = x; g = c;
  } else if (h < 180) {
    g = c; b = x;
  } else if (h < 240) {
    g = x; b = c;
  } else if (h < 300) {
    r = x; b = c;
  } else {
    r = c; b = x;
  }

  return {
    red:   Math.round((r + m) * 255),
    green: Math.round((g + m) * 255),
    blue:  Math.round((b + m) * 255)
  };
}
function complementarycolor({red, green, blue}){
  const {hue, saturation, light} = rgb2hsl(red, green, blue)
  return hsl2rgb(
    (hue + 180) % 360,
    saturation,
    light
  )
}
