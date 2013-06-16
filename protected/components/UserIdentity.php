<?php

class UserIdentity extends CUserIdentity
{
	private $_id;
	 
    public function authenticate()
    {
        $record=UserRecord::model()->find('email=:email', array(':email' => $this->id));
        
        if($record===null){
        	$this->errorCode=self::ERROR_USERNAME_INVALID;
        }
        else if($record->password!==crypt($this->password,$record->password)){	
        	$this->errorCode=self::ERROR_PASSWORD_INVALID;
        }
        else
        {
            $this->_id=$record->id;
            if ($record->session_count != 0){
            	$session_key = $record->session_key;
            }
            else {
            	$record->session_key = $session_key = md5(Utility::blowfishSalt());
            }
            $this->setState('company-id', $record->getAttribute('company_id'));
            $this->setState('project-id', $record->getAttribute('active_project_id'));
            $this->setState('session-key', $session_key);
            $this->setState('firstname', $record->firstname);
            $this->setState('lastname', $record->lastname);
            $this->setState('user-id', $record->getAttribute('id'));
            $this->setState('session_count', ++$record->session_count);
            $this->errorCode=self::ERROR_NONE;

            $login_time = new DateTime();
            $record->login_time = $login_time->getTimestamp();
            $record->save();
        }
        
        if ($this->errorCode === self::ERROR_USERNAME_INVALID ||
        		 $this->errorCode === self::ERROR_PASSWORD_INVALID){
        	$this->errorMessage = 'user with such email or password doesnt exist';
        }
        return !$this->errorCode;
    }
}