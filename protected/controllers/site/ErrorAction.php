<?php
class ErrorAction extends CAction {
	public function run(){
		if($error=Yii::app()->errorHandler->error)
		{
			if(Yii::app()->request->isAjaxRequest){
				//���� ����������� ajax-������� ���� ����������
				if (isset($error['exception'])){
					$exception = $error['exception'];
					//� ������ ������� � ajax-�������� ����� �������� �������� verbose, ���������� ����� ����������, 
					//������������ � ���� ���������� �������� ������ ���������� �� ������ ������� �� � json-�������
					if (YII_DEBUG && isset(Yii::app()->request->restParams['verbose'])){
						Yii::app()->displayException($exception);
					}
					else
					{
						//���������� ajax-���������� � ��� �������� �������
						$result = array('code' => $exception->getCode(), 'message' => $exception->getMessage());
						if ($exception instanceof CHttpException){
							$result['statusCode'] = $exception->statusCode;
							if ($exception instanceof HttpException){
								$result['type'] = $exception->type;
								$result['context'] = $exception->context;
								$result['specific']= $exception->specific;
							}
						}
						else if ($exception instanceof CDbException){
							$result['specicic'] = $exception->errorInfo;
						}	
						
						echo CJSON::encode($result);
					} 
					
					Yii::app()->end(1);
				}
			}
			//���� ����������� ������� ���� ���������� ��� ������
			else{
				$this->controller->renderFile(Yii::getPathOfAlias('application.views.site.error').'.php', $error);
			}
				
		}
	}
}