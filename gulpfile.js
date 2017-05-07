'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var filePath = {
	'src': 'src/',
	'dist': 'dist/',

	'html': '',
	'css': 'static/css/',
	'less': 'static/less/',
	'js': 'static/js/',
	'img': 'static/img/',
	'lib': 'lib/'
}
var copyFile = [filePath.img, filePath.lib];

gulp.task('clean', function() {
	gulp.src(filePath.dist)
		.pipe(plugins.clean());
});

gulp.task('jslint', function() {
	gulp.src(filePath.src + filePath.js + '**/*.js')
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter());
});

gulp.task('minify-js', function() {
	gulp.src(filePath.src + filePath.js + '**/*.js')
		.pipe(gulp.dest(filePath.dist + filePath.js))
		.pipe(plugins.uglify())
		.pipe(plugins.rename({
		    suffix: '.min'
		}))
		.pipe(gulp.dest(filePath.dist + filePath.js))
		// .pipe(plugins.livereload());
		.pipe(plugins.connect.reload());
});

gulp.task('minify-css', function() {
	gulp.src(filePath.src + filePath.css + '**/*.css')
		.pipe(gulp.dest(filePath.dist + filePath.css))
		.pipe(plugins.minifyCss())
		.pipe(plugins.rename({
		    suffix: '.min'
		}))
		.pipe(gulp.dest(filePath.dist + filePath.css))
		// .pipe(plugins.livereload());
		.pipe(plugins.connect.reload());
});

gulp.task('minify-html', function() {
	gulp.src(filePath.src + filePath.html + '**/*.html')
		.pipe(gulp.dest(filePath.dist + filePath.html))
		.pipe(plugins.minifyHtml())
		.pipe(plugins.rename({
		    suffix: '.min'
		}))
		.pipe(gulp.dest(filePath.dist + filePath.html))
		// .pipe(plugins.livereload());
		.pipe(plugins.connect.reload());
});

gulp.task('less', function() {
	gulp.src(filePath.src + filePath.less + '**/*.less')
		.pipe(plugins.less())
		.pipe(gulp.dest(filePath.dist + filePath.css))
		.pipe(plugins.minifyCss())
		.pipe(plugins.rename({
		    suffix: '.min'
		}))
		.pipe(gulp.dest(filePath.dist + filePath.css))
		// .pipe(plugins.livereload());
		.pipe(plugins.connect.reload());
});

gulp.task('copy-file', function() {
	copyFile.forEach( function(path) {
		gulp.src(filePath.src + path + '**/*')
			.pipe(gulp.dest(filePath.dist + path))
	});
});

gulp.task('watch', function() {
	// plugins.livereload.listen();
	gulp.watch(filePath.src + filePath.js + '**/*.js', function() {
		gulp.run('minify-js');
	});
	gulp.watch(filePath.src + filePath.css + '**/*.css', function() {
		gulp.run('minify-css');
	});
	gulp.watch(filePath.src + filePath.html + '**/*.html', function() {
		gulp.run('minify-html');
	});
	gulp.watch(filePath.src + filePath.less + '**/*.less', function() {
		gulp.run('less');
	});
});

gulp.task('server', function() {
	plugins.connect.server({
		name: 'Dist server.',
		root: filePath.dist,
	    port: 8080,  // Can not be 8080
	    livereload: true
	});
});

gulp.task('default', [], function() {
	gulp.run('jslint', 'minify-js', 'minify-css', 'minify-html', 'less', 'copy-file', 'watch', 'server');
});