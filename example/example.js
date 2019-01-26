/* yarn example/ */
import frontend from '../src'

(async () => {
  const res = await frontend({
    text: 'example',
  })
  console.log(res)
})()