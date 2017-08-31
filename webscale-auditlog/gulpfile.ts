import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators";
import * as gulp from "gulp";
import * as merge from "merge2";
import * as typescript from "gulp-typescript";
import * as mocha from "gulp-mocha";
import * as nodemon from "gulp-nodemon";
const del: any = require('del');

const tsConfig = require("./tsconfig.json");
const settings = {
  distFolder: './dist',
  projectName: 'angular2-rest',
  tsConfig: tsConfig,
  testFiles: "./src/**/*.spec.ts",
  srcFiles: "./src/**/*.ts",
  assetsFiles: ['./README.md', './package.json', './src/**/*.yml']
};


@Gulpclass()
export class Gulpfile {

  @Task()
  clean(cb: Function) {
    return del([settings.distFolder + '/**', "!" + settings.distFolder], cb);
  }

  @Task()
  copyAssetsFiles() {
    return gulp.src(settings.assetsFiles)
      .pipe(gulp.dest(settings.distFolder));
  }

  @Task()
  compile(cb: Function) {
    let compilerOptions = settings.tsConfig.compilerOptions;
    let src = [settings.srcFiles, "!" + settings.testFiles];

    let tsProject = typescript.createProject(compilerOptions);
    let tsResult = gulp.src(src)
      .pipe(tsProject());
    merge([
      tsResult.dts.pipe(gulp.dest(settings.distFolder)),
      tsResult.js.pipe(gulp.dest(settings.distFolder))
    ]).on('finish', () => {
      cb();
    }).on('error', err => cb(err));
  }

  @Task()
  compileTest(cb: Function) {
    let compilerOptions = settings.tsConfig.compilerOptions;
    let src = [settings.srcFiles, settings.testFiles];

    let tsProject = typescript.createProject(compilerOptions);
    let tsResult = gulp.src(src)
      .pipe(tsProject());
    merge([
      tsResult.dts.pipe(gulp.dest(settings.distFolder)),
      tsResult.js.pipe(gulp.dest(settings.distFolder))
    ]).on('finish', () => {
      cb();
    }).on('error', err => cb(err));
  }

  @Task('test', ['clean', 'compileTest'])
  test(cb: Function){
    return gulp.src(['dist/**/*.spec.js'], { read: false })
      .pipe(mocha({ reporter: 'list' }))
      // .on('error', gutil.log)
      .on('finish', function () {
        cb();
      });
  }

  @Task()
  watchFiles(cb: Function) {
    gulp.watch([settings.srcFiles, settings.testFiles], ['compileTest']);
    gulp.watch([settings.assetsFiles], ['copyAssetsFiles']);
    nodemon({
      script: 'dist/index.js',
      exec: 'node --debug',
      // debug: true,
      ext: 'js html',
      env: { 'NODE_ENV': 'development' }
    });
    cb();
  }

  @SequenceTask() // this special annotation using "run-sequence" module to run returned tasks in sequence
  watch() {
    return ['clean', 'copyAssetsFiles', 'compileTest', 'watchFiles'];
  }

  @SequenceTask() // this special annotation using "run-sequence" module to run returned tasks in sequence
  build() {
    return ['clean', 'copyAssetsFiles', 'compileFiles'];
  }

  @Task()
  default() { // because this task has "default" name it will be run as default gulp task
    return ['watch'];
  }

}
