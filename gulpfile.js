var gulp = require('gulp');
var merge = require('merge-stream');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var critical = require('critical');

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})


// Watchers
gulp.task('watch', function() {
  gulp.watch('app/css/**/*.css', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

// Optimization Tasks 
// ------------------
// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  return gulp.src('app/**/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist/'));
});
gulp.task('copy', function() {
   gulp.src('app/js/**/*.js')
   .pipe(gulp.dest('dist/js'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/img'))
});



// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['browserSync'], ['useref', 'copy', 'images',], 'watch',
    callback
  )
})

gulp.task('critical', function (cb) {
    critical.generate({
        inline: true,
        base: 'dist/',
        src: 'index.html',
        dest: 'index.html',
        minify: true,
        width: 320,
        height: 480
    });
});

gulp.task('build', function(callback) {
  runSequence(
    ['useref', 'critical', 'copy', 'images',],
    callback
  )
})