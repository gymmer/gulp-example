'use strict';

const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

// 获取命令行使用的参数
// 开发环境：gulp [-d | --development]
// 生产环境：gulp [-p | --production]
// 不指定参数时，默认开发环境
var isDev = true;  
var isPro = false;
for (var i in process.argv) {
    if (process.argv[i] === "-d" || process.argv[i] === "--development") {
        isDev = true;
        isPro = false;
        break;
    }
    if (process.argv[i] === "-p" || process.argv[i] === "--production") {
        isDev = false;
        isPro = true;
        break;
    }
}

// 定义一些文件及目录
const ROOT_PATH = path.resolve(__dirname);						// 根路径
const SRC_PATH  = path.resolve(ROOT_PATH, 'src');				// 源文件
const DEV_PATH  = path.resolve(ROOT_PATH, 'dist');				// 开发环境
const PRO_PATH  = path.resolve(ROOT_PATH, 'build');				// 生成环境
const OUT_PATH  = isDev ? DEV_PATH : PRO_PATH;					// 构建路径

const JS_DIR    = 'js';
const CSS_DIR   = 'css';
const LESS_DIR  = 'less';
const SASS_DIR  = 'sass';
const HTML_DIR  = '';
const IMG_DIR   = 'img';
const FONT_DIR  = 'css/fonts';
const TEMP_DIR  = 'temp';

// 源文件路径中的各文件
const SRC_ALL_FILES  = path.resolve(SRC_PATH, '**/*');
const SRC_JS_FILES   = path.resolve(SRC_PATH, JS_DIR,   '**/*.js');
const SRC_CSS_FILES  = path.resolve(SRC_PATH, CSS_DIR,  '**/*.css');
const SRC_LESS_FILES = path.resolve(SRC_PATH, LESS_DIR, '**/*.less');
const SRC_SASS_FILES = path.resolve(SRC_PATH, SASS_DIR, '**/*.{sass,scss}');
const SRC_HTML_FILES = path.resolve(SRC_PATH, HTML_DIR, '**/*.html');
const SRC_IMG_FILES  = path.resolve(SRC_PATH, IMG_DIR,  '**/*.{png,jpg,gif,jpeg,svg}');
const SRC_FONT_FILES = path.resolve(SRC_PATH, FONT_DIR, '**/*.{eot,ttf,woff,woff2,otf}');

// 构建路径中的各文件
const OUT_JS_DIR    = path.resolve(OUT_PATH, JS_DIR);
const OUT_CSS_DIR   = path.resolve(OUT_PATH, CSS_DIR);
const OUT_LESS_DIR  = path.resolve(OUT_PATH, LESS_DIR);
const OUT_SASS_DIR  = path.resolve(OUT_PATH, SASS_DIR);
const OUT_HTML_DIR  = path.resolve(OUT_PATH, HTML_DIR);
const OUT_IMG_DIR   = path.resolve(OUT_PATH, IMG_DIR);
const OUT_FONT_DIR  = path.resolve(OUT_PATH, FONT_DIR);
const OUT_TEPM_DIR  = path.resolve(OUT_PATH, TEMP_DIR);
const OUT_REV_FILES = path.resolve(OUT_PATH, TEMP_DIR, '**/*.json');

// 是否使用compass
const USE_SASS_COMPASS = true;

// 清除构建路径
gulp.task('clean', function() {

	return gulp.src(OUT_PATH)
		.pipe($.clean());

});

// JavaScript代码校验。
// 开发环境：jshint
// 生产环境：null
gulp.task('jslint', function() {

	if (isDev) {
		return gulp.src(SRC_JS_FILES)
			.pipe($.jshint())
			.pipe($.jshint.reporter());
	}

});

