---
title: 如何为 Windows 子系统 Linux (WSL) 配置代理
date: 2025-11-03
updated: 2025-11-03
categories: WSL
tags:
  - WSL
  - V2RAY
  - PROXY
  - 网络
---

本文将为您详细讲解如何为 Windows 子系统 Linux (WSL) 配置代理，使其能够顺畅地使用运行在 Windows 主机上的代理软件（如 Clash、V2Ray 等）访问网络。

---

### 理解基础：WSL2 的网络模式

在开始配置之前，理解 WSL2 的网络工作原理至关重要，这与早期的 WSL1 有根本不同。

•   WSL1：与 Windows 共享网络端口，Linux 子系统可以直接通过 127.0.0.1 访问 Windows 上的服务 。

•   WSL2：基于 Hyper-V 虚拟机技术，拥有独立的虚拟网络。因此，WSL2 和 Windows 宿主机会有各自独立的 IP 地址，WSL2 需要通过网络地址转换 (NAT) 经由 Windows 主机访问外部网络 。这意味着，WSL2 无法直接使用 localhost 或 127.0.0.1 来访问 Windows 上的代理服务 。

因此，配置的核心思路是：让 WSL2 中的流量指向 Windows 主机在虚拟网络中的那个固定 IP 地址。

### 第一步：在 Windows 端配置代理软件

要让 WSL2 能够连接，您的 Windows 代理软件必须允许来自局域网的连接。

1.  打开您使用的代理软件（例如 Clash for Windows、V2RayN 等）。
2.  进入设置 (Settings) 或参数设置 (Preferences)。
3.  找到并开启 “允许来自局域网的连接” (Allow LAN connections / Allow connections from LAN) 选项 。
4.  记下代理软件使用的端口号，例如 HTTP/HTTPS 代理常用的 7890 端口，或 SOCKS5 代理常用的 10808、1080 等端口 。

注：如果配置后连接失败，可能需要检查 Windows 防火墙设置，确保相应端口对 WSL 虚拟网络开放 。

### 第二步：获取 Windows 主机的 IP 地址

在 WSL2 中，有多种方法可以获取到 Windows 主机的 IP 地址。推荐以下方法：

``` bash
export hostip=$(ip route show | grep default | awk '{print $3}')
```

### 第三步：在 WSL 中设置代理环境变量

获取到 Windows 主机的 IP 和代理端口后，就可以在 WSL 中设置代理了。请根据您的代理协议类型选择相应的命令。

1. 为 HTTP/HTTPS 流量设置代理

如果您的代理软件提供的是 HTTP 代理（常见端口如 V2ray为 10809）：
```bash
export http_proxy="http://$hostip:10809"
export https_proxy="http://$hostip:10809"
```


2. 为 SOCKS5 流量设置代理

如果您的代理软件提供的是 SOCKS5 代理（常见端口如 10808）：
```bash
export ALL_PROXY="socks5://$hostip:10808"
export all_proxy="socks5://$hostip:10808"
```
- 通常也建议同时设置 http_proxy 和 https_proxy 变量
```bash
export http_proxy="socks5://$hostip:10808"
export https_proxy="socks5://$hostip:10808"
```


3. 为特定工具配置代理

某些工具有自己的代理配置，需要单独设置。

•   配置 Git 代理

    如果使用 git clone 时速度慢，可以为 Git 单独配置代理：
    # 为 HTTP/HTTPS 协议的仓库地址设置代理
    git config --global http.proxy http://$hostip:7890
    git config --global https.proxy http://$hostip:7890
    
    # 或者仅为 GitHub 设置，不影响其他国内仓库
    git config --global http.https://github.com.proxy socks5://$hostip:10808


重要提示：以上通过 export 设置的环境变量仅在当前终端会话有效。关闭终端后需要重新设置。

### 第四步：设置为永久配置（可选）

若希望每次打开 WSL 终端都自动启用代理，可将配置添加到 Shell 的配置文件中（如 ~/.bashrc 或 ~/.zshrc）。

1.  使用文本编辑器打开配置文件：
    vim ~/.bashrc  # 如果使用 Bash
    #### 或
    vim ~/.zshrc   # 如果使用 Zsh
    

2.  在文件末尾添加以下内容。这里推荐使用函数别名，可以灵活地开启和关闭代理 ：
   ```bash
        # 获取 Windows 主机 IP
        export hostip=$(ip route show | grep default | awk '{print $3}')
        
        # 设置代理开/关别名 (以 SOCKS5 端口 10808 为例)
        alias proxy='
          export HTTP_PROXY="socks5h://${hostip}:10808"
          export HTTPS_PROXY="socks5h://${hostip}:10808"
          export ALL_PROXY="socks5h://${hostip}:10808"
          git config --global http.https://github.com.proxy socks5://$hostip:10808
          echo -e "Proxy enabled."
        '
        alias unproxy='
          unset HTTP_PROXY HTTPS_PROXY ALL_PROXY
          git config --global --unset http.https://github.com.proxy
          echo -e "Proxy disabled."
        '
```

3.  保存文件后，执行以下命令使配置立即生效：
    source ~/.bashrc
    

4. 为 SSH 协议设置代理
如果您使用 git@开头的仓库地址（SSH 协议），则需要配置 SSH 代理。
编辑或创建 SSH 配置文件 ~/.ssh/config：
```bash
vim ~/.ssh/config
```
添加以下内容，将 $hostip和 7891替换为您自己的代理地址和 SOCKS5 端口：
```bash
Host github.com
    User git
    # 使用 SOCKS5 代理，-x 参数后为代理地址
    ProxyCommand nc -v -x $hostip:10808 %h %p
```

之后，在终端中只需输入 proxy 即可开启代理，输入 unproxy 即可关闭，非常方便。

### 第五步：测试代理是否生效

1.  开启代理：在终端中输入 proxy（如果您使用了上面的别名设置）或手动执行 export 命令。
2.  测试连接：使用 curl 命令测试访问：
    curl -I https://www.google.com
    
    如果返回 HTTP 状态码（如 200 OK），说明代理成功 。
3.  查看 IP 地址：验证公网 IP 是否已变为代理服务器的 IP：
    curl ip.sb
    
    如果显示的是代理服务器所在地的 IP 地址，则配置成功。

⚠️ 故障排除

•   连接被拒绝：请返回第一步，确认代理软件已运行并开启了“允许局域网连接”。同时检查端口号是否正确 。

•   能 ping 通但打不开网页：可能是 DNS 解析问题。尝试 ping 一个域名看是否能解析。可以尝试更换 WSL 内的 DNS 服务器（如 8.8.8.8）。

•   注意：ping 命令使用 ICMP 协议，不走 HTTP/HTTPS/SOCKS 代理，因此 ping 测试不能作为代理是否成功的依据 。



希望这篇教程能帮助您顺利完成 WSL 的代理配置！