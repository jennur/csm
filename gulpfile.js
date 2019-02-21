const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const csso = require('gulp-csso');
const sass = require('gulp-sass');
      sass.compiler = require('node-sass');


gulp.task('clean', () => del(['dist']));

gulp.task('imagemin', () =>
    gulp.src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
);


gulp.task('sass', () => 
    gulp.src('./src/stylesheet.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
          }))
        .pipe(csso())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
          }))
);

gulp.task('pages', () => 
    gulp.src(['./src/*.html', './src/**/*.html'])
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.reload({
        stream: true
      }))
  );


gulp.task('minify', ['clean'], () => {
    runSequence(
        'imagemin',
        'sass',
        'pages'
    );
});

gulp.task('serve', ['minify'], () =>
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    }),
    gulp.watch(['./src/stylesheet.scss'] , ['sass']),
    gulp.watch(['./src/*.html', './src/**/*.html'], browserSync.reload)
);

gulp.task('default', ['serve']);