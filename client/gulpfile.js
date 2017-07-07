/******************************************************************************
 UNCLASSIFIED
 © 2016 Applied Information Sciences
 See COPYRIGHT.txt for licensing information
 ******************************************************************************/

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    mainBowerFiles = require('main-bower-files'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    gulpFilter = require('gulp-filter'),
    ngAnnotate = require('gulp-ng-annotate'),
    tar = require('gulp-tar'),
    gzip = require('gulp-gzip'),
    gulpNgConfig = require('gulp-ng-config'),
    rename = require('gulp-rename'),
    pkg = require('../package.json'),
    preprocess = require('gulp-preprocess');

var paths = {
        styles: ['./app/less/**/*.less'],
        scripts: ['./app/modules/**/*.js', '!./app/modules/**/*.spec.js'],
        devConfig: ['./config/dev/trackerConfig.local.json'],
        distConfig: ['./config/dist/trackerConfig.local.json'],
        testData: ['./test/**/*.json'],
        html: ['./app/modules/**/*.html'],
        images: ['./app/less/images/**/*'],
        fonts: ['./app/fonts/**/*'],
        stubs: './app/static/backendStubs.js',
        static: './app/static/data/*.json',
        tests: ['./tests/*.js'],
        lib: './app/lib/**/*',
        webworkerDeps: ['./bower_components/lodash/dist/lodash.js', './bower_components/ng-webworker/src/worker_wrapper.js']
    };

// clean
gulp.task('clean', function () {
    return del([
        './build/**/*'
    ]);
});

gulp.task('clean-dist', function () {
    return del([
        './dist/**/*'
    ]);
});

gulp.task('clean-deploy', function () {
    return del([
        './deploy/**/*'
    ]);
});

// start message
gulp.task('start-message', function() {
    const AIS = `
MMMMMMMMMMMMMMMMMMMMMMMd:.-+NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMN+/+NM+    dMo.../mMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMM    hMNs+ohMs     +MMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMdhNNdNMMMMMMMMN/   -dMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMM  sMMMMMMMMMMMMMMmds++smMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM+      +MMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM        NMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMs     'oMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNhsshNMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMNho+:::/oyNMMNssssshMMMMMMssssssMMMMMMMMNho+:::/oymMMM
MMMMy:           /my     hMMMMMm     /MMMMMMm:           .sM
MMm-       .:-'   '.    .MMMMMMo     hMMMMMN.    .+o+:   -sM
Mm'     :hMMMMMm+       oMMMMMM.    'MMMMMMh     mMMMMNsdMMM
M:     sMMMMMMMMMs      dMMMMMm     +MMMMMMm'    ':sdMMMMMMM
m     -MMMMMMMMMMN     -MMMMMMo     mMMMMMMMd-       ':sNMMM
d     +MMMMMMMMMMm     oMMMMMM.    -MMMMMMMMMMd+.        /NM
m     'MMMMMMMMMM:     mMMMMMd     sMMMMMMMMMMMMMNh+-     /M
M/     -dMMMMMMh-     -MMMMMM/     mMMMMMNy:.sMMMMMMM/    .M
MN-      ./+/:'       '++dMMM.     ++sMMh'    '/osso/     +M
MMMo'          -h.       dMMM/       oMMMd/             'oMM
MMMMMho/----/odMMNyo++//oMMMMMds++///mMMMMMNho/:-----/ohNMMM`;
    const NGA = `
:////////////////////////////////:::------::://///////////////////////////////:
'hMMMMMMMMMMMMMMMMMMMMMMMNNmhs+/:-.''''''''''.-:/oshmNNMMMMMMMMMMMMMMMMMMMMMMMd
'hMMMMMMMMMMMMMMMMMMMMmho:.'              ''''''''...:+shNNMMMMMMMMMMMMMMMMMMMd
'hMMMMMMMMMMMMMMMMNdo:'                 '''''''........--:+ymNMMMMMMMMMMMMMMMMd
'hMMMMMMMMMMMMMNdo-'                   '''''''.....-----::://oymNMMMMMMMMMMMMMd
'hMMMMMMMMMMMNh/'                    '''''''.....---:://+++oso+osdNMMMMMMMMMMMd
'hMMMMMMMMMNy:'                      ''''''.....--::/+ossyhhddhyysydNMMMMMMMMMd
'hMMMMMMMNh:'                       ''''''....---:/+oshddmmNNNNmmdhyydNMMMMMMMd
'hMMMMMMm+'                        ''''''.....--:/+oyhmNNNNMMMMNNNmdysymMMMMMMd
'hMMMMMd-           '''''''''''''''''''''....--::/oshmNNNMMMMMMMMNNmdyoodMMMMMd
'hMMMMy. '''.-:/++oso+/::///+//:--.........---::/+shdmNNMMMMMMMMMMNNmhs++hNMMMd
'hMMMh-:+syhdddmmddddhs/::/syydddhys+/::-------:/+oydmNNMMMMMMMMMMNNdhs+//yNMMd
'hMMmhdmNhyo+odmmmmNmmmddshhhmmmmNMNNNdys+/::-:::/+shdmNNMMMMMMMMNNmhso/:::hMMd
'hMd+/+s:.-/+ssdNNNMMMMMMNMMNNdhdmmNNMMMNmhso+/:://+sydmNNNNMNNNNmdhso//:--:dMd
'hN+''-..:ohddhdmNNNNNNNmdmNNNmddmdmmNNMMMNNmhso+///+osyhddmmmmdhyyo+/::--..+Nd
'hh' '''./+sosyyhhdhydmdhhydmdooydNmmmNNMMMMMNNdyo+///++osssyysso++//:---....hd
'y+  '' '.:++o//yysshdddhhNMmyoshdmmmmNNNMMMMMMMNmyo+//////+++///:::---....''+h
'y-  '''/:/yhs+:shhydNmddNNdoshyhhhddmNNNMMMMMMMMMNmy+/::::::::-----......'''-y
's'' ''.-:/+so:/+ohmNNNhshyo++ohyhddmmNNMMMMMMMMMMMMNho/:------........'''''''y
'o''''''':..::::+ymmmh+++oo//+oshddmmmNNMMMMMMMMMMMMMMdo/:--........''''''''''o
'o'.'''''--''.-./osooo//++o/++shhhhdmNNNNNMMMMMMMMMMMMMmo/--...'''''''''''''  o
's'-'''''./.'''::.....-://o++sdmmNmmmmmNMMMMMMMMMMMMMMMMmo:..'''''''''''     'y
'y-'''''''+-/:.-.' ''...-:///+ymNNMNNmmNMMMMMMMMMMMMMMMMMd/-.'''''''         .y
'y+'''..'':.-.      ''.''---::+ydmmdddmmNNNMMMMMMMMMMMMMMMy:.''              +h
'hh'-'.''''.' '        '''''.-:+syssyhdmmmNNNNMMMMMMMMMMMMN+-''             'hd
'hN+ ''''''.'           '' ''.-/+oyydmmmmhdddNMNNNmNMMMMMMMh:.'             /Nd
'hMd.  '.'''     '       ''''''.-:/ydddydysodmNNNmdNNMMMMMMN/.'' .dMd        /d
'hMMh'   ''''-.' ''    '' '''  '''.:osshmy+ohhdmdhshmmdNNNMM+.'           'yMMd
'hMMNy'   ''''     '        ''   ''./ymhNhs+++odysosyhmmNMMMs.'          'sNMMd
'hMMMNy.            '         '   ''.-shdso//++shhsyhNNMMMMMy.          'yNMMMd
'hMMMMMh-            '         ''   '.os+/o--:+syohhymNNNMMMy.         -hMMMMMd
'hMMMMMMm+'           '         '   '-o:'..--.:os+hyoyyyhMMN+'       '+mMMMMMMd
'hMMMMMMMNh:           '         '    --''.''''.--/+oyydmNMm:'      :hNMMMMMMMd
'hMMMMMMMMMNy-'         ''        '' '--'..'''''.-::/yoymNmy.'    -sNMMMMMMMMMd
'hMMMMMMMMMMMNy:'         '        '' '.'.---:'...--+s+ydmh/'  ':yNMMMMMMMMMMMd
'hMMMMMMMMMMMMMNdo-'       '        ''   ''''.--/+ssooodNNs.'-odNMMMMMMMMMMMMMd
'hMMMMMMMMMMMMMMMMNdo:'     '         '   ''  ' '/dd/-syd++odNMMMMMMMMMMMMMMMMd
'hMMMMMMMMMMMMMMMMMMMNmy+:.' '         '       ' .so-:yddmNMMMMMMMMMMMMMMMMMMMd
'hMMMMMMMMMMMMMMMMMMMMMMMNNmhoo:-.'''''''  '''.:/+hdmNNMMMMMMMMMMMMMMMMMMMMMMMd
':++++++++++++++++++++++++++++++///::------::///++++++++++++++++++++++++++++++/
':                   NATIONAL GEOSPATIAL-INTELLIGENCE AGENCY                 +/'
':++++++++++++++++++++++++++++++///::------::///++++++++++++++++++++++++++++++/`;
    console.log(NGA);
    console.log('------------------------------------------------------------------------------');
    console.log('   NAME: ' + pkg.name);
    console.log('VERSION: ' + pkg.version);
    console.log(pkg.description);
    console.log('------------------------------------------------------------------------------');
});

// vendor scripts and css
gulp.task('vendor', ['clean'], function () {
    var jsFilter = gulpFilter('*.js', {restore: true});
    var cssFilter = gulpFilter(['*.css','*.less'], {restore: true});
    var imageFilter = gulpFilter(['*.jpg','*.png'], {restore: true});

    // add 3rd party scripts not installed with bower
    var vendorScripts = mainBowerFiles();
    vendorScripts.push(paths.lib);

    return gulp.src(vendorScripts)
        // js
        .pipe(jsFilter)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/scripts'))
        .pipe(jsFilter.restore)

        // css
        .pipe(cssFilter)
        .pipe(less())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./build/stylesheets'))
        .pipe(cssFilter.restore)

        // images
        .pipe(imageFilter)
        .pipe(gulp.dest('./build/stylesheets/images'))
});

// vendor fonts
gulp.task('vendor-fonts', ['clean'], function () {
    return gulp.src('./bower_components/font-awesome/fonts/**/*.{otf,eot,woff,woff2,svg,ttf}')
        .pipe(gulp.dest('./build/fonts'));
});

// webworker dependencies
gulp.task('vendor-webworker-deps', ['clean'], function () {
    return gulp.src(paths.webworkerDeps)
        .pipe(gulp.dest('./build/scripts/webworkerDeps'));
});

gulp.task('vendor-build', ['vendor', 'vendor-fonts', 'vendor-webworker-deps']);

// app
var appJs = function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({ single_quotes: true }))
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/scripts'));
};
gulp.task('app-js', ['clean'], appJs);
gulp.task('app-js-watch', appJs);

