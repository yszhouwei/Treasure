-- Treasure 数据库表结构设计
-- 数据库: treasurex
-- 创建时间: 2025-01-XX

-- 1. 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `bio` TEXT DEFAULT NULL COMMENT '个人简介',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
  `is_team_leader` TINYINT DEFAULT 0 COMMENT '是否团队长：0-否，1-是',
  `role` VARCHAR(20) DEFAULT 'user' COMMENT '用户角色：user-普通用户，team_leader-团队长，admin-管理员',
  `team_id` INT UNSIGNED DEFAULT NULL COMMENT '所属团队ID',
  `invite_code` VARCHAR(20) DEFAULT NULL COMMENT '邀请码',
  `invited_by` INT UNSIGNED DEFAULT NULL COMMENT '邀请人ID',
  `balance` DECIMAL(10,2) DEFAULT 0.00 COMMENT '账户余额',
  `points` INT UNSIGNED DEFAULT 0 COMMENT '积分',
  `level` INT UNSIGNED DEFAULT 1 COMMENT '用户等级',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_invite_code` (`invite_code`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_invited_by` (`invited_by`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 团队表
CREATE TABLE IF NOT EXISTS `teams` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '团队ID',
  `name` VARCHAR(100) NOT NULL COMMENT '团队名称',
  `leader_id` INT UNSIGNED NOT NULL COMMENT '团队长ID',
  `group_size` INT UNSIGNED NOT NULL COMMENT '团队规模：10/20/50/100',
  `description` TEXT DEFAULT NULL COMMENT '团队描述',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图片',
  `region` VARCHAR(100) DEFAULT NULL COMMENT '覆盖区域',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
  `total_members` INT UNSIGNED DEFAULT 0 COMMENT '总成员数',
  `active_members` INT UNSIGNED DEFAULT 0 COMMENT '活跃成员数',
  `total_sales` DECIMAL(12,2) DEFAULT 0.00 COMMENT '总销售额',
  `total_orders` INT UNSIGNED DEFAULT 0 COMMENT '总订单数',
  `auto_approve` TINYINT DEFAULT 1 COMMENT '自动审核成员：0-关闭，1-开启',
  `notification_enabled` TINYINT DEFAULT 1 COMMENT '消息通知：0-关闭，1-开启',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_leader_id` (`leader_id`),
  KEY `idx_status` (`status`),
  KEY `idx_group_size` (`group_size`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='团队表';

-- 3. 商品表
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `description` TEXT DEFAULT NULL COMMENT '商品描述',
  `category_id` INT UNSIGNED DEFAULT NULL COMMENT '分类ID',
  `image_url` VARCHAR(255) DEFAULT NULL COMMENT '主图URL',
  `images` TEXT DEFAULT NULL COMMENT '商品图片（JSON数组）',
  `original_price` DECIMAL(10,2) NOT NULL COMMENT '原价',
  `group_price` DECIMAL(10,2) NOT NULL COMMENT '团购价',
  `stock` INT UNSIGNED DEFAULT 0 COMMENT '库存',
  `sales_count` INT UNSIGNED DEFAULT 0 COMMENT '销量',
  `view_count` INT UNSIGNED DEFAULT 0 COMMENT '浏览量',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
  `is_hot` TINYINT DEFAULT 0 COMMENT '是否热门：0-否，1-是',
  `is_recommend` TINYINT DEFAULT 0 COMMENT '是否推荐：0-否，1-是',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `specifications` TEXT DEFAULT NULL COMMENT '规格（JSON）',
  `warranty` VARCHAR(100) DEFAULT NULL COMMENT '保修信息',
  `winner_count` INT UNSIGNED DEFAULT 1 COMMENT '中奖数量（平台设定）',
  `dividend_rate` DECIMAL(5,2) DEFAULT 5.00 COMMENT '分红比例（平台设定，单位：%）',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_is_hot` (`is_hot`),
  KEY `idx_is_recommend` (`is_recommend`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 4. 商品分类表
CREATE TABLE IF NOT EXISTS `product_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '父分类ID',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '图标',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- 5. 订单表
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单号',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `team_id` INT UNSIGNED DEFAULT NULL COMMENT '团队ID',
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `product_image` VARCHAR(255) DEFAULT NULL COMMENT '商品图片',
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '数量',
  `unit_price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '总金额',
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  `actual_amount` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-待支付，1-已支付，2-已发货，3-已完成，4-已取消，5-已退款',
  `payment_method` VARCHAR(20) DEFAULT NULL COMMENT '支付方式：wechat/alipay/bank',
  `payment_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `shipping_address` TEXT DEFAULT NULL COMMENT '收货地址（JSON）',
  `shipping_company` VARCHAR(50) DEFAULT NULL COMMENT '物流公司',
  `shipping_no` VARCHAR(50) DEFAULT NULL COMMENT '物流单号',
  `shipping_time` DATETIME DEFAULT NULL COMMENT '发货时间',
  `completed_time` DATETIME DEFAULT NULL COMMENT '完成时间',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 6. 支付记录表
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '支付ID',
  `payment_no` VARCHAR(50) NOT NULL COMMENT '支付单号',
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单号',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `payment_method` VARCHAR(20) NOT NULL COMMENT '支付方式：wechat/alipay/bank',
  `payment_channel` VARCHAR(50) DEFAULT NULL COMMENT '支付通道',
  `third_party_no` VARCHAR(100) DEFAULT NULL COMMENT '第三方支付单号',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-待支付，1-支付成功，2-支付失败，3-已退款',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `refund_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '退款金额',
  `refund_time` DATETIME DEFAULT NULL COMMENT '退款时间',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payment_no` (`payment_no`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- 7. 团购活动表
CREATE TABLE IF NOT EXISTS `group_buying` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '团购ID',
  `group_no` VARCHAR(50) NOT NULL COMMENT '团购编号',
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `team_id` INT UNSIGNED NOT NULL COMMENT '团队ID',
  `leader_id` INT UNSIGNED NOT NULL COMMENT '团队长ID',
  `group_size` INT UNSIGNED NOT NULL COMMENT '成团人数：10/20/50/100',
  `current_members` INT UNSIGNED DEFAULT 0 COMMENT '当前参团人数',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-待启动，1-进行中，2-已成团，3-已失败，4-已结束',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `success_time` DATETIME DEFAULT NULL COMMENT '成团时间',
  `progress` INT DEFAULT 0 COMMENT '进度百分比',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_no` (`group_no`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_team_id` (`team_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='团购活动表';

-- 8. 团购参与记录表
CREATE TABLE IF NOT EXISTS `group_participants` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '参与ID',
  `group_id` INT UNSIGNED NOT NULL COMMENT '团购ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '参与时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_user` (`group_id`, `user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='团购参与记录表';

-- 9. 开奖记录表
CREATE TABLE IF NOT EXISTS `lottery_records` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '开奖ID',
  `group_id` INT UNSIGNED NOT NULL COMMENT '团购ID',
  `product_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `winner_count` INT UNSIGNED DEFAULT 1 COMMENT '中奖数量（平台设定）',
  `lottery_time` DATETIME DEFAULT NULL COMMENT '开奖时间',
  `lottery_method` VARCHAR(50) DEFAULT NULL COMMENT '开奖方式',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-未开奖，1-已开奖',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='开奖记录表';

-- 9.1 中奖者表
CREATE TABLE IF NOT EXISTS `lottery_winners` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `lottery_id` INT UNSIGNED NOT NULL COMMENT '开奖ID',
  `winner_id` INT UNSIGNED NOT NULL COMMENT '中奖用户ID',
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_lottery_id` (`lottery_id`),
  KEY `idx_winner_id` (`winner_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='中奖者表';

-- 10. 分红记录表
CREATE TABLE IF NOT EXISTS `dividends` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分红ID',
  `lottery_id` INT UNSIGNED NOT NULL COMMENT '开奖ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '分红金额',
  `dividend_type` VARCHAR(20) DEFAULT NULL COMMENT '分红类型：winner/participant/leader',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-待发放，1-已发放',
  `paid_at` DATETIME DEFAULT NULL COMMENT '发放时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_lottery_id` (`lottery_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分红记录表';

-- 11. 内容表（发现页内容）
CREATE TABLE IF NOT EXISTS `contents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '内容ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT DEFAULT NULL COMMENT '内容',
  `type` VARCHAR(20) NOT NULL COMMENT '类型：trending/insight/story',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `author` VARCHAR(100) DEFAULT NULL COMMENT '作者',
  `view_count` INT UNSIGNED DEFAULT 0 COMMENT '浏览量',
  `like_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  `collect_count` INT UNSIGNED DEFAULT 0 COMMENT '收藏数',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `is_recommend` TINYINT DEFAULT 0 COMMENT '是否推荐：0-否，1-是',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `published_at` DATETIME DEFAULT NULL COMMENT '发布时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_is_recommend` (`is_recommend`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容表';

-- 12. 轮播图表
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '轮播图ID',
  `title` VARCHAR(200) DEFAULT NULL COMMENT '标题',
  `image_url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `link_url` VARCHAR(255) DEFAULT NULL COMMENT '链接地址',
  `link_type` VARCHAR(20) DEFAULT NULL COMMENT '链接类型：product/content/external',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轮播图表';

-- 13. 用户地址表
CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `recipient` VARCHAR(50) NOT NULL COMMENT '收货人',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `province` VARCHAR(50) DEFAULT NULL COMMENT '省份',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
  `district` VARCHAR(50) DEFAULT NULL COMMENT '区县',
  `address` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `postal_code` VARCHAR(10) DEFAULT NULL COMMENT '邮编',
  `is_default` TINYINT DEFAULT 0 COMMENT '是否默认：0-否，1-是',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户地址表';

-- 14. 财务流水表
CREATE TABLE IF NOT EXISTS `financial_records` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '流水ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` VARCHAR(20) NOT NULL COMMENT '类型：recharge/withdraw/payment/refund/dividend',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '金额（正数为收入，负数为支出）',
  `balance_before` DECIMAL(10,2) DEFAULT 0.00 COMMENT '变动前余额',
  `balance_after` DECIMAL(10,2) DEFAULT 0.00 COMMENT '变动后余额',
  `related_id` INT UNSIGNED DEFAULT NULL COMMENT '关联ID（订单ID、支付ID等）',
  `related_type` VARCHAR(50) DEFAULT NULL COMMENT '关联类型',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='财务流水表';

-- 15. 消息通知表
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` VARCHAR(20) NOT NULL COMMENT '类型：system/order/promo',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT DEFAULT NULL COMMENT '内容',
  `is_read` TINYINT DEFAULT 0 COMMENT '是否已读：0-未读，1-已读',
  `read_at` DATETIME DEFAULT NULL COMMENT '阅读时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息通知表';

-- 16. 供应商表
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '供应商ID',
  `name` VARCHAR(100) NOT NULL COMMENT '供应商名称',
  `contact_person` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';

-- 17. 采购订单表
CREATE TABLE IF NOT EXISTS `purchase_orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '采购订单ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '采购单号',
  `supplier_id` INT UNSIGNED NOT NULL COMMENT '供应商ID',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '总金额',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-待确认，1-已确认，2-已发货，3-已入库，4-已完成',
  `expected_date` DATE DEFAULT NULL COMMENT '预计到货日期',
  `received_date` DATE DEFAULT NULL COMMENT '实际到货日期',
  `remark` TEXT DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_supplier_id` (`supplier_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='采购订单表';

-- 18. 物流公司表
CREATE TABLE IF NOT EXISTS `logistics_companies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '物流公司ID',
  `name` VARCHAR(100) NOT NULL COMMENT '物流公司名称',
  `code` VARCHAR(50) DEFAULT NULL COMMENT '物流代码',
  `api_url` VARCHAR(255) DEFAULT NULL COMMENT 'API接口地址',
  `api_key` VARCHAR(255) DEFAULT NULL COMMENT 'API密钥',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物流公司表';

-- 19. 系统配置表
CREATE TABLE IF NOT EXISTS `system_configs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
  `config_value` TEXT DEFAULT NULL COMMENT '配置值',
  `config_type` VARCHAR(20) DEFAULT 'string' COMMENT '配置类型：string/number/boolean/json',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 20. 操作日志表
CREATE TABLE IF NOT EXISTS `operation_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` INT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `action` VARCHAR(50) NOT NULL COMMENT '操作动作',
  `module` VARCHAR(50) DEFAULT NULL COMMENT '操作模块',
  `content` TEXT DEFAULT NULL COMMENT '操作内容',
  `ip` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT '用户代理',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

