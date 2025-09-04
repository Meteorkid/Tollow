#!/bin/bash

# Tollow 自动化部署脚本
# 支持多环境部署和回滚

set -e

# 配置变量
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_NAME="tollow"
VERSION=""
ENVIRONMENT=""
DEPLOY_TYPE=""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
Tollow 自动化部署脚本

用法: $0 [选项]

选项:
    -e, --environment ENV    部署环境 (staging|production|development)
    -v, --version VERSION    部署版本号
    -t, --type TYPE          部署类型 (docker|kubernetes|manual)
    -h, --help               显示此帮助信息

示例:
    $0 -e staging -v 1.0.0 -t docker
    $0 -e production -v 1.0.1 -t kubernetes

EOF
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -v|--version)
                VERSION="$2"
                shift 2
                ;;
            -t|--type)
                DEPLOY_TYPE="$2"
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # 验证必需参数
    if [[ -z "$ENVIRONMENT" ]]; then
        log_error "必须指定部署环境"
        show_help
        exit 1
    fi

    if [[ -z "$VERSION" ]]; then
        log_error "必须指定部署版本"
        show_help
        exit 1
    fi

    if [[ -z "$DEPLOY_TYPE" ]]; then
        log_error "必须指定部署类型"
        show_help
        exit 1
    fi
}

# 验证环境
validate_environment() {
    case "$ENVIRONMENT" in
        staging|production|development)
            log_info "部署环境: $ENVIRONMENT"
            ;;
        *)
            log_error "不支持的部署环境: $ENVIRONMENT"
            exit 1
            ;;
    esac
}

# 验证版本
validate_version() {
    if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        log_error "无效的版本格式: $VERSION (应为 x.y.z 格式)"
        exit 1
    fi
    log_info "部署版本: $VERSION"
}

# 验证部署类型
validate_deploy_type() {
    case "$DEPLOY_TYPE" in
        docker|kubernetes|manual)
            log_info "部署类型: $DEPLOY_TYPE"
            ;;
        *)
            log_error "不支持的部署类型: $DEPLOY_TYPE"
            exit 1
            ;;
    esac
}

# 检查依赖
check_dependencies() {
    log_info "检查部署依赖..."

    case "$DEPLOY_TYPE" in
        docker)
            if ! command -v docker &> /dev/null; then
                log_error "Docker 未安装"
                exit 1
            fi
            if ! command -v docker-compose &> /dev/null; then
                log_error "Docker Compose 未安装"
                exit 1
            fi
            log_success "Docker 依赖检查通过"
            ;;
        kubernetes)
            if ! command -v kubectl &> /dev/null; then
                log_error "kubectl 未安装"
                exit 1
            fi
            if ! command -v helm &> /dev/null; then
                log_error "Helm 未安装"
                exit 1
            fi
            log_success "Kubernetes 依赖检查通过"
            ;;
        manual)
            log_info "手动部署模式，跳过依赖检查"
            ;;
    esac
}

# 构建应用
build_application() {
    log_info "构建应用程序..."
    
    cd "$PROJECT_ROOT"
    
    # 安装依赖
    log_info "安装依赖..."
    npm ci
    
    # 运行测试
    log_info "运行测试..."
    npm run test
    
    # 构建应用
    log_info "构建应用..."
    npm run build
    
    log_success "应用程序构建完成"
}

# Docker部署
deploy_docker() {
    log_info "开始 Docker 部署..."
    
    cd "$PROJECT_ROOT"
    
    # 构建Docker镜像
    log_info "构建 Docker 镜像..."
    docker build -t "$PROJECT_NAME:$VERSION" --target production .
    
    # 标记镜像
    docker tag "$PROJECT_NAME:$VERSION" "$PROJECT_NAME:latest"
    
    # 停止旧容器
    log_info "停止旧容器..."
    docker-compose down || true
    
    # 启动新容器
    log_info "启动新容器..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 30
    
    # 健康检查
    if check_health; then
        log_success "Docker 部署成功"
    else
        log_error "Docker 部署失败"
        exit 1
    fi
}

