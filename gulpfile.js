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
gulp.task('build', gulp.series(['clean', 'copy']));

// Watch files for modification and then apply build task
gulp.task('watch', function () {
	gulp.watch(sourceFiles, ['build']);
})

// Task for running end to end test
gulp.task('e2eTest', function() {
	return gulp.src(['src/**/*e2e*.js'], { read: false })
	.pipe(mocha({
		reporter: 'spec',
		exit: true,
		globals: {
			should: require('should')
		}
	}));
});

// Task for running unit test
gulp.task('unitTest', function() {
	return gulp.src(['src/**/*spec*.js'], { read: false })
	.pipe(mocha({
		reporter: 'mocha-junit-reporter',
		reporterOptions: {
			mochaFile: '/tmp/unittest.xml'
		},
		globals: {
			should: require('should')
		}
	}));
});

// Task for running both end to end test and unit test
gulp.task('test', gulp.series(['e2eTest', 'unitTest']));

// Default task when we running 'gulp' command
gulp.task('default', gulp.series(['build']));