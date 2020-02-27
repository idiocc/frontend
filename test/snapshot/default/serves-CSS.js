(function __$styleInject(css = '') {
  const head = document.head
  const style = document.createElement('style')
  style.type = 'text/css'
  if (style.styleSheet){
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  head.appendChild(style)
})(`.Image {
  text-align: center;
}`)
export const $Image = 'Image'