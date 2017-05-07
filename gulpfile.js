'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// JS代码校验。只校验用户自定义的js文件，不校验第三方js文件，如jQuery
gulp.task('jslint', function() {
	return gulp.src('src/js/user/**/*.js')
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter());
});

// 监听所有文件改动：自动刷新
gulp.task('reload', function() {
	return gulp.src('src/**/*')
		.pipe(plugins.connect.reload());
});

// 编译less文件，并监听less文件改动：重新编译+自动刷新
gulp.task('less', function() {
	return gulp.src('src/less/**/*.less')
		.pipe(plugins.plumber({errorHandler: plugins.notify.onError('Error: <%= error.message %>')})) // 防止less出错，自动退出watch
		.pipe(plugins.less())
		.pipe(gulp.dest('src/css/user'))
		.pipe(plugins.connect.reload());
});

// 监听文件改动
gulp.task('watch', function() {
	gulp.watch('src/**/*', ['reload']);
	gulp.watch('src/less/**/*.less', ['less']);
});

// 运行一个服务器
gulp.task('server', function() {
	plugins.connect.server({
		root: 'src',
	    port: 8080,  // Can not be 80
	    livereload: true
	});
});

// 默认任务
gulp.task('default', function() {
	gulp.run('jslint', 'reload', 'less', 'watch', 'server')
});

// release

gulp.task('clean', function() {
	return gulp.src('release')
		.pipe(plugins.clean());
})

gulp.task('release-js', function() {
	return gulp.src('src/**/*.js')
		.pipe(plugins.uglify())					// JS压缩
		.pipe(plugins.rev())					// 添加MD5
		.pipe(gulp.dest('release'))				// 保存JS文件
		.pipe(plugins.rev.manifest())			// 生成MD5映射
        .pipe(gulp.dest('release/rev/js'));		// 保存映射
});

gulp.task('release-css', ['less'], function() {	// 编译less
	return gulp.src('src/**/*.css')
		.pipe(plugins.minifyCss())				// CSS压缩 
		.pipe(plugins.rev())					// 添加MD5
		.pipe(gulp.dest('release'))				// 保存CSS文件
		.pipe(plugins.rev.manifest())			// 生成MD5映射
        .pipe(gulp.dest('release/rev/css'));	// 保存映射
});

gulp.task('release-html', ['release-js', 'release-css'], function() {		// 依赖：需先生成映射
	return gulp.src(['release/rev/**/*.json', 'src/**/*.html'])
		.pipe(plugins.revCollector())			// 根据映射，替换文件名
		.pipe(plugins.minifyHtml())				// HTML压缩
		.pipe(gulp.dest('release'));			// 保存HTML文件
});

gulp.task('release-fonts', function() {
	return gulp.src('src/**/*.{eot,ttf,woff,woff2,otf}')
		.pipe(gulp.dest('release'));
});

gulp.task('release-img', function() {
	return gulp.src('src/**/*.{png,jpg,gif,jpeg,svg}')
		.pipe(gulp.dest('release'));
});

gulp.task('release', ['clean'], function() {
	return gulp.run('release-html', 'release-fonts', 'release-img');
});