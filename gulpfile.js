'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('clean', function() {
	gulp.src('dist/')
		.pipe(plugins.clean());
});

gulp.task('jslint', function() {
	gulp.src('src/js/*.js')
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter());
});

gulp.task('minify-js', function() {
	gulp.src('src/js/**/*.js')
		.pipe(plugins.uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(plugins.livereload());
});

gulp.task('minify-css', function() {
	gulp.src('src/css/**/*.css')
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('minify-html', function() {
	gulp.src('src/*.html')
		.pipe(plugins.minifyHtml())
		.pipe(gulp.dest('dist/'))
		.pipe(plugins.livereload());
});

gulp.task('copy-file', function() {
	gulp.src('src/css/fonts/*')
		.pipe(gulp.dest('dist/css/fonts'));
	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('less', function() {
	gulp.src('src/less/*.less')
		.pipe(plugins.less())
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest('dist/css'))
		.pipe(plugins.livereload());
});

gulp.task('watch', function() {
	plugins.livereload.listen();
	gulp.watch('src/less/*.less', function() {
		gulp.run('less');
	});
	gulp.watch('src/js/*.js', function() {
		gulp.run('minify-js');
	});
	gulp.watch('src/*.html', function() {
		gulp.run('minify-html');
	});
});

gulp.task('default', [], function() {
	gulp.run('jslint', 'minify-js', 'minify-css', 'minify-html', 'copy-file', 'less', 'watch');
});