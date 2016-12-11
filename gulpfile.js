/**
 * Created by yeoman generator-makrina 0.4.1 on 10/12/2016.
 *
 * Gulp configuration
 * Adapted from gulpfile-ninecms
 */

/*
 * Configuration
 */
var paths = {
  js_lint: ['*.js'],
  js_cover: ['index.js'],
  mocha: ['*.spec.js']
};

/*
 * Include section
 */
'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var path = require('path');

/*
 * Error notification methods
 */
var handleError = function (task) {
  return function (err) {
    notify.onError({
      message: task + ' failed, check the logs',
      sound: false
    })(err);
    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
  };
};

/**
 * TASK METHODS
 */
var tasks = {
  /*
   * linting
   */
  lintjs: function () {
    return gulp.src(paths.js_lint)
      .pipe(excludeGitignore())
      .pipe(eslint({
        rules: {
          // control characters eg `\n` are required for file appends
          'no-control-regex': 'off',
          // allow double quotes to avoid escaping single
          'quotes': ['error', 'single', {avoidEscape: true}],
          // relax curly
          'curly': ['error', 'multi-line']
        }
      }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
      .on('error', handleError('LINT'));
  },

  /*
   * Testing security exploits with NSP
   */
  nsp: function (cb) {
    nsp({package: path.resolve('package.json')}, cb);
  },

  /*
   * Pre-Testing
   */
  preTest: function () {
    return gulp.src(paths.js_cover)
      .pipe(excludeGitignore())
      .pipe(istanbul({
        includeUntested: true
      }))
      .pipe(istanbul.hookRequire());
  },

  /*
   * Testing with mocha
   * https://github.com/sindresorhus/gulp-mocha/issues/54#issuecomment-240666300
   */
  mocha: function () {
    gulp.doneCallback = function (err) {
      process.exit(err ? 1 : 0);
    };
    return gulp.src(paths.mocha)
      .pipe(plumber())
      .pipe(mocha({reporter: 'spec', colors: true}))
      .on('error', handleError('Mocha'))
      .pipe(istanbul.writeReports());
  }
};

/*
 * CUSTOMS TASKS
 */
gulp.task('lintjs', tasks.lintjs);
gulp.task('nsp', tasks.nsp);
gulp.task('preTest', tasks.preTest);
gulp.task('mocha', tasks.mocha);
gulp.task('istanbul', ['preTest'], tasks.mocha);

// test task
gulp.task('test', [
  'lintjs',
  'nsp',
  'istanbul'
]);

gulp.task('default', ['test']);
