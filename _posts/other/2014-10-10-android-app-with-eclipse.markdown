---

layout: post
title:  eclipse 的 android 应用
date:   2014-10-10 17:15:57
categories: other

---

一些 Java 的语法参考 {% post_url haxe/2014-05-13-java-and-haxe-comparison %}

 * 下载 [ADT](http://developer.android.com/sdk/index.html)

 * 解压后, 先运行 `SDK Manager.exe` 下载需要的 android sdk, 这一步将会花上很长时间.

	> 目前国内需要设置代理 Tools -> Options 在 HTTP Proxy Server 里填 mirrors.neusoft.edu.cn, Port 为 80

	> 除了 SDK 包,API 文档(在最高等级API 目录里) 还有一些其它的 工具包以及扩展(例如: HAXM 可用于 Inter CPU加速模拟器),

 * eclipse 安装中文包, help -> install new software 点击 `ADD...` 按钮, 输入 `http://download.eclipse.org/technology/babel/update-site/R0.12.0/luna`, 确认后选译自已的语言包.

<!-- more -->

<br />

### Hello World

再新建 android project 的最后一步时, 将 Create Activity 去掉, 做一个纯代码的 Hello World! 未来再使用 res.layout::xml 来自动构建这些. 下边是一些需要注意的细节:

 > 主类 需要在自确的 包目录下, android 应用要求有 3 层，主类必须建立在这个目录之下.这里你需要连续建 3 个空目录

 > 在 AndroidManifest 的 application标签下的指出这个主类, UI 设置能帮助完成这一步.


```java
package com.exp.me;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

public class Helo extends Activity {
	
	@Override
	public void onCreate(Bundle savedInstanceState){
		
		super.onCreate(savedInstanceState);

		TextView tv = new TextView(this);
		
		tv.setText("Hello Android!");
		
		this.setContentView(tv);
	}

	
}
```

这是一个使用 layout 进行配置的版本, 使用 IDE 能快速熟悉这些类的样式.

```java
package com.exp.me;

import android.app.Activity;
import android.os.Bundle;

public class Helo extends Activity {
	
	@Override
	public void onCreate(Bundle savedInstanceState){
		
		super.onCreate(savedInstanceState);
		
		// activity_helo 名为自定义,当在 res/layout 目录上右键时, 会自动提示完成这些
		this.setContentView(R.layout.activity_helo);　 
	}

	
}

```

<br />


### AndroidManifest


其它链接: [中文](http://wiki.eoeandroid.com/Android_Manifest)


<br />


### 其它

 * [中文API](http://androidbox.sinaapp.com/), 这个链接有其它更多不错的内容. 

#### Activity

![activity.png](/assets/img/android-activity.png)

#### i18n(国际化)

res/values 目录下的 strings.xml 文件, 如果想支持中文, 复制 values 目录,并将 目录名称改为 `values-zh-rCN`, 然后修改 strings.xml 中对应的值. eclipse 将会自动把这些值写到 R.java 中去. 

在 xml 文件里 使用 @string/字符串资源名称 的形式调用.如: @string/app_name ,通常 eclipse 有更智能的自动完成.

在 java 代码中,当处于主类中时调用 `this.getString(R.string.app_name)`


#### layout(布局)

[其它链接-布局](http://www.cnblogs.com/cxcco/archive/2011/12/09/2282701.html)

#### theme(主题)

[原文](http://tieba.baidu.com/p/2029729690)



```
; android-sdk\platforms\android-x\data\res\values\themes.xml

Theme
; 黑色背景

Theme.Light
; 白色背景

Theme.Black
; 黑色背景, 黑得更彻底. 

Theme.NoTitleBar
; 无标题栏

Theme.NoTitleBar.Fullscreen
; 无标题栏和顶栏

Theme.Wallpaper
; 这个主题是将用户使用的墙纸作为背景的默认主题

Theme.WallpaperSettings
; 将当前墙纸设置在深色背景上，呈半透明。如果将程序放在桌面启动，则会以桌面的墙纸作为背景。

Theme.Translucent
; 呈全透明

Theme.NoDisplay
; 它真的什么都没显示

Theme.Dialog
; 该主题是可产生一个浮动对话框窗口般的主题

Theme.Dialog.Alert
;这个使用的方法比较特殊，一般会出现编译报错，提示该主题不是public。因为没在public. xml中声明的资源是google不推荐使用的。如果你坚决要使用该主题，则使用以下格式：（加上个*号即可)
; @* android:style/Theme.Dialog.Alert

Theme.Panel
; 提供一个去掉无关联窗口装饰的空矩形来放置你的内容，并以窗口浮动，全透明，较暗的形式出现。

Theme.InputMethod
; 输入的默认主题，背景透明，窗口透明并浮动，该主题不会使用户界面变暗淡，同时附带了标准的输入动画（升起的效果）和外观。

Theme.SearchBar

Theme.GlobalSearchBar

Theme.IconMenu

Theme.ExpandedMenu

Theme.Dialog.AppError

Theme.Dialog.RecentApplications
```

<br />




