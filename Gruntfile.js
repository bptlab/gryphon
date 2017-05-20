module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            js: {
                options: {
                    transform: [['babelify', {presets: ['react']}]],
                    watch: false,
                    keepAlive: true
                },
                src: ['./public_src/js/index.js'],
                dest: './public/js/bundle.js'
            }
        },
        copy: {
            config: {
                files: [
                    {
                        src: 'config.js.example',
                        dest: 'config.js'
                    },
                    {
                        src: 'client_config.js.example',
                        dest: 'client_config.js'
                    }
                ]
            },
            publicfiles: {
                files: [
                    {
                        expand: true,
                        src: '**',
                        cwd: 'node_modules/bootstrap/dist',
                        dest: 'public/'
                    },
                    {
                        expand: true,
                        src: '**',
                        cwd: 'node_modules/bpmn-js/assets/bpmn-font',
                        dest: 'public/'
                    },
                    {
                        src: './node_modules/diagram-js/assets/diagram-js.css',
                        dest: './public/css/diagram-js.css'
                    },
                    {
                        expand: true,
                        src: '**',
                        cwd: 'node_modules/bootstrap-select/dist',
                        dest: 'public/'
                    },
                    {
                        expand: true,
                        src: '**',
                        cwd: 'node_modules/swagger-ui/dist/css',
                        dest: 'public/swagger/css'
                    },
                    {
                        expand: true,
                        src: '**',
                        cwd: 'node_modules/swagger-ui/dist/fonts',
                        dest: 'public/swagger/fonts'
                    },
                    {
                        expand: true,
                        src: '**',
                        cwd: 'node_modules/swagger-ui/dist/images',
                        dest: 'public/swagger/images'
                    },
                    {
                        expand: true,
                        src: '**',
                        cwd: 'node_modules/swagger-ui/dist/lib',
                        dest: 'public/swagger/lib'
                    },
                    {
                        expand: true,
                        src: '**',
                        cwd: 'node_modules/swagger-ui/dist/lang',
                        dest: 'public/swagger/lang'
                    },
                    {
                        src: './node_modules/swagger-ui/dist/swagger-ui.js',
                        dest: './public/swagger/swagger-ui.js'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default','Build all files.',['copy:publicfiles','browserify']);
    grunt.registerTask('config','Copy config-samples.',['copy:config']);
};