// append backendStubs path to scripts path to pull from static data
var appJsStatic = function () {
    paths.scripts.push(paths.stubs);
    appJs();
};
gulp.task('app-js-static', ['clean'], appJsStatic);
gulp.task('app-js-static-watch', appJsStatic);

var appConfig = function (configPath) {
    return gulp.src(configPath)
        .pipe(gulpNgConfig('tracker.config', {
            wrap: true
        }))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./build/scripts'));
};
gulp.task('app-config', ['clean'], function () {
    return appConfig(paths.devConfig);
});
gulp.task('app-config-dist', ['clean'], function () {
    return appConfig(paths.distConfig);
});

var testData = function () {
    return gulp.src(paths.testData)
        .pipe(gulp.dest('./build/test'));
};
gulp.task('test-data', ['clean'], testData);


var appHtml = function () {
    return gulp.src(paths.html)
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/modules'));
};
gulp.task('app-html', ['clean'], appHtml);
gulp.task('app-html-watch', appHtml);

var appCss = function () {
    return gulp.src('./app/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/stylesheets'));
};
gulp.task('app-css', ['clean'], appCss);
gulp.task('app-css-watch', appCss);

var appImages = function () {
    return gulp.src(paths.images)
        .pipe(gulp.dest('./build/stylesheets/images'));
};
gulp.task('app-images', ['clean'], appImages);

