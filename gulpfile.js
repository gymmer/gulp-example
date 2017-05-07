'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// default

gulp.task('default', function(){
	return gulp.run('debug');
	// return gulp.run('release');
});

// clean

gulp.task('clean-debug', function() {
	return gulp.src('debug')
		.pipe(plugins.clean());
});

gulp.task('clean-release', function() {
	return gulp.src('release')
		.pipe(plugins.clean());
})

gulp.task('clean', function() {
	return gulp.run('clean-debug', 'clean-release');
})

// debug

gulp.task('jslint', function() {
	return gulp.src('src/js/user/**/*.js')
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter());
});

gulp.task('debug-js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(gulp.dest('debug/js'))
		.pipe(plugins.connect.reload());
});

gulp.task('debug-css', function() {
	return gulp.src('src/css/**/*.css')
		.pipe(gulp.dest('debug/css'))
		.pipe(plugins.connect.reload());
});

gulp.task('debug-html', function() {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('debug'))
		.pipe(plugins.connect.reload());
});

gulp.task('debug-less', function() {
	return gulp.src('src/less/**/*.less')
		.pipe(plugins.less())
		.pipe(gulp.dest('debug/css/user'))
		.pipe(plugins.connect.reload());
});

gulp.task('debug-img', function() {
	return gulp.src('src/img/**/*')
		.pipe(gulp.dest('debug/img'));
});

gulp.task('debug-fonts', function() {
	return gulp.src('src/css/fonts/**/*')
		.pipe(gulp.dest('debug/css/fonts'));
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', function() {
		gulp.run('debug-js');
	});
	gulp.watch('src/css/**/*.css', function() {
		gulp.run('debug-css');
	});
	gulp.watch('src/**/*.html', function() {
		gulp.run('debug-html');
	});
	gulp.watch('src/less/**/*.less', function() {
		gulp.run('debug-less');
	});
});

gulp.task('server', function() {
	plugins.connect.server({
		name: 'debug server.',
		root: 'debug',
	    port: 8080,  // Can not be 80
	    livereload: true
	});
});

gulp.task('debug', ['clean-debug'], function() {
	return gulp.run('jslint', 'debug-js', 'debug-css', 'debug-html', 'debug-less', 'debug-img', 'debug-fonts', 'watch', 'server');
});

// release

gulp.task('release-js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(plugins.uglify())					// JS压缩
		.pipe(plugins.rev())					// 添加MD5
		.pipe(gulp.dest('release/js'))			// 保存JS文件
		.pipe(plugins.rev.manifest())			// 生成MD5映射
        .pipe(gulp.dest('release/rev/js'));		// 保存映射
});

gulp.task('release-css', function() {
	return gulp.src('src/css/**/*.css')
		.pipe(plugins.minifyCss())				// CSS压缩 
		.pipe(plugins.rev())					// 添加MD5
		.pipe(gulp.dest('release/css'))			// 保存CSS文件
		.pipe(plugins.rev.manifest())			// 生成MD5映射
        .pipe(gulp.dest('release/rev/css'));	// 保存映射
});

gulp.task('release-less', function() {
	return gulp.src('src/less/**/*.less')
		.pipe(plugins.less())					// 编译less
		.pipe(plugins.minifyCss())				// CSS压缩
		.pipe(plugins.rev())					// 添加MD5
		.pipe(gulp.dest('release/css/user'))	// 保存CSS文件
		.pipe(plugins.rev.manifest())			// 生成MD5映射
        .pipe(gulp.dest('release/rev/less'));	// 保存映射
});

gulp.task('release-fonts', function() {
	return gulp.src('src/css/fonts/**/*')
		.pipe(gulp.dest('release/css/fonts'));
});

gulp.task('release-img', function() {
	return gulp.src('src/img/**/*')
		.pipe(gulp.dest('release/img'));
});

gulp.task('release-html', ['release-js','release-css','release-less'], function() {		// 依赖：需先生成映射
	return gulp.src(['release/rev/**/*.json', 'src/**/*.html'])
		.pipe(plugins.revCollector())			// 根据映射，替换文件名
		.pipe(plugins.minifyHtml())				// HTML压缩
		.pipe(gulp.dest('release'));			// 保存HTML文件
});

gulp.task('release', ['clean-release'], function() {
	return gulp.run('release-js','release-css','release-less', 'release-html', 'release-fonts', 'release-img');
});