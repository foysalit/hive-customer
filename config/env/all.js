'use strict';

module.exports = {
	app: {
		title: 'Customer Management',
		description: 'Hive Customer Management app built on the mean stack',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'http://cdnjs.cloudflare.com/ajax/libs/select2/3.4.5/select2.css',
				'public/lib/angular-ui-select/dist/select.min.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-ui-select/dist/select.min.js',
				//'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.min.js',
				'public/lib/angular-socket-io/socket.min.js',
				'public/lib/angular-smart-table/dist/smart-table.min.js',
				'public/lib/lodash/lodash.min.js',
				'http://maps.googleapis.com/maps/api/js?libraries=places,geometry&sensor=false&language=en&v=3.17',
				'public/lib/angular-google-maps/dist/angular-google-maps.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};