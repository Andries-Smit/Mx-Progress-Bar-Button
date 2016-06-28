
module.exports = function (grunt) {
    var pkg = grunt.file.readJSON("package.json");
    grunt.initConfig({
        pkgName: pkg.name,
        name: pkg.name,
        watch: {
            autoDeployUpdate: {
                "files": ["./src/**/*", "!./src/**/*.ts", "!./src/**/*.tsx",  "!./src/**/*.map"],
                "tasks": ["compress:makezip", "copy:deployment", "copy:mpks"],
                options: {
                    debounceDelay: 250,
                    livereload: true
                }
            }
        },
        
        compress: {
            makezip: {
                options: {
                    archive: "./dist/" + pkg.version + "/" + pkg.name + ".mpk",
                    mode: "zip"
                },
                files: [{
                        expand: true,
                        date: new Date(),
                        store: false,
                        cwd: "./src",
                        src: ["**/*"]
                    }]
            },
            out: {
                options: {
                    archive: "./dist/" + pkg.version + "/" + pkg.name + ".mpk",
                    mode: "zip"
                },
                files: [{
                        expand: true,
                        date: new Date(),
                        store: false,
                        cwd: "./out",
                        src: ["**/*"]
                    }]
            }
        },
        
        copy: {
            deployment: {
                files: [
                    {dest: "./test/deployment/web/widgets", cwd: "./src/", src: ["**/*"], expand: true}
                ]
            },
            mpks: {
                files: [
                    {dest: "./test/widgets", cwd: "./dist/" + pkg.version + "/", src: [ pkg.name + ".mpk"], expand: true}
                ]
            },
            out: {
                files: [
                    {dest: "./out", cwd: "./src/", src: ["**/*"], expand: true}
                ]
            }            
        },
        
        clean: {
            build: [
                    "./dist/" + pkg.version + "/" + pkg.name + "/*",
                    "./test/deployment/web/widgets/" + pkg.name + "/*",
                    "./test/widgets/" + pkg.name + ".mpk"
                ],
            out : "./out/**/*"                
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("distribute", ["clean:out", "copy:out", "compress:out", "copy:mpks" ]);
    grunt.registerTask(
            "clean build",
            "Compiles all the assets and copies the files to the build directory.", ["clean:build","compress:makezip", "copy:mpks" ]
            );
    grunt.registerTask("build", ["clean build"]);
};