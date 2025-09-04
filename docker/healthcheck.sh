#!/bin/sh

# Docker健康检查脚本
# 检查应用是否正常运行

# 设置超时时间
TIMEOUT=5

# 检查应用健康状态
check_health() {
    # 尝试访问健康检查端点
    if command -v curl >/dev/null 2>&1; then
        # 使用curl检查
        response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT http://localhost:8080/health 2>/dev/null)
        if [ "$response" = "200" ]; then
            return 0
        fi
    elif command -v wget >/dev/null 2>&1; then
        # 使用wget检查
        response=$(wget --timeout=$TIMEOUT --spider -S http://localhost:8080/health 2>&1 | grep "HTTP/" | tail -1 | cut -d' ' -f2)
        if [ "$response" = "200" ]; then
            return 0
        fi
    else
        # 使用netcat检查端口是否开放
        if nc -z localhost 8080 2>/dev/null; then
            return 0
        fi
    fi
    
    return 1
}

# 检查进程状态
check_process() {
    # 检查nginx进程是否运行
    if pgrep nginx >/dev/null 2>&1; then
        return 0
    fi
    
    return 1
}

# 检查资源使用
check_resources() {
    # 检查磁盘空间
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 90 ]; then
        echo "磁盘使用率过高: ${disk_usage}%"
        return 1
    fi
    
    # 检查内存使用
    if [ -f /proc/meminfo ]; then
        mem_total=$(grep MemTotal /proc/meminfo | awk '{print $2}')
        mem_available=$(grep MemAvailable /proc/meminfo | awk '{print $2}')
        if [ -n "$mem_total" ] && [ -n "$mem_available" ]; then
            mem_usage=$((100 - (mem_available * 100 / mem_total)))
            if [ "$mem_usage" -gt 90 ]; then
                echo "内存使用率过高: ${mem_usage}%"
                return 1
            fi
        fi
    fi
    
    return 0
}

# 主检查函数
main() {
    # 检查进程状态
    if ! check_process; then
        echo "应用进程未运行"
        exit 1
    fi
    
    # 检查应用健康状态
    if ! check_health; then
        echo "应用健康检查失败"
        exit 1
    fi
    
    # 检查资源使用
    if ! check_resources; then
        echo "资源使用检查失败"
        exit 1
    fi
    
    echo "应用运行正常"
    exit 0
}

# 执行主检查
main
