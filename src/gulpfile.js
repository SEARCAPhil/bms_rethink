const gulp=require('gulp')
const uglify=require('gulp-uglify')
const uglify_css=require('gulp-clean-css')
const uglifyes=require('gulp-uglifyes')
const htmlmin=require('gulp-htmlmin')
const babelify = require('babelify')
const browserify = require("browserify")
const source=require('vinyl-source-stream')
const buffer=require('vinyl-buffer')
const glob=require('glob')
const runSequence = require('run-sequence')
const wbBuild = require('workbox-build');




gulp.task('minifying html',()=>{
	gulp.src(['./**/*.html'])
	.pipe(htmlmin({collapseWhitespace: true,minifyCSS: true,removeComments: true}))
	.pipe(gulp.dest('../www'))
})


gulp.task('minifying css',()=>{
	gulp.src(['./assets/css/**/*.css'])
	.pipe(uglify_css())
	.pipe(gulp.dest('../www/assets/css'))
})


gulp.task('copying fonts',()=>{
	gulp.src(['./assets/fonts/*'])
	.pipe(gulp.dest('../www/assets/fonts'))
})
gulp.task('copying images',()=>{
	gulp.src(['./assets/img/*'])
	.pipe(gulp.dest('../www/assets/img'))
})

gulp.task('copying manifest',()=>{
	gulp.src(['./manifest.json'])
	.pipe(gulp.dest('../www'))
})

gulp.task('copying js to js_native folder',()=>{
	glob('./assets/js/**/*.js',function(err,file){
		if(err) done(err)

		var file=file.map((entry)=>{
			return browserify({
		        entries: [entry],
		    })
			.transform(babelify.configure({
		        presets : ["es2015"]
		    }))
		    .bundle()
		    .pipe(source(entry))
		    .pipe(buffer())
		    .pipe(uglify())
			.pipe(gulp.dest('../www/assets/js_native'))
		})

	})
})

gulp.task('minifying modules and saving to js_es',()=>{
	gulp.src(['./assets/js/**/*.js'])
	.pipe(uglifyes({
		warnings:true,
		mangle:false,
		ecma:8
	}))
	.pipe(gulp.dest('../www/assets/js_es'))
})


gulp.task('copying other js files',()=>{
	gulp.src(['./assets/js/default.js'])
	.pipe(gulp.dest('../www/assets/js'))
})


gulp.task('creating export classes',()=>{
	glob('./assets/js/exports.js',function(err,file){
		if(err) done(err)

		var file=file.map((entry)=>{
			return browserify({
		        entries: [entry],
		    })
			.transform(babelify.configure({
		        presets : ["es2015"]
		    }))
		    .bundle()
		    .pipe(source(entry))
		    .pipe(buffer())
		    .pipe(uglify())
			.pipe(gulp.dest('../www'))
		})

	})
	
})




gulp.task('generating app shell',()=>{
	gulp.src(['./assets/js/shell.js'])
	.pipe(uglifyes({
		warnings:true,
		mangle:false,
		ecma:8
	}))
	.pipe(gulp.dest('../www/assets/js'))
})

//https://developers.google.com/web/tools/workbox/get-started/gulp
/*gulp.task('bundle-sw', () => {
  return wbBuild.generateSW({
    globDirectory: './',
    swDest: '../www/sw.js',
    globPatterns: ['**\/*.{html,js,css}'],
    globIgnores: ['spec\/*']
  })
  .then(() => {
    console.log('Service worker generated.');
  })
  .catch((err) => {
    console.log('[ERROR] This happened: ' + err);
  });
})*/


gulp.task('default',(cb)=>{
	runSequence('minifying html','minifying css','copying fonts','copying images','creating export classes','generating app shell','copying manifest','copying js to js_native folder','minifying modules and saving to js_es','copying other js files')
});

