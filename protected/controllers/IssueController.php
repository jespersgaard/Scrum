<?php
class IssueController extends Controller {
	public function actions(){
		return array(
			'create' => 'application.controllers.issue.CreateIssueAction',
			//drop �������� issue � �������
			'drop' => 'application.controllers.issue.DropIssueAction',
			//��������� ������ ����-��
			'assign' => 'application.controllers.issue.AssignAction',
			//delete ������� issue ��������
			'delete' => 'application.controllers.issue.DeleteIssueAction'
		);
	}
}