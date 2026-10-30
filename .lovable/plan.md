Replace the browser tab icon with the image you upload.

Steps
- Once you upload the image (SVG or PNG) in the chat, add it as the site icon.
- PNG: shrink it to a square 64x64 icon, adding padding so it doesn't get stretched.
- SVG: use it as is.
- Point the page at the new icon and delete the old default icon so browsers stop showing it.

Technical details
- Copy to public/favicon.svg or public/favicon.png (magick resize/extent for PNG).
- In index.html, add a link rel="icon" tag with the matching type.
- rm public/favicon.ico.
