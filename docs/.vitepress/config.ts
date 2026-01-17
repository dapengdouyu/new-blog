import { defineConfig } from 'vitepress'
import { join } from 'path'
import type { DefaultTheme } from 'vitepress'

export default defineConfig({
  title: '我的博客',
  description: '这是我的个人博客，分享技术、生活和思考',
  lang: 'zh-CN',

  vite: {
    ssr: {
      noExternal: ['@nolebase/vitepress-plugin-breadcrumbs'],
    },
    optimizeDeps: {
      exclude: ['@nolebase/vitepress-plugin-breadcrumbs/client'],
    },
  },

  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详情',
    },
  },

  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: 'Go语言',
        items: [
          {
            text: '核心教程',
            link: '/article/golang/core/'
          },
          {
            text: 'Gin框架',
            link: '/article/golang/gin/'
          },
          {
            text: 'GORM',
            link: '/article/golang/gorm/'
          },
          {
            text: 'Kratos',
            link: '/article/golang/kratos/'
          }
        ]
      },
      {
        text: 'Nginx',
        link: '/article/nginx/'
      },
      {
        text: '网络',
        link: '/article/network/'
      },
      {
        text: 'Python',
        link: '/article/python/'
      },
      {
        text: '日常问题',
        link: '/article/question/'
      }
    ],

    sidebar: {
      '/article/golang/core/': [
        {
          text: 'Go语言核心教程',
          link: '/article/golang/core/',
          items: [
            { text: '1.Go语言入门：环境安装与配置', link: '/article/golang/core/1.Go语言入门：环境安装与配置' },
            { text: '2.Go语言入门：基础语法与变量常量', link: '/article/golang/core/2.Go语言入门：基础语法与变量常量' },
            { text: '3.Go语言基础：数据类型与类型转换', link: '/article/golang/core/3.Go语言基础：数据类型与类型转换' },
            { text: '4.Go语言基础：运算符与位运算', link: '/article/golang/core/4.Go语言基础：运算符与位运算' },
            { text: '5.Go语言基础：指针', link: '/article/golang/core/5.Go语言基础：指针' },
            { text: '6.Go语言基础：字符串、数组与切片', link: '/article/golang/core/6.Go语言基础：字符串、数组与切片' },
            { text: '7.Go语言基础：控制流', link: '/article/golang/core/7.Go语言基础：控制流' },
            { text: '8.Go语言基础：函数', link: '/article/golang/core/8.Go语言基础：函数' },
            { text: '9.Go语言进阶：复合类型与结构体', link: '/article/golang/core/9.Go语言进阶：复合类型与结构体' },
            { text: '10.Go语言实践：包管理', link: '/article/golang/core/10.Go语言实践：包管理' },
            { text: '11.Go语言实践：错误处理', link: '/article/golang/core/11.Go语言实践：错误处理' },
            { text: '12.Go语言高级：接口', link: '/article/golang/core/12.Go语言高级：接口' },
            { text: '13.Go语言高级：并发基础', link: '/article/golang/core/13.Go语言高级：并发基础' },
            { text: '14.Go语言高级：Channel通信', link: '/article/golang/core/14.Go语言高级：Channel通信' },
            { text: '15.Go语言高级：并发控制', link: '/article/golang/core/15.Go语言高级：并发控制' },
            { text: '16.Go语言高级：并发模式与安全', link: '/article/golang/core/16.Go语言高级：并发模式与安全' },
            { text: '17.Go语言高级：高级并发', link: '/article/golang/core/17.Go语言高级：高级并发' },
            { text: '18.Go语言高级：反射', link: '/article/golang/core/18.Go语言高级：反射' }
          ]
        }
      ],

      '/article/golang/gin/': [
        {
          text: 'Gin框架教程',
          link: '/article/golang/gin/',
          items: [
            { text: '1.Gin入门：快速开始', link: '/article/golang/gin/1.Gin入门：快速开始' },
            { text: '2.Gin基础：请求与响应', link: '/article/golang/gin/2.Gin基础：请求与响应' },
            { text: '3.Gin进阶：中间件与路由组', link: '/article/golang/gin/3.Gin进阶：中间件与路由组' },
            { text: '4.Gin实践：数据绑定与验证', link: '/article/golang/gin/4.Gin实践：数据绑定与验证' },
            { text: '5.Gin高级：项目结构与最佳实践', link: '/article/golang/gin/5.Gin高级：项目结构与最佳实践' }
          ]
        }
      ],

      '/article/golang/gorm/': [
        {
          text: 'GORM教程',
          link: '/article/golang/gorm/',
          items: [
            { text: '1.GORM入门：快速开始', link: '/article/golang/gorm/1.GORM入门：快速开始' },
            { text: '2.GORM基础：模型定义', link: '/article/golang/gorm/2.GORM基础：模型定义' },
            { text: '3.GORM基础：CRUD操作', link: '/article/golang/gorm/3.GORM基础：CRUD操作' },
            { text: '4.GORM进阶：查询和条件', link: '/article/golang/gorm/4.GORM进阶：查询和条件' },
            { text: '5.GORM进阶：关联和预加载', link: '/article/golang/gorm/5.GORM进阶：关联和预加载' },
            { text: '6.GORM高级：事务处理', link: '/article/golang/gorm/6.GORM高级：事务处理' },
            { text: '7.GORM高级：钩子函数', link: '/article/golang/gorm/7.GORM高级：钩子函数' },
            { text: '8.GORM精通：高级特性', link: '/article/golang/gorm/8.GORM精通：高级特性' },
            { text: '9.GORM实践：最佳实践和项目结构', link: '/article/golang/gorm/9.GORM实践：最佳实践和项目结构' }
          ]
        }
      ],

      '/article/golang/kratos/': [
        {
          text: 'Kratos框架教程',
          link: '/article/golang/kratos/',
          items: [
            { text: '1.Kratos入门：快速开始', link: '/article/golang/kratos/1.Kratos入门：快速开始' },
            { text: '2.Kratos基础：HTTP服务', link: '/article/golang/kratos/2.Kratos基础：HTTP服务' },
            { text: '3.Kratos进阶：数据访问层', link: '/article/golang/kratos/3.Kratos进阶：数据访问层' },
            { text: '4.Kratos实践：业务逻辑层', link: '/article/golang/kratos/4.Kratos实践：业务逻辑层' },
            { text: '5.Kratos高级：微服务架构', link: '/article/golang/kratos/5.Kratos高级：微服务架构' }
          ]
        }
      ],

      '/article/nginx/': [
        {
          text: 'Nginx教程',
          link: '/article/nginx/',
          items: [
            { text: '1.Nginx入门：快速开始', link: '/article/nginx/1.Nginx入门：快速开始' },
            { text: '2.Nginx基础：配置文件详解', link: '/article/nginx/2.Nginx基础：配置文件详解' },
            { text: '3.Nginx基础：虚拟主机配置', link: '/article/nginx/3.Nginx基础：虚拟主机配置' },
            { text: '4.Nginx进阶：反向代理', link: '/article/nginx/4.Nginx进阶：反向代理' },
            { text: '5.Nginx进阶：静态资源服务', link: '/article/nginx/5.Nginx进阶：静态资源服务' },
            { text: '6.Nginx进阶：SSL-TLS配置', link: '/article/nginx/6.Nginx进阶：SSL-TLS配置' },
            { text: '7.Nginx高级：日志管理', link: '/article/nginx/7.Nginx高级：日志管理' },
            { text: '8.Nginx高级：性能优化', link: '/article/nginx/8.Nginx高级：性能优化' },
            { text: '9.Nginx高级：安全配置', link: '/article/nginx/9.Nginx高级：安全配置' },
            { text: '10.Nginx实践：常见场景配置', link: '/article/nginx/10.Nginx实践：常见场景配置' }
          ]
        }
      ],

      '/article/network/': [
        {
          text: '网络问题',
          link: '/article/network/',
          items: [
            { text: '1.IP地址基础', link: '/article/network/1.IP地址基础' },
            { text: '2.局域网和公网IP', link: '/article/network/2.局域网和公网IP' },
            { text: '3.特殊IP地址', link: '/article/network/3.特殊IP地址' },
            { text: '4.子网掩码和CIDR', link: '/article/network/4.子网掩码和CIDR' },
            { text: '5.DHCP动态主机配置', link: '/article/network/5.DHCP动态主机配置' },
            { text: '6.网络配置实践', link: '/article/network/6.网络配置实践' },
            { text: '7.网络问题解答', link: '/article/network/7.网络问题解答' }
          ]
        }
      ],

      '/article/question/': [
        {
          text: '日常问题',
          link: '/article/question/',
          items: [
            { text: '5笔输入法教程：从入门到精通', link: '/article/question/5笔输入法教程：从入门到精通' },
            { text: 'Git 多域名 SSH 配置', link: '/article/question/git多域名ssh配置' },
            { text: '学车教程', link: '/article/question/学车教程/开车小技巧/' }
          ]
        }
      ]
    }
  },
})
