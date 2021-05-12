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

### Tools

- ProcessExplorer 用于查看进程信息

### misc

- 微信似乎会检测其父进程是否为 explorer, 但应该能通过 [PPID Spoofing] 绕过

- 如何隐藏注入的 DLL?

  1. DLL加载顺序劫持?
  2. 用户安全级别参考: <https://github.com/streed/HideMyAss>(未测试)


### codes

```c
// GetProcessParentID
#include <stdio.h>
#include <windows.h>
#include <tlhelp32.h>

int main(int argc, char *argv[]) 
{
    int pid = -1;
    HANDLE h = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    PROCESSENTRY32 pe = { 0 };
    pe.dwSize = sizeof(PROCESSENTRY32);

    //assume first arg is the PID to get the PPID for, or use own PID
    if (argc > 1) {
        pid = atoi(argv[1]);
    } else {
        pid = GetCurrentProcessId();
    }

    if( Process32First(h, &pe)) {
        do {
            if (pe.th32ProcessID == pid) {
                printf("PID: %i; PPID: %i\n", pid, pe.th32ParentProcessID);
            }
        } while( Process32Next(h, &pe));
    }

    CloseHandle(h);
}
```


```c++
#include <windows.h>
#include <tlhelp32.h>

// https://pentestlab.blog/2020/02/24/parent-pid-spoofing/
DWORD explorerID() {
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
// DWORD ppid;






SIZE_T cbSize = 0;
InitializeProcThreadAttributeList(NULL, 1, 0, &cbSize);
PPROC_THREAD_ATTRIBUTE_LIST attrThread = HeapAlloc(GetProcessHeap(), 0, cbSize);
InitializeProcThreadAttributeList(attrThread, 1, 0, &cbSize);
CurrentProcessAdjustToken();
HANDLE hParentProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, ppid);

UpdateProcThreadAttribute(attrThread, 0, PROC_THREAD_ATTRIBUTE_PARENT_PROCESS, &hParentProcess, sizeof(HANDLE), NULL, NULL)

PROCESS_INFORMATION procInfo;
STARTUPINFOEX startInfo = {
	.cb = sizeof(STARTUPINFOEX)
};
startInfo.lpAttributeList  = attrThread;
CreateProcess(NULL, argv[1], NULL, NULL, FALSE, EXTENDED_STARTUPINFO_PRESENT, NULL, NULL, &startInfo.StartupInfo, &procInfo);
DeleteProcThreadAttributeList(pAttributeList);
CloseHandle(hParentProcess);
```



[PPID Spoofing]:https://pentestlab.blog/2020/02/24/parent-pid-spoofing/
(rich-edit-controls):https://docs.microsoft.com/en-us/windows/win32/controls/about-rich-edit-controls
