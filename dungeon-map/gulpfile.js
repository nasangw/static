// 'use strict';

const 
pkg = require('./package.json'),
gulp = require('gulp'),
sass = require('gulp-sass'),
cleanCSS = require('gulp-clean-css'),
watch = require('gulp-watch'),
sourcemaps = require('gulp-sourcemaps'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
zip = require('gulp-zip'),
babel = require('gulp-babel'),
webpack = require('webpack'),
webpackStream = require('webpack-stream'),
webpackConfig = require('./webpack.config.welcome'),
runSequence = require('run-sequence').use(gulp),
ftp = require('vinyl-ftp');

const source = {
    sass: './_src/sass/**/*.scss',
    cssDist: './_dist/css/**/*',
    js: {
        welcome_2018: './_src/js/service/welcome_2018/**/*.js',
    }
}
const dest = {
    sass: '_dist/css',
    js: '_dist/js',
    ftp: {
        css: '/lineage2_v2/common/css/',
        service: '/lineage2_v2/service',
    }
}

gulp.task('build:js-welcome_2018', function() {
    return gulp.src(source.js.welcome_2018)
        .pipe(sourcemaps.init())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(dest.js));
});

gulp.task('watch:sass', function(cb) {
    return gulp.src(source.sass)
        .pipe(watch(source.sass, function(file) {
            var filePath = file.history.toString();
            var fileName = filePath.split('sass')[1];

            console.log(`\nEdited file - ${fileName}`);
            console.log(`Edited time - ${file.stat.mtime}`);
            // console.log(file.stat);
        }))
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        // .pipe(gulp.dest(dest.sass))
        .pipe(ftp.create(ftpConfig).dest(dest.ftp.css));
});

gulp.task('build:sass', function(){
    return gulp.src(source.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest.sass))
});

gulp.task('build-min:sass', function() {
    return gulp.src(source.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            compatibility: 'ie10'
        }))
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dest.sass))
});

gulp.task('compress', function() {
    gulp.src(source.cssDist)
        .pipe(zip('release-css.zip'))
        .pipe(gulp.dest('./'))
});

gulp.task('release-css', function() {
    runSequence('build:sass', 'build-min:sass', 'compress');
});

gulp.task('default', ['watch:sass']);