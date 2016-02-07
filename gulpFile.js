"use strict";

var gulp   = require('gulp'),
    sass   =  require('gulp-sass');


//sass compile
gulp.task('sass', function(){
    return gulp.src('src/scss/style.scss')
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest('dist/css'));
});

gulp.task('watch',function(){
   //watch sass files
   gulp.watch('src/scss/*.scss', ['sass']);
   
});

//task
gulp.task('default',['sass', 'watch']);