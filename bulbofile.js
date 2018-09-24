const bulbo = require('bulbo')
const { asset } = bulbo

const nunjucks = require('gulp-nunjucks-render')
const bundle = require('bundle-through')

const src = 'frontend'

const paths = {
  html: `${src}/*.html`,
  css: `${src}/css/**/*.css`,
  vendor: `${src}/vendor/**/*.*`,
  js: {
    entrypoint: `${src}/index.js`,
    src: `${src}/**/*.js`
  }
}

bulbo.dest('build')
bulbo.base(src)

asset(paths.js.entrypoint)
  .watch(paths.js.src)
  .pipe(bundle({ transform: [['envify', { global: true }], 'babelify'] }))

asset(paths.html).pipe(nunjucks({ basepath: process.env.BASEPATH || '' }))

asset(paths.css)
asset(paths.vendor)
