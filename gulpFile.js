"use strict";

var gulp     = require('gulp'),
   sass      = require('gulp-sass'),
   uglify  = require('gulp-uglify'),
    gutil = require('gulp-util');


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
   gulp.watch(['src/scss/*.scss','index.html','src/js/app.js'], ['sass','copyJs','compress']);

});

//below is the compress task for Javascript
gulp.task('compress', function() {
  return gulp.src('src/js/app.js')
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('dist/js/'));
});

//task
gulp.task('dev', ['sass','copyJs','compress', 'watch']);