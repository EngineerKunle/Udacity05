"use strict";

var gulp = require('gulp'),
   sass = require('gulp-sass');


//sass compile
gulp.task('sass', function () {
   return gulp.src('src/scss/style.scss')
      .pipe(sass({
         outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(gulp.dest('dist/css'));
});

//here is the copy task
gulp.task('copyJs', function () {
   return gulp.src(['src/libs/*.js'])
      .pipe(gulp.dest('dist/libs/'));
});

//here is the watch task

gulp.task('watch', function () {
   //watch sass files
   gulp.watch('src/scss/*.scss', ['sass']);

});

//task
gulp.task('default', ['sass','copyJS', 'watch']);