// 处理JavaScript文件
// 开发环境：sourcemap -> babel -> dest -> reload
// 生产环境：babel -> md5 -> dest
gulp.task('js', function() {

	// Babel配置。转译JavaScript
	let babelConfig = {
		presets: ['latest']
	};

	// 开发环境
	if (isDev) {
		return gulp.src(SRC_JS_FILES)
			.pipe($.sourcemaps.init())										// 初始化soucemap
			.pipe($.babel(babelConfig))										// Babel转换
			.pipe($.sourcemaps.write('.'))									// 保存sourcemap
			.pipe(gulp.dest(OUT_JS_DIR))									// 保存JS文件
			.pipe($.connect.reload());										// 浏览器热更新
	}

	// 生产环境
	if (isPro) {
		return gulp.src(SRC_JS_FILES)
			.pipe($.babel(babelConfig))										// Babel转换
			.pipe($.uglify())												// JS压缩
			.pipe($.rev())													// 添加MD5
			.pipe(gulp.dest(OUT_JS_DIR))									// 保存JS文件
			.pipe($.rev.manifest())											// 生成MD5映射
	        .pipe(gulp.dest(path.resolve(OUT_TEPM_DIR, JS_DIR)));			// 保存映射
	}

});

// 处理CSS文件
// 开发环境：dest -> reload
// 生产环境：minify -> md5 -> dest
gulp.task('css', function() {

	// 开发环境
	if (isDev) {
		return gulp.src(SRC_CSS_FILES)
			.pipe(gulp.dest(OUT_CSS_DIR))									// 保存CSS文件
			.pipe($.connect.reload());										// 浏览器热更新
	}

	// 生产环境
	if (isPro) {
		return gulp.src(SRC_CSS_FILES)
			.pipe($.cleanCss())												// CSS压缩
			.pipe($.rev())													// 添加MD5
			.pipe(gulp.dest(OUT_CSS_DIR))									// 保存CSS文件
			.pipe($.rev.manifest())											// 生成MD5映射
	        .pipe(gulp.dest(path.resolve(OUT_TEPM_DIR, CSS_DIR)));			// 保存映射
	}

});

// 处理Less文件
// 开发环境：plumber -> sourcemap -> less -> dest -> reload
// 生产环境：plumber -> less -> minify -> md5 -> dest
gulp.task('less', function() {

	// plumber配置。防止编译出错，自动退出watch
	let plumberConfig = {
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	};

	// 开发环境
	if (isDev) {
		return gulp.src(SRC_LESS_FILES)
			.pipe($.plumber(plumberConfig)) 								// 防止自动退出watch
			.pipe($.sourcemaps.init())										// 初始化soucemap
			.pipe($.less())													// 编译Less
			.pipe($.sourcemaps.write('.'))									// 保存sourcemap
			.pipe(gulp.dest(OUT_CSS_DIR))									// 保存CSS文件
			.pipe($.connect.reload());										// 浏览器热更新
	}

	// 生产环境
	if (isPro) {
		return gulp.src(SRC_LESS_FILES)
			.pipe($.plumber(plumberConfig)) 								// 防止自动退出watch
			.pipe($.less())													// 编译Less
			.pipe($.cleanCss())												// CSS压缩 
			.pipe($.rev())													// 添加MD5
			.pipe(gulp.dest(OUT_CSS_DIR))									// 保存CSS文件
			.pipe($.rev.manifest())											// 生成MD5映射
	        .pipe(gulp.dest(path.resolve(OUT_TEPM_DIR, LESS_DIR)));			// 保存映射
	}

});

