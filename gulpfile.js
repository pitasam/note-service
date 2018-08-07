const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const sass = require("gulp-sass");
const svgmin = require("gulp-svgmin");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");
const svgSprite = require("gulp-svg-sprite");
const CssImporter = require('node-sass-css-importer')({
    import_paths: ['app/assets/stylesheets', 'app/assets/components']
});

gulp.task('html', function() {
    return gulp.src('./*.html')
        .pipe(gulp.dest('./dest'))
});

gulp.task('js', () => {
    gulp.src('./js/**/*.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./dest/js'));
});

gulp.task('js:watch', function () {
    gulp.watch('./js/**/*.js', ['js']);
});

gulp.task('sass', function () {
    return gulp.src('./scss/main.scss')
        .pipe(sass({
            importer: [CssImporter],
            outputStyle: 'expanded',
            includePaths: ['node_modules/']
        }).on('error', sass.logError))
        .pipe(gulp.dest('./dest/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./scss/**/*.scss', ['sass']);
});

gulp.task('default', ['html', 'sass', 'sass:watch', 'js', 'js:watch']);