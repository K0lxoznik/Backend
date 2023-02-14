/** ## Response Codes
 * The response codes are used to send
 * the appropriate response to the client
 */
export enum CODES {
	// 2xx Success
	/**
	 * The request has succeeded
	 */
	OK = 200,
	/**
	 * The request has been fulfilled and
	 * has resulted in one or more new
	 * resources being created
	 */
	CREATED = 201,
	/**
	 * The request has been accepted for
	 * processing, but the processing
	 * has not been completed
	 */
	ACCEPTED = 202,
	/**
	 * The server successfully processed
	 * the request, but is not
	 * returning any content
	 */
	NO_CONTENT = 204,

	// 4xx Client Error
	/**
	 * The server cannot or will not
	 * process the request due to an
	 * apparent client error
	 */
	BAD_REQUEST = 400,
	/**
	 * The server requires user
	 * authentication
	 */
	UNAUTHORIZED = 401,
	/**
	 * The server not allowed to access
	 * the requested resource
	 */
	FORBIDDEN = 403,
	/**
	 * The requested resource could not
	 * be found but may be available
	 * in the future
	 */
	NOT_FOUND = 404,

	// 5xx Server Error
	/**
	 * The server encountered an unexpected
	 * condition which prevented it from
	 * fulfilling the request
	 */
	INTERNAL_SERVER_ERROR = 500,
	/**
	 * The server does not support the
	 * functionality required to fulfill
	 * the request
	 */
	NOT_IMPLEMENTED = 501,
	/**
	 * The server not acting as a gateway
	 */
	BAD_GATEWAY = 502,
	/**
	 * The server is currently unavailable
	 */
	SERVICE_UNAVAILABLE = 503,
	/**
	 * The server didn't receive a timely response
	 */
	GATEWAY_TIMEOUT = 504,
}
