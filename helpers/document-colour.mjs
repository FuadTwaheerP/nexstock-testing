// Independent arithmetic for checking rendered document colours, including
// the actual composited background rather than a guessed theme surface.
export function rgba(value) {
  if (value.startsWith('#')) {
    const raw=value.slice(1),hex=raw.length===3?[...raw].map(c=>c+c).join(''):raw;
    if(!/^[a-f\d]{6}$/i.test(hex))throw Error('Unsupported hex colour: '+value);
    return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)).concat(1);
  }
  const numbers=value.match(/[\d.]+/g)?.map(Number);
  if(!numbers||numbers.length<3)throw Error('Unsupported computed colour: '+value);
  return [...numbers.slice(0,3),numbers[3]??1];
}
export function compositeBackground(nearToFar) {
  let result=[255,255,255];
  for(const value of [...nearToFar].reverse()){
    const [r,g,b,a]=rgba(value);result=[r,g,b].map((channel,i)=>channel*a+result[i]*(1-a));
  }
  return result;
}
export function contrastRatio(first,second) {
  const luminance=rgb=>rgb.slice(0,3).map(n=>n/255).map(n=>n<=0.04045?n/12.92:((n+0.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[0.2126,0.7152,0.0722][i],0);
  const a=luminance(Array.isArray(first)?first:rgba(first)),b=luminance(Array.isArray(second)?second:rgba(second));
  return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}
