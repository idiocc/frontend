(function(css = '') {
  let style
  if (window['test-fixture-frontend-style']) {
    style = window['test-fixture-frontend-style']
    style.innerText = ''
  } else {
    style = document.createElement('style')
    style.id = 'test-fixture-frontend-style'
    document.head.appendChild(style)
  }
  style.type = 'text/css'
  if (style.styleSheet){
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
})(`.Image {
  text-align: center;
}`)
export const $Image = 'Image'