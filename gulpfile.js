// Defining requirements
const {
    src,
    dest,
    task,
    watch,
    series,
    parallel,
    lastRun
} = require('gulp'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    postcssImport = require('postcss-easy-import'),
    rename = require('gulp-rename'),
    cssnano = require('cssnano'),
    imagemin = require('gulp-imagemin'),
    iconfont = require('gulp-iconfont'),
    iconfontcss = require('gulp-iconfont-css'),
    pug = require('gulp-pug'),
    notify = require("gulp-notify");


// Configuration file to keep your code DRY
var cfg = require('./gulpconfig.json');
var paths = cfg.paths;

// task for compiling html files
function html() {
    return src(paths.pugSrc + '*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest(paths.pugDest))
        .pipe(browserSync.stream())
        .pipe(notify("Html task completed!"))

}

// task for compiling scss files
sass.compiler = require('node-sass');
var sassIncludePaths = [
    paths.node + cfg.sassInclude.normalize,
    paths.node + cfg.sassInclude.animate,
]

function scss() {
    return src(paths.scssSrc + '/*.scss', {
            since: lastRun(imgminify)
        })
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.cssDest))
        .pipe(browserSync.stream())
        .pipe(notify({
            message: "Scss task completed!",
            onLast: true
        }))
}

// task for compiling postcss files
function css(done) {

    done();
}

// task for minify css
function cssmini() {
    return src(paths.cssDest + 'style.css', {
            allowEmpty: true
        })
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(postcss([cssnano]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.cssDest))
        .pipe(notify({
            message: "Cssmini task completed!",
            onLast: true
        }))
}

// task for compiling javascript
function js(done) {

    done();
}

// task for minify images
function imgminify() {
    return src(paths.imgSrc + '*', {
            since: lastRun(imgminify)
        })
        .pipe(imagemin())
        .pipe(dest(paths.imgDest))
        .pipe(notify({
            message: "Imageminify task completed!",
            onLast: true
        }))
}

// task for generate css & font from svg
function fontcss() {
    const fontName = 'evil-icons'
    return src(paths.fontSrc + '/**/*.svg', {
            since: lastRun(fontcss)
        })
        .pipe(iconfontcss({
            fontName: fontName,
        }))
        .pipe(iconfont({
            fontName: fontName
        }))
        .pipe(dest(paths.fontDest))
        .pipe(notify({
            message: "Fontcss task completed!",
            onLast: true
        }))
}

// Starts watcher.
function watchfiles() {
    watch(paths.scssSrc + '**/*.scss', scss);
    watch(paths.pugSrc + '**/*.pug', html);
}

// Starts browser-sync task for starting the server.
function bs() {
    browserSync.use({
        plugin: function () {
            /* noop */
        },
        hooks: {
            'client:js': require("fs").readFileSync("./closer.js", "utf-8")
        }
    });
    browserSync.init(cfg.bsOptionsLocal);
}

exports.html = html;
exports.scss = scss;
exports.css = css;
exports.cssmini = cssmini;
exports.js = js;
exports.imgminify = imgminify;
exports.fontcss = fontcss;

// starts server & watch files
exports.serve = parallel(bs, watchfiles);

// default gulp task
exports.default = series(html, scss, css, cssmini, js, imgminify, fontcss);

// task for cleaning dist folder
var del = require('del');

function clean(cb) {
    del(['dist/*']);
    cb();
}
exports.clean = clean