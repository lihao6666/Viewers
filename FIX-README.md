### 图片上传的改造
屏蔽原有的截图功能，屏蔽弹框，通过在页面外创建新的弹框，重新渲染当前图片与标记使用html2canvas生成图片进行上传，不影响原有的功能，修改范围：

- Add:cornerstoneViewportUpload.tsx, ohif-v3/extensions/cornerstone/src/utls(上传的弹框组件)
- Add:OutViewLayer/index.js, ohif-v3/platform/ui/components/OutViewPlayer/index.js(导出组件)
- Add:OutViewLayer/OutViewLayer.tsx, ohif-v3/platform/ui/components/OutViewPlayer/OutViewLayer.tsx(弹出层组件)
- Add:OutViewLayerProvider.tsx, ohif-v3/platform/ui/src/contextProviders (上传组件数据传递)
- Add: UIOutViewLayerService/index.ts, ohif-v3/platform/core/src/services/UIOutViewLayerService (弹出层控制器)
- Fix: 因引用文件的修改
  * ohif-v3/platform/app/src/App.tsx
  * ohif-v3/platform/app/src/applnit.js
  * ohif-v3/platform/core/src/index.ts
  * ohif-v3/platform/core/src/services/index.ts
  * ohif-v3/platform/core/src/types/Services.ts
  * ohif-v3/platform/src/index.js
  * ohif-v3/platform/ui/src/components/index.js
  * ohif-v3/platform/ui/src/contextProviders/index.js

### 工具栏的改造
- 静态文件的添加
  - Add: fq-logo.png, ohif-v3/platform/app/public/assets
  - Add: header-logo.png, ohif-v3/platform/app/public/assets
  - Add: icon.png, ohif-v3/platform/app/public/assets
  - Add: moblie-header-logo.png, ohif-v3/platform/app/public/assets
  - Add: upload-cloud.svg, ohif-v3/platform/ui/src/assets/icons
  - Add: index.css, ohif-v3/platform/ui/src/components/Header
  - Add: deviceInfo.tsx, ohif-v3/platform/app/src/state (全局获取设备类型，窗口大小)
  - Fix: 修改头部相关文件
    * NavBar.tsx ohif-v3/platform/ui/src/components/NavBar
    * Header.tsx ohif-v3/platform/ui/src/components/Header

### 添加tags信息
  - 添加的文件
  - Add: index.ts, ohif-v3/platform/core/src/services/ParseTagsService (导出文件)
  - Add: ParseTagsService.ts, ohif-v3/platform/core/src/services/ParseTagsService (获取tag信息的方法)
  - Fix: 修改相关文件
    * index.ts ohif-v3/platform/core/src
    * index.ts ohif-v3/platform/core/src/services
    * DicomTagBrowser.tsx ohif-v3/extensions/default/src/DicomTagBrowser
    * CustomizableViewportOverlay.tsx ohif-v3/extensions/cornerstone/src/viewport/overlays


### 请求头部统一添加权限
  - Fix: 修改相关文件
    * Mode.tsx ohif-v3/platform/app/src/routes/Mode
    * user.js ohif-v3/platform/core/src
    * getAuthorizationHeader.js ohif-v3/platform/core/src/DICOMWeb
    * UserAuthenticationProvider.tsx ohif-v3/platform/ui/src/contextProviders

### 修改部分功能
  - Fix: 修改
    * CustomizableViewportOverlay.tsx  ohif-v3\extensions\cornerstone\src\Viewport\Overlays\CustomizableViewportOverlay.tsx（修改角信息）
    * PanelSegmentation.tsx  ohif-v3\extensions\cornerstone-dicom-seg\src\panels\PanelSegmentation.tsx（修改参数类型）
    * promptBeginTracking.tsx  ohif-v3\extensions\measurement-tracking\src\contexts\TrackedMeasurementsContext\promptBeginTracking.js (手机端跳过追踪确认)
    * index.tsx ohif-v3\modes\basic-dev-mode\src\index.js （手机端Zoom工具配置）
    * mobileToolbarButton.js ohif-v3\modes\basic-dev-mode\src\mobileToolbarButton.js (手机端头部功能按钮)

### 业务逻辑修改
  - Fix: 修改的文件
    * commandsModule.tsx  ohif-v3\extensions\default\src\commandsModule.ts (添加头部功能操作)
    * getToolbarModule.tsx ohif-v3\extensions\default\src\getToolbarModule.tsx (添加头部按钮组件)
    * ToolbarCornerInfoBtn.tsx ohif-v3\extensions\default\src\Toolbar\ToolbarCornerInfoBtn.tsx (自定义头部角信息按钮)
    * index.tsx  ohif-v3\extensions\default\src\ViewerLayout\index.tsx (修复swiper滑动阻止了事件冒泡)
    * index.js ohif-v3\modes\basic-test-mode\src\index.js （区分手机端的按钮）
    * mobileToolbarButton.js ohif-v3\modes\tmtv\src\mobileToolbarButtons.js(移动端头部功能按钮)
    * Header.tsx ohif-v3\platform\ui\src\component (头部左右侧边栏按钮)
    * CustomLoadingIndicator.tsx ohif-v3\platform\ui\src\component (loading 动画)
    * MeasurementItem.tsx ohif-v3\platform\ui\src\component\MeasurementTable (删除标记)
    * CustomSidePanel.tsx ohif-v3\platform\ui\src\component\SidePanel (侧边栏文件变动大，复制重写)
    * SplitButton.tsx ohif-v3\platform\ui\src\component\SplitButton (修复因滑动导致的头部功能下拉框没有收起)
    * CustomThumbnail.tsx ohif-v3\platform\ui\src\component\Thumbnail (自定义左侧边栏的序列的样式)
    * CustomThumbnailTracked.tsx ohif-v3\platform\ui\src\component\ThumbnailTracked (修改左侧边栏样式，改动多，复制重写)
    * ToolbarButton.tsx ohif-v3\platform\ui\src\component\ToolbarButton (修改控制toolTip的显示)
    * CustomViewportActionBar.tsx ohif-v3\platform\ui\src\component\ViewportActionBar (影像区域头部信息的修改)
    * ViewportDialogProvider.tsx ohif-v3\platform\ui\src\contextProviders (viewportDialog服务对象上绑定outsideClickMethod)
    * customWhiteLabeling.js ohif-v3\platform\app\assets\js (修改logo)