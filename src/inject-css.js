/* eslint-env browser */

export default function(css = '') {
  let style
  if (window['FRONTEND-STYLE-ID']) {
    style = window['FRONTEND-STYLE-ID']
    style.innerText = ''
  } else {
    style = document.createElement('style')
    style.id = 'FRONTEND-STYLE-ID'
    document.head.appendChild(style)
  }
  style.type = 'text/css'
  if (style.styleSheet){
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}