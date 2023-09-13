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