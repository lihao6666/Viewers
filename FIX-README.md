### 图片上传的改造
屏蔽原有的截图功能，屏蔽弹框，通过在页面外创建新的弹框，重新渲染当前图片与标记使用html2canvas生成图片进行上传，不影响原有的功能，修改范围：

- add:cornerstoneViewportUpload.tsx, ohif-v3/extensions/cornerstone/src/utls(上传的弹框组件)
- add:OutViewLayer/index.js, ohif-v3/platform/ui/components/OutViewPlayer/index.js(导出组件)
- add:OutViewLayer/OutViewLayer.tsx, ohif-v3/platform/ui/components/OutViewPlayer/OutViewLayer.tsx(弹出层组件)
- add:OutViewLayerProvider.tsx, ohif-v3/platform/ui/src/contextProviders (上传组件数据传递)
- add: UIOutViewLayerService/index.ts, ohif-v3/platform/core/src/services/UIOutViewLayerService (弹出层控制器)
- Whole slide microscopy viewing
- PDF and Dicom Structured Report rendering
- Segmentation rendering as labelmaps and contours
- User Access Control (UAC)
- Context specific toolbar and side panel content
- and many others