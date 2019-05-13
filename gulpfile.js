const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

gulp.task('sass', () => gulp.src('src/scss/!style.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 12 versions'],
    cascade: false,
  }))
  .pipe(gulp.dest('public/stylesheets/')));

gulp.task('sass:watch', () => {
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'))
    .on('error', gulp.series('sass:watch'));
});
