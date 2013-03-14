<?php
class CreateProductAction extends CAction {
	private function checkIsCompanyExist(){
		$companyId = Yii::app()->user->getState('company-id');
		if (!isset($companyId)){
			throw new InvalidStateException(500, $this->controller, "company Id doesnt exist");
		}	
	}
	
	private function checkIsFormExist(){
		if (!isset(Yii::app()->request->restParams["ProductForm"])){
			throw new InvalidRestParamsException(500, $this->controller, "request params doesnt exist");
		}	
	}
	
	private function checkFormIsValid($form){
		if (!$form->validate()){
			throw new InvalidRestParamsException(200, $this->controller, $form->errors);
		}
	}
	
	public function run(){
		if (Yii::app()->request->isPostRequest){
			$this->onSubmit();
		}
	}
	//TODO: ���������� Product ���������� ��� ��� �������� � ���������� ��������, �.� company_id � product ����� NULL
	private function onSubmit(){
		//���� � ��������� ������ ��� id ��������, �� ������ ������� ������
		$this->checkIsCompanyExist();
		$this->checkIsFormExist();
		$form = new ProductForm;
		$form->attributes = Yii::app()->request->restParams["ProductForm"];
		$this->checkFormIsValid($form);
		
		$product = new Product;
		$product->setAttributes($form->attributes, false);
		$product->company_id = Yii::app()->user->getState('company-id');
		$product->save();
		
		echo CJSON::encode(array('success' => true, 
				'product' => $product));
		Yii::app()->end();
	}
}