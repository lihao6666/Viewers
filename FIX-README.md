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