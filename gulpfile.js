const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();

gulp.task('default', plugins.sequence('clean', 'dev'));

gulp.task('production', plugins.sequence('clean', 'build'));

gulp.task('dev', plugins.sequence('build', 'serve', 'watch'));

gulp.task('build', ['pug', 'assets', 'styles', 'scripts']);

gulp.task('pug', function() {
  return gulp.src(['src/*.pug','!src/_*.pug'])
    .pipe(plugins.pug({
      pretty: '\t'
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('assets', function() {
  return gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('./build/'));
});

gulp.task('styles', function() {
  return gulp.src('src/styles/global.scss')
    .pipe(plugins.plumber({ // plumber - плагин для отловли ошибок.
      errorHandler: plugins.notify.onError(function(err) { // nofity - представление ошибок в удобном для вас виде.
        return {
          title: 'Styles',
          message: err.message
        }
      })
    }))
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(plugins.concat('styles.css'))
    .pipe(plugins.cleanCss())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'));
});

gulp.task('scripts', function() {
  return gulp.src(
    /* Add your JS files here, they will be combined in this order */
    'src/scripts/*.js'
  )
    //.pipe(plugins.uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('clean', function() {
  return gulp.src('build/')
    .pipe(plugins.clean());
});

/* Prepare Browser-sync for localhost */
gulp.task('serve', function() {
  browserSync.init(['css/*.css', 'js/*.js'], {
      /* For a static server you would use this: */
    server: {
      baseDir: 'build/'
    }

  });
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('watch', function () {
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/assets/**/*.*', ['assets']);
  gulp.watch('src/**/*.*').on('change', browserSync.reload); //Перезапуск browserSynс
});