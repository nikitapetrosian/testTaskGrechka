const { src, dest, parallel, series, watch } = require('gulp');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');
const browserify = require('browserify');
const source  = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');
const glob = require('glob');
const path = require('path');
const browserSync = require('browser-sync').create()

function scripts() {
    let files = glob.sync('./assets/js/*.js');
    return merge(files.map(function(file) {
        return browserify({
            entries: file,
            debug: true
        })
            .transform('babelify', {
                presets: ['@babel/env'],
                plugins: ['@babel/transform-runtime']
            })
            .bundle()
            .pipe(source(path.basename(file, '.js') + ".js"))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(dest('templates/js/'))
            .pipe(browserSync.stream())
    }));
}

exports.scripts = scripts;

function styles() {
    return src('assets/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({ overrideBrowserslist: ['last 15 versions'], grid: true }))
        .pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
        .pipe(dest('templates/css/'))
        .pipe(browserSync.stream())
}

exports.styles = styles;

function images() {
    return src('assets/img/**/*')
        .pipe(newer('templates/img/'))
        .pipe(imagemin())
        .pipe(dest('templates/img/'))
        .pipe(browserSync.stream())
}

exports.images = images;

function cleanimg() {
    return del('templates/img/**/*', { force: true })
}

exports.cleanimg = cleanimg;

function watchFiles() {
    watch("assets/scss/**/*", styles);
    watch("assets/js/**/*", scripts);
    watch("assets/img/**/*", images);
}

function server() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    })
}
exports.watch = parallel(server, watchFiles);

exports.build = series(cleanimg, styles, scripts, images);
