const bulbo = require('bulbo')
const { asset } = bulbo

const nunjucks = require('gulp-nunjucks-render')
const bundle = require('bundle-through')

const src = 'frontend'

const paths = {
  index: `${src}/index.html`,
  css: `${src}/css/**/*.css`,
  js: {
    entrypoint: `${src}/index.js`,
    src: `${src}/**/*.js`
  }
}

bulbo.dest('build')
bulbo.base(src)

asset(paths.js.entrypoint)
  .watch(paths.js.src)
  .pipe(bundle({ transform: 'babelify' }))

asset(paths.index).pipe(nunjucks({ basepath: process.env.BASEPATH || '' }))

asset(paths.css)
