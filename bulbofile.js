const bulbo = require('bulbo')
const { asset } = bulbo

const layout1 = require('layout1')
const nunjucks = require('gulp-nunjucks-render')
const frontmatter = require('gulp-front-matter')
const bundle = require('bundle-through')

const src = 'frontend'

const paths = {
  html: `${src}/*.html`,
  layout: `${src}/layout.njk`,
  css: `${src}/css/**/*.css`,
  vendor: `${src}/vendor/**/*.*`,
  js: {
    entrypoint: `${src}/index.js`,
    src: `${src}/**/*.js`
  }
}

bulbo.dest('build')
bulbo.base(src)
bulbo.port(7010)

asset(paths.js.entrypoint)
  .watch(paths.js.src)
  .pipe(bundle({ transform: [['envify', { global: true }], 'babelify'] }))

asset(paths.html)
  .watch(paths.html, paths.layout)
  .pipe(frontmatter({ property: 'fm' }))
  .pipe(nunjucks({ basepath: process.env.BASEPATH || '' }))
  .pipe(
    layout1.nunjucks(paths.layout, {
      data: { basepath: process.env.BASEPATH || '' }
    })
  )

asset(paths.css)
asset(paths.vendor)
