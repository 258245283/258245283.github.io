import type { BooknavGroup, BooknavPageConfig } from "../types/booknavConfig";

// 书签导航页面配置
export const booknavPageConfig: BooknavPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// favicon 自动获取配置
	favicon: {
		// 书签未填写 icon 时，是否自动获取目标站点的 favicon 图标
		enabled: true,

		// favicon 接口地址，{domain} 为占位符，会被替换成目标站点域名
		// 更换接口只需保证地址里含有 {domain}，例如：
		//   https://a.favicon.im/{domain}
		//   https://favicon.im/{domain}
		api: "https://a.favicon.im/{domain}",
	},
};

// 书签导航配置
// 每个数组项是一个分类组，分类组内的 items 是该分类下的书签
export const booknavConfig: BooknavGroup[] = [
	{
		id: "dev",
		name: "开发",
		icon: "material-symbols:code-rounded",
		desc: "写代码时离不开的站点",
		weight: 100,
		items: [
			{
				title: "GitHub",
				url: "https://github.com",
				desc: "全球最大的代码托管平台",
				// icon 字段可以使用 astro-icon 图标库的图标名称
				// 也可以使用图片 URL 和本地图片路径
				// 不填则会通过接口自动获取目标站点的 favicon 图标（需要在上面配置）
				icon: "fa7-brands:github",
				weight: 10,
			},
		],
	},
	{
		id: "opensource",
		name: "项目",
		icon: "material-symbols:code-rounded",
		desc: "好用的开源项目",
		weight: 90,
		items: [
			{
				title: "Firefly",
				url: "https://github.com/CuteLeaf/Firefly",
				desc: "清晰美观的 Astro 个人博客主题模板",
				icon: "/favicon/firefly-32.png",
				weight: 10,
			},
		],
	},
	{
		id: "design",
		name: "设计",
		icon: "material-symbols:palette-outline-rounded",
		desc: "配色、图标与灵感来源",
		weight: 90,
		items: [
			{
				title: "Iconify",
				url: "https://icon-sets.iconify.design",
				desc: "海量开源图标集合搜索",
				weight: 10,
			},
		],
	},
	{
		id: "tools",
		name: "工具",
		icon: "material-symbols:build-outline-rounded",
		desc: "顺手的在线小工具",
		weight: 80,
		items: [
			{
				title: "TinyPNG",
				url: "https://tinypng.com",
				desc: "在线压缩 PNG / JPEG 图片",
				weight: 10,
			},
		],
	},
	{
		id: "resources",
		name: "资源",
		icon: "material-symbols:auto-stories-outline-rounded",
		desc: "文档、教程与阅读",
		weight: 70,
		items: [
			{
				title: "Firefly Docs",
				url: "https://docs-firefly.cuteleaf.cn",
				desc: "Firefly 主题模板文档",
				icon: "https://docs-firefly.cuteleaf.cn/logo.png",
				weight: 10,
			},
		],
	},
];