// 处理Sass文件
// 开发环境：plumber -> sourcemap -> sass/compass -> dest -> reload
// 生产环境：plumber -> sass/compass -> minify -> md5 -> dest
gulp.task('sass', function() {

	// plumber配置。防止编译出错，自动退出watch
	let plumberConfig = {
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	};

	// sass插件配置
	// Sass 风格：nested  (默认)  |  expanded  |  compact  |  compressed
	let sassConfig = {
		outputStyle: 'expanded'
	};

	// compass插件配置
	let compassConfig = {
		css: isDev ? OUT_CSS_DIR : OUT_TEPM_DIR,
		sass: path.resolve(SRC_PATH,  SASS_DIR),
		image: path.resolve(SRC_PATH, IMG_DIR),
		style: 'expanded',
		sourcemap: isDev
	};

	// 开发环境
	if (isDev) {
		return gulp.src(SRC_SASS_FILES)
			.pipe($.plumber(plumberConfig)) 								// 防止自动退出watch
			.pipe($.sourcemaps.init())										// 初始化soucemap
			.pipe($.if(!USE_SASS_COMPASS, $.sass(sassConfig)))				// 如果只使用 sass, 请使用sass插件
			.pipe($.if( USE_SASS_COMPASS, $.compass(compassConfig)))		// 如果使用 compass, 请使用compass插件
			.pipe($.sourcemaps.write('.'))									// 保存sourcemap
			.pipe(gulp.dest(OUT_CSS_DIR))									// 保存CSS文件
			.pipe($.connect.reload());										// 浏览器热更新
	}

	// 生产环境
	if (isPro) {
		return gulp.src(SRC_SASS_FILES)
			.pipe($.plumber(plumberConfig)) 								// 防止自动退出watch
			.pipe($.if(!USE_SASS_COMPASS, $.sass(sassConfig)))				// 如果只使用 sass, 请使用sass插件
			.pipe($.if( USE_SASS_COMPASS, $.compass(compassConfig)))		// 如果使用 compass, 请使用compass插件
			.pipe($.rev())													// 添加MD5
			.pipe($.cleanCss())												// CSS压缩 
			.pipe(gulp.dest(OUT_CSS_DIR))									// 保存CSS文件
			.pipe($.rev.manifest())											// 生成MD5映射
	        .pipe(gulp.dest(path.resolve(OUT_TEPM_DIR, SASS_DIR)));			// 保存映射
	}

});

// 处理图片文件
// 开发环境：dest
// 生产环境：minify -> dest
gulp.task('img', function() {

	return gulp.src(SRC_IMG_FILES)
		.pipe($.if(isPro, $.cache($.imagemin({								// 图片压缩
			interlaced: true
		}))))
		.pipe(gulp.dest(OUT_IMG_DIR));					 					// 保存图片文件

});

// 处理字体文件
// 开发环境：dest
// 生产环境：dest
gulp.task('font', function() {

	return gulp.src(SRC_FONT_FILES)
		.pipe(gulp.dest(OUT_FONT_DIR));						 				// 保存字体文件

});

// 处理HTML文件
// 依赖其他任务（如生成MD5）
// 开发环境：dest -> reload
// 生产环境：md5 -> minify -> dest
gulp.task('html', ['js', 'css', 'less', 'sass', 'img', 'font'], function() {

	// 开发环境
	if (isDev) {
		return gulp.src(SRC_HTML_FILES)
			.pipe(gulp.dest(OUT_HTML_DIR))									// 保存HTML文件
			.pipe($.connect.reload());										// 浏览器热更新
	}

	// 生产环境
	if (isPro) {
		return gulp.src([OUT_REV_FILES, SRC_HTML_FILES])					// 保存HTML文件
			.pipe($.revCollector())											// 根据映射，替换文件名
			.pipe($.htmlmin({collapseWhitespace: true}))					// HTML压缩
			.pipe(gulp.dest(OUT_HTML_DIR));									// 保存HTML文件
	}

});


// 监听文件改动，触发热更新
gulp.task('watch', function() {

	gulp.watch(SRC_JS_FILES,   ['js']);
	gulp.watch(SRC_CSS_FILES,  ['css']);
	gulp.watch(SRC_LESS_FILES, ['less']);
	gulp.watch(SRC_SASS_FILES, ['sass']);
	gulp.watch(SRC_HTML_FILES, ['html']);

});

// 运行本地服务器，启用热更新
gulp.task('server', function() {

	$.connect.server({
		root: OUT_PATH,
	    port: 8080,  // Can not be 80
	    livereload: true
	});

});

gulp.task('clean-temp', function() {

	// return gulp.src(path.resolve(OUT_PATH, TEMP_DIR))
	// 	.pipe($.clean());

});

// 默认任务
// 依赖clean任务
gulp.task('default', ['clean'], function() {

	// 开发环境
	if (isDev) {
		gulp.run('html', 'watch', 'server');
	}

	// 生产环境
	if (isPro) {
		gulp.run('html');
	}

});