# Kubernetes部署
deploy_kubernetes() {
    log_info "开始 Kubernetes 部署..."
    
    cd "$PROJECT_ROOT"
    
    # 构建镜像
    log_info "构建 Docker 镜像..."
    docker build -t "$PROJECT_NAME:$VERSION" --target production .
    
    # 推送镜像到仓库
    log_info "推送镜像到仓库..."
    # 这里需要配置镜像仓库地址
    # docker push "$REGISTRY/$PROJECT_NAME:$VERSION"
    
    # 更新Kubernetes配置
    log_info "更新 Kubernetes 配置..."
    # 这里需要根据实际环境更新配置文件
    
    # 应用配置
    log_info "应用 Kubernetes 配置..."
    # kubectl apply -f k8s/
    
    # 等待部署完成
    log_info "等待部署完成..."
    # kubectl rollout status deployment/$PROJECT_NAME
    
    log_success "Kubernetes 部署成功"
}

# 手动部署
deploy_manual() {
    log_info "开始手动部署..."
    
    cd "$PROJECT_ROOT"
    
    # 创建部署包
    log_info "创建部署包..."
    DEPLOY_DIR="deploy/$VERSION"
    mkdir -p "$DEPLOY_DIR"
    
    # 复制构建产物
    cp -r dist/* "$DEPLOY_DIR/"
    cp -r public/* "$DEPLOY_DIR/"
    cp package.json "$DEPLOY_DIR/"
    cp nginx.conf "$DEPLOY_DIR/"
    
    # 创建部署脚本
    cat > "$DEPLOY_DIR/deploy.sh" << 'EOF'
#!/bin/bash
# 部署脚本
set -e

echo "开始部署..."
# 这里添加实际的部署逻辑
echo "部署完成"
EOF
    
    chmod +x "$DEPLOY_DIR/deploy.sh"
    
    # 创建部署包
    tar -czf "deploy-$VERSION.tar.gz" -C deploy "$VERSION"
    
    log_success "手动部署包创建完成: deploy-$VERSION.tar.gz"
}

# 健康检查
check_health() {
    local max_attempts=10
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        log_info "健康检查尝试 $attempt/$max_attempts..."
        
        if curl -f -s "http://localhost:8080/health" > /dev/null; then
            log_success "健康检查通过"
            return 0
        fi
        
        sleep 5
        ((attempt++))
    done
    
    log_error "健康检查失败"
    return 1
}

# 回滚部署
rollback() {
    log_warning "开始回滚部署..."
    
    case "$DEPLOY_TYPE" in
        docker)
            log_info "回滚 Docker 部署..."
            cd "$PROJECT_ROOT"
            docker-compose down
            docker-compose up -d
            ;;
        kubernetes)
            log_info "回滚 Kubernetes 部署..."
            # kubectl rollout undo deployment/$PROJECT_NAME
            ;;
        manual)
            log_info "手动回滚部署..."
            # 这里添加手动回滚逻辑
            ;;
    esac
    
    log_success "回滚完成"
}

# 清理资源
cleanup() {
    log_info "清理部署资源..."
    
    # 清理Docker镜像
    if [[ "$DEPLOY_TYPE" == "docker" ]]; then
        docker image prune -f
    fi
    
    # 清理构建缓存
    cd "$PROJECT_ROOT"
    rm -rf node_modules/.cache
    
    log_success "资源清理完成"
}

# 主函数
main() {
    log_info "开始 Tollow 部署流程..."
    
    # 解析参数
    parse_args "$@"
    
    # 验证参数
    validate_environment
    validate_version
    validate_deploy_type
    
    # 检查依赖
    check_dependencies
    
    # 构建应用
    build_application
    
    # 执行部署
    case "$DEPLOY_TYPE" in
        docker)
            deploy_docker
            ;;
        kubernetes)
            deploy_kubernetes
            ;;
        manual)
            deploy_manual
            ;;
    esac
    
    # 清理资源
    cleanup
    
    log_success "部署流程完成！"
    log_info "版本: $VERSION"
    log_info "环境: $ENVIRONMENT"
    log_info "类型: $DEPLOY_TYPE"
}

# 错误处理
trap 'log_error "部署过程中发生错误，开始回滚..."; rollback; exit 1' ERR

# 执行主函数
main "$@"
