/* eslint-env browser */

export default function(css = '') {
  let style
  if (window['FRONTEND_STYLE_ID']) {
    style = window['FRONTEND_STYLE_ID']
    style.innerText = ''
  } else {
    style = document.createElement('style')
    style.id = 'FRONTEND_STYLE_ID'
    document.head.appendChild(style)
  }
  style.type = 'text/css'
  if (style.styleSheet){
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}