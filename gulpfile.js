var gulp = require('gulp');  
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();

gulp.task('default', ['dev']);

gulp.task('dev', ['build-dev', 'browser-sync', 'watch']);

gulp.task('build-dev', ['html', 'assets', 'sass', 'scripts']);

/* Scripts task */
gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('docs/'));
});

gulp.task('assets', function() {
    return gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('./docs/'));
});

gulp.task('sass', function() {
    return gulp.src('src/styles/global.scss') 
        .pipe(plumber({ // plumber - плагин для отловли ошибок.
            errorHandler: notify.onError(function(err) { // nofity - представление ошибок в удобном для вас виде.
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('docs/css'));
        //.pipe(reload({stream:true}));
});

gulp.task('scripts', function() {
  return gulp.src(
    /* Add your JS files here, they will be combined in this order */
    'src/scripts/modernizr.js'
    )
    //.pipe(concat('main.js'))
    //.pipe(gulp.dest('js')) /*нужна ли эта строчка?*/
    //.pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    .pipe(gulp.dest('docs/js'));
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
    browserSync.init(['css/*.css', 'js/*.js'], {
        /*
        I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
        
        proxy: 'my_dev_site.url',*/

        /* For a static server you would use this: */        
        server: {
            baseDir: 'docs/'
        }
        
    });
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('watch', function () {
    gulp.watch('src/styles/**/*.scss', ['sass'])
    gulp.watch('src/scripts/**/*.js', ['scripts'])
    gulp.watch('src/**/*.html', ['html'])
    gulp.watch('src/**/*.*', ['bs-reload']);
});