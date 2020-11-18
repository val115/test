

var { src, dest, task, watch } = require('gulp'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    fileinclude = require("gulp-file-include"),
    scss = require('gulp-sass'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"), //переименовывает файл
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    uglify_js = require("gulp-uglify-es").default, //чистит и сжимает js
    sourcemaps = require('gulp-sourcemaps'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    group_media = require("gulp-group-css-media-queries"),
    webphtml = require("gulp-webp-html"), //подключение картинки в html автоматом 
    imagemin = require("gulp-imagemin"), //сжимает img файл
    webp = require("gulp-webp"), //формат картинки новый
    fonter = require("gulp-fonter"), //преобразует шрифт в otf2 -> ttf (делаем отдельную задачу)
   
    svgSprite = require("gulp-svg-sprite"); //объединяет несколько иконок SVG-каринок в одн файл (делаем отдельную задачу)
// ---------------------------

var fs = require('fs'); //подключение шрифтов к файлам стилей

var config = {
    src: {
        // html: "./src/*.html",
        html: ["./src/*.html", "!" + "./src/_*.html"],
        less: "./src/less/**/*.less",
        scss: "./src/scss/style.scss",
        sass: "./src/sass/**/*.sass",
        js: "./src/js/**/*.js",
        fonts: "./src/fonts/*.ttf",
        img: "./src/img/**/*.{jpg,png,svg,gif,ico,webp}",
        // spriteLess: "./src/less/fonts.less",
        // spriteSass: "./src/sass/fonts.saa"
    },
    public: {
        path: "./public",
        html: "./public",
        cssName: "style.css",
        jsName: "script.js",
        css: "./public/css",
        fonts: "./public/fonts",
        js: "./public/js",
        img: "./public/img"
    },
    watch: {
        html: "./src/**/*.html",
        less: "./src/less/**/*.less",
        scss: "./src/scss/**/*.scss",
        sass: "./src/sass/**/*.sass",
        js: "./src/js/**/*.js",
        img: "./src/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },

    isDevelop: true
};


// ------------------------------------
task('html', () => {    
    return src(config.src.html)
        .pipe(fileinclude())  // сборка html файлов
        .pipe(webphtml()) //подключение картинки в html автоматом 
        .pipe(gulp.dest(config.public.html))
        .pipe(browserSync.stream())
})

// -----------------------------------
gulp.task("sass", () => {
    gulp.src("./src/sass/*.sass")
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(sass({
            outputStyle: "expanded" //чтобы файл не сжимался а можно читать
        }))
        .pipe(concat(config.public.cssName))
        .pipe(group_media()) //формирует медиа запросы
        .pipe(autoprefixer({
            overrideBrowserlist: ["last 5 versions"], //последние 5 версий браузера
            cascade: true //стиль написания 
        }))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))

        // --------------    
        .pipe(dest(config.public.css)) //вначале выхружаем
        .pipe(gulpIf(config.isDevelop, cleanCss())) //сжимаем 
        .pipe(
            rename({
                extname: ".min.css" //переименоваваем
            })
        )
        .pipe(dest(config.public.css)) //и опять выгружаем
        // -----------
        .pipe(browserSync.stream());

    // done();
});

// -----------------------------------
task("scss", () => {
    gulp.src(config.src.scss)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(scss({
            outputStyle: "expanded" //чтобы файл не сжимался а можно читать
        }))
        .pipe(concat(config.public.cssName))
        .pipe(group_media()) //формирует медиа запросы
        .pipe(autoprefixer({
            overrideBrowserlist: ["last 5 versions"], //последние 5 версий браузера
            cascade: true //стиль написания 
        }))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))

        // --------------    
        .pipe(dest(config.public.css)) //вначале выхружаем
        .pipe(gulpIf(config.isDevelop, cleanCss())) //сжимаем 
        .pipe(
            rename({
                extname: ".min.css" //переименоваваем
            })
        )
        .pipe(dest(config.public.css)) //и опять выгружаем
        // -----------
        .pipe(browserSync.stream());

    // done();
});

