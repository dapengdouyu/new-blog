---
title: Git 多域名 SSH 配置教程
date: 2026-01-17
description: 配置 Git 同时支持 gitee、gitlab、github 的 SSH 密钥管理
---

# Git 多域名 SSH 配置教程

本教程详细介绍如何配置 Git 同时支持多个 Git 平台的 SSH 密钥，包括 gitee、gitlab、github。

## 为什么需要多域名配置

在实际开发中，我们可能需要同时使用多个 Git 平台：
- **GitHub**：全球最大的开源代码托管平台
- **Gitee**：国内常用的代码托管平台
- **GitLab**：企业常用的自托管或云托管平台

每个平台需要不同的 SSH 密钥，通过配置 SSH config 文件可以方便地管理多个平台的密钥。

## 配置步骤

### 第一步：生成多个 SSH 密钥

为每个平台生成独立的 SSH 密钥：

#### 1.1 生成 GitHub 密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/github_id_ed25519
```

#### 1.2 生成 Gitee 密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/gitee_id_ed25519
```

#### 1.3 生成 GitLab 密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/gitlab_id_ed25519
```

**说明**：
- `-t ed25519`：使用 ed25519 算法（推荐，更安全更快速）
- `-C`：添加注释（通常是邮箱）
- `-f`：指定密钥文件名
- 执行命令时会提示输入密码，可以直接回车跳过

### 第二步：配置 SSH Config 文件

#### 2.1 创建或编辑 SSH config 文件

```bash
vim ~/.ssh/config
```

#### 2.2 添加以下配置内容

```ssh
# GitHub 配置
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_id_ed25519
    IdentitiesOnly yes

# Gitee 配置
Host gitee.com
    HostName gitee.com
    User git
    IdentityFile ~/.ssh/gitee_id_ed25519
    IdentitiesOnly yes

# GitLab 配置
Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/gitlab_id_ed25519
    IdentitiesOnly yes

# 如果有自定义 GitLab 域名（如公司内部）
Host gitlab.company.com
    HostName gitlab.company.com
    User git
    IdentityFile ~/.ssh/gitlab_id_ed25519
    IdentitiesOnly yes
