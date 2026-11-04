# 伍星的工程手记：设计参考

核对日期：2026-11-04。仅参考开源交互原理，页面构图、工程插图、书封与中文内容为本站重新设计，不照搬他人的个人资料、图片或音频。

- [Nodlik / StPageFlip](https://github.com/Nodlik/StPageFlip) · [官方演示与 API](https://nodlik.github.io/StPageFlip/) · [MIT 许可证](https://github.com/Nodlik/StPageFlip/blob/master/LICENSE)：采用其 `page-flip` 核心。支持 HTML 页面、硬封与软纸、翻页阴影、鼠标拖动和手机横竖屏，适合静态 GitHub Pages。实现时保留 MIT 版权与许可信息，将脚本随网站发布，避免依赖外部运行时 CDN。
- [Nodlik / react-pageflip](https://github.com/Nodlik/react-pageflip) · [官方演示](https://nodlik.github.io/react-pageflip/) · MIT：同作者的 React 封装，参考其页组件与导航控制方式。本站选择直接控制核心库以保持生命周期和响应式布局明确。
- [Qbject / the-book-of-qbject](https://github.com/Qbject/the-book-of-qbject) · MIT 代码：参考“个人经历作为一本书”的整体叙事和书页层次；其图片、视频不属于 MIT 范围，本站不使用。其 Three.js 路线也提示移动端图形开销，因此本站以可读 HTML 页面为基础。
- [blasten / turn.js](https://github.com/blasten/turn.js) · [许可证](https://github.com/blasten/turn.js/blob/master/license.txt)：核对后不采用。仓库第 3 版依赖 jQuery，许可限制非商业用途，且 README 中第 4 版与仓库第 3 版有区别；MIT 的 StPageFlip 更适合本次实现与后续维护。

本站方向：墨绿布纹封面、象牙纸页、朱红索引、工程图纸与手记式排版；桌面双页，手机单页；提供点击、拖动、键盘导航，以及直接阅读方式，兼顾展示与内容可读性。
