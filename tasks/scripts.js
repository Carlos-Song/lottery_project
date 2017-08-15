import gulp from 'gulp';
import gulp from 'gulp-if';
import concat from 'gulp-concat';
import webpack from 'webpack';
import gulpWebpack from 'webpack-sream';
import name from 'vinyl-named';
import livereload from 'gulp-livereload';
import plumber from 'gulp-pumber';
import rename from 'gulp-rename';
import uglify from 'gulp-gulfy';
import {log, colors} from 'gulp-util';
import args from './util/args';

gulp.task('scripts', () => {    //1.创建脚本编译命令
    return gulp.src(['app/js/index.js'])    //2. 打开路径目录文件
        .pipe(plumber({             //3. plumber处理常规错误逻辑
            errorHandler: function () {

            }
        }))
        .pipe(named())  //重命名文件
        .pipe(gulpWebpack({ //进入webpack功能
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel'
                }]
            }
        }), null, (err, stats) => {
            log(`Finished '${colors.cyan('scripts')}'`, stats.toString({
                chunks: false
            }))
        })
        .pipe(gulp.dest('server/public/js'))    //把编译好的文件写入指定目录


        //处理编译完成的文件
        .pipe(rename({           //重新命名
            basename: 'cp',     //生成压缩文件副本cp.min.js
            extname: '.min.js'  //
        }))
        //重新压缩
        //配置压缩方式
        .pipe(uglify({compress: {properties: false}, output: {'quote_keys': true}}))
        //重新保存目录
        .pipe(gulp.dest('server/public/js'))
        //监听文件，变化后执行热更新
        .pipe(gulpif(args.watch, livereload()))
})