export default {
	user: {
		found: 'User found',
		changed: 'User changed',
		deleted: 'User deleted',
		no_id: 'User ID required',
		no_user: 'User with such ID does not exist',
		no_users: 'No users',

		invalid_email: 'Email is invalid',
		invalid_name_length: 'Name min 2 characters',
		invalid_name_type: 'Name must be a string',
		invalid_secondName_length: 'Second name min 2 characters',
		invalid_secondName_type: 'Second name should be a string',
	},
	auth: {
		found: 'User found',
		code_sent: 'Code sent',
		code_deprecated: 'Code is deprecated',
		code_wrong: 'Incorrect code',
		code_missing: 'Missing code',
		user_signed_up: 'Successfully registered',
		user_signed_in: 'Successful login',
		user_deleted: 'Your account has been deleted',
		incorrect_email_or_pass: 'Incorrect email or password',
		incorrect_data: 'Incorrect data',

		invalid_email: 'Email is invalid',
		invalid_password: 'Password min 8 characters',
		invalid_name_length: 'Name min 2 characters',
		invalid_name_type: 'Name must be a string',
		invalid_secondName_length: 'Second name min 2 characters',
		invalid_secondName_type: 'Second name should be a string',
		invalid_code: 'Code 6 digits',
	},
	realties: {
		found: 'Real estate found',
		changed: 'Real estate changed',
		created: 'Real estate created',
		deleted: 'Real estate deleted',
		no_realties: 'No realties found',
		no_realty: 'Realty with such ID does not exist',
		no_id: 'Realty ID required',

		invalid_action: 'Action must be rent or buy',
		invalid_type: 'Type must be apartment, room, studio, cottage, hostel or house',
		invalid_term: 'Term must be day or month',
		invalid_currency: 'Currency must be USD or RUB',
		invalid_houseType: 'House type must be brick, panel, monolith, wood or other',
		invalid_repair: 'Repair must be design, euro, cosmetic or without',
		invalid_price: 'Price must be a positive number',
		invalid_rooms: 'Rooms min 1 number',
		invalid_title: 'Title is string from 1 to 100 characters',
		invalid_description: 'Description is string from 1 to 1000 characters',
		invalid_address: 'Address is string from 1 to 100',
		invalid_area: 'Area min 1 sq. m.',
		invalid_elevator: 'Elevator true of false',
		invalid_bathrooms: 'Bathrooms is number',
		invalid_images: 'Images must be from 1 to 10',
		invalid_primeImage: 'Prime image is string',
	},
	location: {
		no_lat_or_lon: 'No content available',
		found: 'location found',
	},
	middlewares: {
		validateEmail: {
			exists: 'User with this email already exists',
		},
	},
};