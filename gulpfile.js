var gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload');

gulp.task('styles', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass({style: 'expanded'}))
    .pipe(gulp.dest('public/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src(['bower_components/jquery/dist/jquery.js',
                  'bower_components/handlebars/handlebars.js',
                  'bower_components/ember/ember.js',
                  'src/js/libs/ember-data-1.0.0-beta.9.js',
                  'src/js/main.js'
                  ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(notify({message: 'Scripts done'}));
});

gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/sass/**/*.scss', ['styles']);
});