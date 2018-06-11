/*
 After you have changed the settings under responsive_images
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function (grunt) {

    grunt.initConfig({
        responsive_images: {
            dev: {
                options: {
                    engine: 'im',
                    sizes: [
                        {
                            width: '320',
                            suffix: '-sm',
                            quality: 30
                        },
                        {
                            width: '640',
                            suffix: '-md',
                            quality: 30
                        },
                        {
                            width: '1024',
                            suffix: '-1x',
                            quality: 30
                        },
                        {
                            width: 1600,
                            suffix: '-2x',
                            quality: 30
                        }
                    ],
                },

                /*
                You don't need to change this part if you don't change
                the directory structure.
                */
                files: [{
                    expand: true,
                    src: ['*.{gif,jpg,png}'],
                    cwd: 'images_src/',
                    dest: 'img/'
                }]
            }
        },

        /* Clear out the images directory if it exists */
        clean: {
            dev: {
                src: ['img'],
            },
        },

        /* Generate the images directory if it is missing */
        mkdir: {
            dev: {
                options: {
                    create: ['img']
                },
            },
        },

        /* Copy the "fixed" images that don't go through processing into the images/directory */
        copy: {
            dev: {
                files: [{
                    expand: true,
                    src: ['images_src/*.{gif,jpg,png}'],
                    dest: 'img/',
                    flatten: true,
                }]
            },
        },

    });

    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images']);

};
