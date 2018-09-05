const bulbo = require("bulbo")
const { asset } = bulbo

const nunjucks = require("gulp-nunjucks-render")

const src = "frontend"

const paths = {
  index: `${src}/index.html`,
  css: `${src}/css/**/*.css`
}

bulbo.dest("build")
bulbo.base(src)

asset(paths.index).pipe(nunjucks({ basepath: process.env.BASEPATH || "" }))

asset(paths.css)
