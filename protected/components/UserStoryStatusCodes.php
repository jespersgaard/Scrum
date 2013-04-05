<?php
interface UserStoryStatusCodes {
	//�����, �� ������������� �� Sprint Planning Meeting
	const OPEN = 0x0000;
	//�������������� ��� ������������ �� Sprint Planning Meeting
	const READY_FOR_ESTIMATION = 0x0001;
	//��������������,������������� �� Sprint Planning Meeting, ����������
	const READY_FOR_SPRINT = 0x0002;
	//������������� � ���������� �������
	const ASSIGNED_TO_SPRINT = 0x0003;
	//������� ������ ����� ������ �������
	const TODO = 0x0004;
	//����� ������ ������ ��� ��� �� ����� �������
	const IN_PROGRESS = 0x0005;
	//����� ���������� �������� �����, ������ � ������������
	const TO_TEST = 0x0006;
	//�����������
	const DONE = 0x0007;
}