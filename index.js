
const channels = [
  {slider: "red-slide", counter:"red-number"},
  {slider: "green-slide", counter:"green-number"},
  {slider: "blue-slide", counter:"blue-number"},
]
var output = document.getElementById("color-block");

function colorchange() {
  const value = channels.map( c => document.getElementById(c.slider).value );
  
  output.style.backgroundColor = `rgb(${value.join(',')})`;
}
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