var appFonts = function () {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('./build/fonts'));
};
gulp.task('app-fonts', ['clean'], appFonts);

gulp.task('app-build', ['app-js', 'app-config', 'app-html', 'app-css', 'app-images', 'app-fonts', 'test-data']);
gulp.task('app-build-dist', ['app-js', 'app-config-dist', 'app-html', 'app-css', 'app-images', 'app-fonts', 'test-data']);

var appStatic = function () {
    return gulp.src(paths.static)
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/static/data'));
};
gulp.task('app-static', ['clean'], appStatic);
gulp.task('app-static-watch', appStatic);

gulp.task('app-build-static', ['app-js-static', 'app-config', 'app-html', 'app-css', 'app-images', 'app-fonts', 'app-static', 'test-data']);

// code linting
gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(jshint({ devel: true, debug: true }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// dev server
gulp.task('connect', ['build'], function () {
    connect.server({
        port: 3000,
        root: 'build',
        livereload: true
    });
});
gulp.task('connect-static', ['build-static'], function () {
    connect.server({
        port: 3000,
        root: 'build',
        livereload: true
    });
});

// watch files
gulp.task('watch', ['connect'], function () {
    gulp.watch(paths.html, ['app-html-watch']);
    gulp.watch(paths.scripts, ['lint', 'app-js-watch']);
    gulp.watch(paths.styles, ['app-css-watch']);
});
gulp.task('watch-static', ['connect-static'], function () {
    gulp.watch(paths.html, ['app-html-watch']);
    gulp.watch(paths.scripts, ['lint', 'app-js-static-watch']);
    gulp.watch(paths.styles, ['app-css-watch']);
    gulp.watch(paths.static, ['app-static-watch']);
});

// build
gulp.task('build', ['vendor-build', 'app-build', 'lint'], function () {
    return gulp.src('app/index.html')
        .pipe(preprocess({context: { NODE_ENV: 'development', DEBUG: true}}))
        .pipe(gulp.dest('build'));
});

gulp.task('build-dist', ['vendor-build', 'app-build-dist', 'lint'], function () {
    return gulp.src('app/index.html')
        .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: false}}))
        .pipe(gulp.dest('build'));
});

