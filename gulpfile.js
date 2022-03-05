const gulp = require("gulp");
const uglify = require("gulp-uglify-es").default;
//const concat = require("gulp-concat");
const babel = require("gulp-babel");
const rename = require("gulp-rename");

gulp.task("servejs", function () {
  //*** direct copy
  gulp.src(["src/main.js","src/tests.js"]).pipe(gulp.dest("docs/js/"));
  gulp.src("src/pixelit.js").pipe(gulp.dest("dist/"));
  //*** minify and transpile
  gulp
    .src("src/main.js")
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("docs/js/"));
  gulp
    .src("dist/pixelit.min.js")
    .pipe(gulp.dest("docs/js/"));
  return gulp
    .src("src/pixelit.js")
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(uglify())
    .pipe(rename("pixelit.min.js"))
    .pipe(gulp.dest("dist/"));
});

const serve = gulp.series(["servejs"]);

//live and dist task
gulp.task("serve", function () {
  console.log(`Watching src/*.js ...`);
  serve();
  return gulp.watch("src/*.js", gulp.series("servejs"));
});
