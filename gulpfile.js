var gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  declare = require('gulp-declare'),
  wrap = require('gulp-wrap'),
  handlebars = require('gulp-handlebars');

gulp.task('styles', function() {
  return gulp.src(['src/sass/**/*.scss'])
    .pipe(sass({style: 'expanded'}))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('public/css'))
});

gulp.task('scripts', function() {
  return gulp.src(['bower_components/jquery/dist/jquery.js',
                  'bower_components/handlebars/handlebars.js',
                  'bower_components/ember/ember.js',
                  'src/js/libs/ember-data-1.0.0-beta.9.js',
                  'src/js/templates.js',
                  'src/js/main.js',
                  'src/js/routes.js',
                  'src/js/models.js',
                  'src/js/views.js',
                  'src/js/controllers.js'
                  ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js'))
});

gulp.task('templates', function() {
  gulp.src('src/templates/**/*.hbs')
    .pipe(handlebars({
      handlebars: require('ember-handlebars')
    }))
    .pipe(wrap('Ember.Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Ember.TEMPLATES',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('src/js/'));
});

gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/sass/**/*.scss', ['styles']);
  gulp.watch('src/templates/*.hbs', ['templates']);
});