```

**配置参数说明**：
- `Host`：别名，可以是任意名称，通常使用域名
- `HostName`：实际的主机名（域名或 IP）
- `User`：Git 用户名，通常固定为 `git`
- `IdentityFile`：私钥文件路径
- `IdentitiesOnly yes`：只使用指定的 IdentityFile，避免使用默认密钥

#### 2.3 设置文件权限

```bash
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/*_id_ed25519
chmod 644 ~/.ssh/*_id_ed25519.pub
```

### 第三步：添加公钥到各平台

#### 3.1 查看公钥内容

```bash
# GitHub 公钥
cat ~/.ssh/github_id_ed25519.pub

# Gitee 公钥
cat ~/.ssh/gitee_id_ed25519.pub

# GitLab 公钥
cat ~/.ssh/gitlab_id_ed25519.pub
```

#### 3.2 添加公钥到 GitHub

1. 访问 [GitHub SSH Keys 设置页面](https://github.com/settings/keys)
2. 点击 "New SSH key"
3. 输入 Title（如 "My MacBook"）
4. 粘贴 `github_id_ed25519.pub` 的内容
5. 点击 "Add SSH key"

#### 3.3 添加公钥到 Gitee

1. 访问 [Gitee SSH 公钥设置页面](https://gitee.com/profile/sshkeys)
2. 点击 "添加公钥"
3. 输入标题
4. 粘贴 `gitee_id_ed25519.pub` 的内容
5. 点击 "确定"

#### 3.4 添加公钥到 GitLab

1. 访问 [GitLab SSH Keys 设置页面](https://gitlab.com/-/profile/keys)
2. 点击 "Add new key"
3. 输入 Title
4. 粘贴 `gitlab_id_ed25519.pub` 的内容
5. 点击 "Add key"

### 第四步：测试 SSH 连接

#### 4.1 测试 GitHub 连接

```bash
ssh -T git@github.com
```

成功输出：
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

#### 4.2 测试 Gitee 连接

```bash
ssh -T git@gitee.com
```

成功输出：
```
Hi username! You've successfully authenticated, but GITEE does not provide shell access.
```

#### 4.3 测试 GitLab 连接

```bash
ssh -T git@gitlab.com
```

成功输出：
```
Welcome to GitLab, @username!
```

## 使用方式

### 克隆仓库

#### 方式一：使用原始域名（推荐）

```bash
# GitHub
git clone git@github.com:username/repo.git

# Gitee
git clone git@gitee.com:username/repo.git

# GitLab
git clone git@gitlab.com:username/repo.git
```

#### 方式二：使用自定义别名

如果 SSH config 中配置了不同的 Host 别名：

```bash
# 使用别名
git clone git@my-github:username/repo.git
git clone git@my-gitee:username/repo.git
git clone git@my-gitlab:username/repo.git
```

### 修改现有仓库的远程地址

如果仓库已经使用 HTTPS 克隆，可以切换到 SSH：

```bash
# 查看当前远程地址
git remote -v

# 修改为 SSH 地址
git remote set-url origin git@github.com:username/repo.git

# 验证修改
git remote -v
```

### 多平台同步

如果需要将同一项目推送到多个平台：

```bash
# 添加多个远程仓库
git remote add github git@github.com:username/repo.git
git remote add gitee git@gitee.com:username/repo.git
git remote add gitlab git@gitlab.com:username/repo.git

# 推送到所有平台
git push github main
git push gitee main
git push gitlab main
```

或者使用 `git remote add` 添加多个 push URL：

```bash
# 添加多个 push URL
git remote set-url --add --push origin git@github.com:username/repo.git
git remote set-url --add --push origin git@gitee.com:username/repo.git
git remote set-url --add --push origin git@gitlab.com:username/repo.git

# 一次推送到所有平台
git push origin main
```

## 常见问题

### 问题 1：SSH 连接超时

**症状**：`ssh -T git@github.com` 命令长时间无响应

**解决方案**：

1. 检查网络连接
2. 尝试使用代理（如果在国内）：
   ```bash
   # 编辑 SSH config
   Host github.com
       ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
   ```
3. 检查防火墙设置

### 问题 2：Permission denied (publickey)

**症状**：`Permission denied (publickey)` 错误

**解决方案**：

1. 检查私钥文件权限：
   ```bash
   chmod 600 ~/.ssh/*_id_ed25519
   ```
2. 确认公钥已正确添加到平台
3. 检查 SSH config 配置是否正确
4. 启用详细日志调试：
   ```bash
   ssh -Tv git@github.com
   ```

### 问题 3：多个密钥冲突

**症状**：SSH 尝试使用错误的密钥

**解决方案**：

确保 SSH config 中每个 Host 都有 `IdentitiesOnly yes` 配置：

```ssh
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_id_ed25519
    IdentitiesOnly yes  # 重要：只使用指定的密钥
```

### 问题 4：Git 仍然询问密码

**症状**：每次 push 都要求输入密码

**解决方案**：

1. 确认使用的是 SSH 地址而不是 HTTPS
2. 检查 Git 配置：
   ```bash
   git config --global credential.helper
   ```
3. 如果使用 HTTPS，可以配置凭据缓存：
   ```bash
   git config --global credential.helper 'cache --timeout=3600'
   ```

### 问题 5：密钥算法不兼容

**症状**：某些平台不支持 ed25519

**解决方案**：

使用 RSA 算法生成密钥：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/github_id_rsa
```

## 高级配置

### 使用 SSH Agent 管理密钥

如果不想每次都输入密钥密码，可以使用 SSH Agent：

```bash
# 启动 SSH Agent
eval "$(ssh-agent -s)"

# 添加密钥
ssh-add ~/.ssh/github_id_ed25519
ssh-add ~/.ssh/gitee_id_ed25519
ssh-add ~/.ssh/gitlab_id_ed25519

# 查看已添加的密钥
ssh-add -l

# 删除所有密钥
ssh-add -D
```

### 配置 SSH Agent 自动启动

在 `~/.zshrc` 或 `~/.bash_profile` 中添加：

```bash
# SSH Agent 自动启动
if ! pgrep -x "ssh-agent" > /dev/null; then
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/github_id_ed25519
    ssh-add ~/.ssh/gitee_id_ed25519
    ssh-add ~/.ssh/gitlab_id_ed25519
fi
```

### 为不同仓库使用不同的用户

如果不同平台使用不同的 Git 用户：

```bash
# 全局配置
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"

# 为特定仓库配置
cd /path/to/github/repo
git config user.name "GitHub Name"
git config user.email "github_email@example.com"

cd /path/to/gitee/repo
git config user.name "Gitee Name"
git config user.email "gitee_email@example.com"
```

## 安全建议

1. **使用强密码**：为 SSH 密钥设置强密码
2. **定期更换密钥**：建议每 6-12 个月更换一次密钥
3. **限制密钥权限**：确保私钥文件权限为 600
4. **使用硬件密钥**：考虑使用 YubiKey 等硬件密钥
5. **监控使用情况**：定期检查各平台的 SSH 密钥使用记录

## 总结

通过配置 SSH config 文件，我们可以方便地管理多个 Git 平台的 SSH 密钥。主要步骤包括：

1. ✅ 为每个平台生成独立的 SSH 密钥
2. ✅ 配置 `~/.ssh/config` 文件
3. ✅ 将公钥添加到各平台
4. ✅ 测试 SSH 连接
5. ✅ 使用 SSH 地址进行 Git 操作

这种配置方式的优势：
- **安全性高**：每个平台使用独立密钥
- **管理方便**：通过 config 文件统一管理
- **操作简单**：无需手动指定密钥文件
- **易于扩展**：添加新平台只需生成密钥和修改配置

## 参考资源

- [GitHub SSH Keys 官方文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)
- [Gitee SSH 公钥设置](https://gitee.com/help/articles/4191)
- [GitLab SSH Keys 官方文档](https://docs.gitlab.com/ee/user/ssh.html)
- [SSH Config 手册](https://man.openbsd.org/ssh_config)
