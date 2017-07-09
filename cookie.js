exports.user = {
	cookie : {
		expires : {
			t : 60*24*90, /*90 days in sec*/
			ty : 'm' /* type */
		},
		domain : 	'/'
	},
	otp : {
		t : 60*3,
		ty : 'm'
	}
};

exports.admin = {
	cookie : {
		expires : {
			t : 60*24*720, /*90 days in sec*/
			ty : 'm'
		},
		domain : 	'/admin'
	}
};