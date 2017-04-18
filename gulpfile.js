'use strict'

const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const del = require('del')
const Q = require('q')

const config = {
  srcDir: './src',
  bowerDir: 'bower_components',
  sassPattern: 'sass/**/*.scss',
  jsPattern: 'js/**/*.js',
  production: !!plugins.util.env.production,
  sourceMaps: !plugins.util.env.production
}

const app = {}

app.addStyle = function (paths, filename) {
  return gulp.src(paths)
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError("Error: <%= error.message %>")}))
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.concat('css/'+filename))
    .pipe(plugins.if(config.production, plugins.cleanCss()))
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest('./web'))
    .pipe(plugins.notify())
}

app.addScript = function (paths, filename) {
  return gulp.src(paths)
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError("Error: <%= error.message %>")}))
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
    .pipe(plugins.concat('js/'+filename))
    .pipe(plugins.if(config.production, plugins.uglify(), plugins.beautify()))
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest('./web'))
    // .pipe(plugins.jshint())
    // .pipe(plugins.jshint.reporter(plugins.stylish))
    .pipe(plugins.notify())
}

app.copy = function (srcFiles, outputDir) {
  return gulp.src(srcFiles)
    .pipe(gulp.dest(outputDir))
    .pipe(plugins.notify())
}

gulp.task('styles', function () {
  return app.addStyle([
    config.bowerDir+'/bootstrap/dist/css/bootstrap.css',
    config.bowerDir+'/bootstrap/dist/css/bootstrap-theme.css',
    config.bowerDir+'/owl.carousel/dist/assets/owl.carousel.css',
    config.bowerDir+'/owl.carousel/dist/assets/owl.theme.default.css',
    config.srcDir+'/sass/styles.scss'
  ], 'main.css')
})

gulp.task('scripts', function () {
  app.addScript([
    config.srcDir+'/js/images-carousel.react.js'
  ], 'images-carousel.js')

  app.addScript([
    config.bowerDir+'/jquery/dist/jquery.js',
    config.bowerDir+'/bootstrap/dist/js/bootstrap.js',
    config.bowerDir+'/react/react.js',
    config.bowerDir+'/react/react-dom.js',
    config.bowerDir+'/babel/browser.js',
    config.bowerDir+'/owl.carousel/dist/owl.carousel.js'
  ], 'main.js')
})

gulp.task('fonts', function () {
  return app.copy(config.bowerDir+'/bootstrap/dist/fonts/*', './web/fonts')
})

gulp.task('images', function () {
  app.copy(config.srcDir+'/images/*', './web/images')
  app.copy(config.bowerDir+'/owl.carousel/dist/assets/*.{gif,png}', './web/css')
})

gulp.task('clean', function () {
  return del.sync([
    './web/css/*',
    './web/js/*',
    './web/fonts/*',
    './web/images/logo.jpg'
  ])
})

gulp.task('all', ['clean', 'styles', 'scripts', 'fonts', 'images'])

gulp.task('watch', function () {
  gulp.watch(config.srcDir+'/'+config.sassPattern, ['styles'])
  gulp.watch(config.srcDir+'/'+config.jsPattern, ['scripts'])
})

gulp.task('default', ['all', 'watch'])
