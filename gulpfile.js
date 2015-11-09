var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var ts = require('gulp-typescript');

var tsProject = ts.createProject({
	noImplicitAny: false,
	target: 'ES5',
	out: 'app.js'
});

gulp.task('sass', function () {
  gulp.src('./src/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task('sass-compressed', function () {
  gulp.src('./src/styles/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(minifyCss({compatibility: ''}))
    .pipe(rename(function (path) {
      path.basename += ".min";
      path.extname = ".css";
    }))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task("dependencies-copy", function() {
  
  var dependencyFiles = [
    "./bower_components/jquery/dist/jquery.js",
    "./bower_components/angular/angular.js",
    "./bower_components/angular-resource/angular-resource.js",
    "./bower_components/angular-cookies/angular-cookies.js",
    "./bower_components/angular-ui-router/release/angular-ui-router.js",
    "./bower_components/angular-local-storage/dist/angular-local-storage.js",
    "./bower_components/angular-translate/angular-translate.js",
    "./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
    "./bower_components/angular-translate-handler-log/angular-translate-handler-log.js",
  ];
  
  gulp.src(dependencyFiles)
    .pipe(concat("dependencies.js"))
    .pipe(gulp.dest('./public/scripts'));
});
 
gulp.task('typescript', function () {

	var tsResult = gulp.src(['./src/scripts/states.ts', './src/scripts/boligfApp.ts', './src/scripts/**/*.ts', './typings/**/*.ts'])
      .pipe(ts(tsProject));

	return tsResult.js.pipe(gulp.dest('./public/scripts'));
});


gulp.task('copy-index', function() {
  
    gulp.src(['./src/index.html', './src/robots.txt'])
      .pipe(gulp.dest('./public'));
});

gulp.task('copy-views', function() {
  
    gulp.src(['./src/scripts/components/**/*.html'], { base: './src/scripts' })
      .pipe(gulp.dest('./public/views'));
});

gulp.task('copy-assets', function() {
  
    gulp.src(['./src/assets/**/*'], { base: './src' })
      .pipe(gulp.dest('./public'));
});

gulp.task('copy-locale', function() {
  
    gulp.src(['./src/assets/locales/*'], { base: './src' })
      .pipe(gulp.dest('./public'));
});


gulp.task('watch-copy-locale', function () {
	gulp.watch('./src/assets/locales/*.json', ['copy-locale']);
});

gulp.task('watch-copy', function () {
	gulp.watch('./src/**/*.html', ['copy-index', 'copy-views']);
});

gulp.task('watch-sass', function() {
	gulp.watch('./src/styles/**/*.scss', [
		'sass',
		'sass-compressed'
	]);
});

gulp.task('watch-ts', function () {
	gulp.watch('./src/scripts/**/*.ts', ['typescript']);
});


gulp.task('copy', ['copy-index', 'copy-views', 'copy-assets', 'copy-locale']);

gulp.task('watch', ['watch-sass', 'watch-ts', 'watch-copy', 'watch-copy-locale']);

gulp.task('default', ['sass', 'sass-compressed', 'typescript', 'copy', 'dependencies-copy']);