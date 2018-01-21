var gulp = require("gulp");
var del = require("del");
var mocha = require('gulp-mocha');

var sourceFiles = ['./src/**/*'];
var destination = './dist/';

// Clean build directory
gulp.task('clean', function () {
	return del([destination + '/**/*.*']);
})

// Copy src files into build directory
gulp.task('copy', function () {
	return gulp.src(sourceFiles)
	.pipe(gulp.dest(destination));
})

// Main build task
gulp.task('build', ['clean', 'copy']);

// Watch files for modification and then apply build task
gulp.task('watch', function () {
	gulp.watch(sourceFiles, ['build']);
})

gulp.task('test', function() {
	return gulp.src(['src/**/*integration*.js'], { read: false })
	.pipe(mocha({
		reporter: 'xunit',
		globals: {
			should: require('should')
		}
	}));
});

// Default task when we running 'gulp' command
gulp.task('default', ['build']);