// use static files
gulp.task('build-static', ['vendor-build', 'app-build-static', 'lint'], function () {
    return gulp.src('app/index.html')
        .pipe(preprocess({context: { NODE_ENV: 'development', DEBUG: true}}))
        .pipe(gulp.dest('build'));
});

// copy build files to dist
gulp.task('dist-copy', ['build-dist', 'clean-dist'], function () {
    return gulp.src('./build/**/*')
        .pipe(gulp.dest('dist'));
});

// uglify dist files
gulp.task('uglify-vendor-js', ['dist-copy'], function () {
    gulp.src('./dist/scripts/vendor.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('uglify-app-js', ['dist-copy'], function () {
    gulp.src('./dist/scripts/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('uglify-app-css', ['dist-copy'], function () {
    gulp.src('./dist/stylesheets/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/stylesheets'));
});

// main dist task
//gulp.task('dist', ['uglify-vendor-js', 'uglify-app-js', 'uglify-app-css']);
gulp.task('dist', ['dist-copy']);

// deploy
gulp.task('deploy', ['dist', 'clean-deploy'], function () {
    return gulp.src('./dist/**/*')
        // use rename to create a 'tracker' directory inside the tar file
        .pipe(rename(function (path) {
            path.dirname = 'tracker/' + path.dirname;
        }))
        .pipe(tar('tracker.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./deploy'));
});

// gulp static task
gulp.task('static', ['start-message', 'watch-static']);

// default gulp task
gulp.task('default', ['start-message', 'watch']);
