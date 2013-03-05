<?php
class WebUser extends CWebUser {
	public function beforeLogin($id, $states, $fromCookie){
		if ($fromCookie){
			$userRecord = UserRecord::model()->find('email=:email,session_key=:session_key', 
					array(	':email' => $id,
							':session_key' => $states['session_key']));
			if ($userRecord === null)
				return false;
			
		}
		return true;
	}
}