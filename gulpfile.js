var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('src/scss/!style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 12 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/scss/**/*.scss', gulp.series('sass'))
        .on('error', gulp.series('sass:watch'));
});