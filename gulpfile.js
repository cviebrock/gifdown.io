var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');

var config = {
    bootstrapDir: './node_modules/bootstrap',
    publicDir: './public',
};

gulp.task('default', ['build', 'watch']);

gulp.task('build', ['styles', 'scripts', 'videos']);

gulp.task('styles', function () {
    return gulp.src('resources/styles/main.scss')
        .pipe(sass({
            includePaths: [config.bootstrapDir + '/scss']
        }))
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        //.pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css'))
});

gulp.task('scripts', function () {
    return gulp.src('resources/scripts/**/*')
        .pipe(gulp.dest('public/js'));
});

gulp.task('videos', function () {
    return gulp.src('resources/videos/**/*')
        .pipe(gulp.dest('public/videos'));
});

gulp.task('watch', function () {
    gulp.watch('resources/styles/*.scss', ['styles']);
    gulp.watch('resources/scripts/*.js', ['scripts']);
    gulp.watch('resources/videos/**/*', ['videos']);
    // Other watchers
});
