<?php
interface ExceptionCodes {
	const NONE = 0x0000;
	const NOT_AJAX_REQUEST = 0x0001;
	const INVALID_REST_PARAMS = 0x0002;
	const STORE_OPERATION_FAILURE = 0x0005;
	const INVALID_STATE = 0x0006;
	const TRANSACTION_FAILURE = 0x0007;
	const UNKNOWN = 0xffff;
}