// --------------------------------------
// обрабатываем файла less
task('less', () => {
    return src(config.src.less)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(less({
            outputStyle: "expanded"   //чтобы файл не сжимался а можно читать
        }))
        .pipe(concat(config.public.cssName))    //называем выгружаемый файл

        .pipe(group_media()) //формирует медиа запросы
        .pipe(
            autoprefixer({
                overrideBrowserlist: ["last 5 versions"], //последние 5 версий браузера
                cascade: true  //стиль написания 
            }))
            
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
    // --------------    
        .pipe(dest(config.public.css))//вначале выхружаем
        .pipe(gulpIf(config.isDevelop, cleanCss()))   //сжимаем 
        .pipe(
            rename({
                extname: ".min.css" //переименоваваем
            })
        )
        .pipe(dest(config.public.css))//и опять выгружаем
    // -----------
        .pipe(browserSync.stream());
});



// ------------------------------
//  обрабатываем файла js
task('js', () => {  
    return src(config.src.js)
        .pipe(fileinclude())  // сборка js файлов
        .pipe(concat(config.public.jsName)) //называем выгружаемый файл
        
        .pipe(dest(config.public.js)) //вначале выхружаем
        .pipe(uglify_js()) //сжимаем js
        .pipe(
            rename({
                extname: ".min.js" //переименоваваем
            })
        )
        .pipe(dest(config.public.js)) //и опять выгружаем

        .pipe(browserSync.stream());
})

// ------------------------------
task('images', () => {
    return src(config.src.img)
        
        //создаем сжатую картинку с расширением .webp
        //класс  .webp подкючаем с помощю скрипта  см main.js и main.less
        .pipe(
            webp({ //сжимает еще сильнее
                quality: 70
            })
        )
        .pipe(dest(config.public.img))
        .pipe(src(config.src.img))

        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{
                    remuveVieoBox: false
                }],
                interlaced: true, //работа с другими форматами
                optimizationLevel: 3 //0 to 7
            })
        )
        .pipe(dest(config.public.img))

        .pipe(browserSync.stream())
})

// ------------------------------------
//отдельная задача (т.е. вызвать эту задачу самостоятельно) для объединение несколько картинок SVG в один файл (Зачем это надо???)
task('svgSprite',  () => {
    return src([ "./src/iconsprite/*.svg"])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg", //sprite file name
                    example: true //создает файл с примерами иконок
                }
            }
        }))
        .pipe(dest(config.public.img))
});

// ----------------------------
//отдельная задача (т.е. вызвать эту задачу самостоятельно)  для преобразования шрифта в otf2 -> ttf
task('otf2ttf', () => {
    return src("./src/fonts/*.otf")
        .pipe(fonter({
            formats: ['ttf'] //получаем формат
        }))
        .pipe(dest("./src/fonts/")); //выгружаем в эту папку
});

// ================================
// ф-ция для формирования кода подключения шрифтов к файлу стилей
// function fontsStyle() {
task('fontsStyle', (params) => {
    let file_content = fs.readFileSync('src/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile('src' + '/scss/fonts.scss', '', cb);
        return fs.readdir(config.public.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile('src/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
})
//вспомогательная ф-ция для подключения шрифтов к файлу стилей
function cb() {}

// ---------------------------------------
// работа со шрифтами
task('fonts', () => {
    src(config.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(config.public.fonts))
    return src(config.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(config.public.fonts))
})

// --------------------
task('clean', () => {
    return del('public/*')
})

// ---------------------------
task('serve', () => {
    browserSync.init({
        server:
        {
            baseDir: config.public.path + "/" //"./src/"
        },
        port: 3000,
        notify: false
    });

    watch(config.watch.html, gulp.series('html'));
    // watch(config.watch.less, gulp.series('less'));
    watch(config.watch.scss, gulp.series('scss'));
    // watch(config.watch.sass, gulp.series('sass'));
    watch(config.watch.js, gulp.series('js'));
    watch(config.watch.img, gulp.series('images'));
    watch(config.watch.html).on('change', () => {
        browserSync.reload();
        // done();
    });

});
// ----------------------
//Таск вызывающий функцию fontsStyle
// gulp.task('fontsStyle', fontsStyle);
// 
task('default', gulp.series('clean', gulp.parallel('html', 'scss', 'js', 'images', 'fonts', 'serve', 'fontsStyle')));



