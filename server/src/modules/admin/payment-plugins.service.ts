import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentPlugin } from '../../entities/payment-plugin.entity';
import { CreatePaymentPluginDto } from './dto/create-payment-plugin.dto';
import { UpdatePaymentPluginDto } from './dto/update-payment-plugin.dto';

@Injectable()
export class AdminPaymentPluginsService {
  constructor(
    @InjectRepository(PaymentPlugin)
    private pluginsRepository: Repository<PaymentPlugin>,
  ) {}

  async findAll() {
    try {
      const plugins = await this.pluginsRepository.find({
        order: { sort_order: 'ASC', id: 'ASC' },
      });
      console.log('✅ 查询到支付插件数量:', plugins.length);
      return plugins;
    } catch (error) {
      console.error('❌ 查询支付插件失败:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const plugin = await this.pluginsRepository.findOne({ where: { id } });
    if (!plugin) {
      throw new NotFoundException('支付插件不存在');
    }
    return plugin;
  }

  async findByCode(pluginCode: string) {
    const plugin = await this.pluginsRepository.findOne({ where: { plugin_code: pluginCode } });
    if (!plugin) {
      throw new NotFoundException('支付插件不存在');
    }
    return plugin;
  }

  async create(createPluginDto: CreatePaymentPluginDto) {
    try {
      console.log('📝 创建支付插件:', createPluginDto);
      
      // 检查插件代码是否已存在
      const existing = await this.pluginsRepository.findOne({
        where: { plugin_code: createPluginDto.plugin_code },
      });
      if (existing) {
        throw new BadRequestException('插件代码已存在');
      }
      
      const plugin = this.pluginsRepository.create({
        ...createPluginDto,
        status: createPluginDto.status ?? 0,
        is_default: createPluginDto.is_default ?? 0,
        sort_order: createPluginDto.sort_order ?? 0,
        version: createPluginDto.version || '1.0.0',
        min_amount: createPluginDto.min_amount ?? 0,
        max_amount: createPluginDto.max_amount ?? null,
        fee_rate: createPluginDto.fee_rate ?? 0,
        fee_fixed: createPluginDto.fee_fixed ?? 0,
      });
      
      const saved = await this.pluginsRepository.save(plugin);
      const result = Array.isArray(saved) ? saved[0] : saved;
      console.log('✅ 支付插件创建成功, ID:', result.id);
      return result;
    } catch (error) {
      console.error('❌ 创建支付插件失败:', error);
      throw error;
    }
  }

  async update(id: number, updatePluginDto: UpdatePaymentPluginDto) {
    try {
      console.log('📝 更新支付插件, ID:', id, '数据:', updatePluginDto);
      const plugin = await this.findOne(id);
      
      // 如果更新插件代码，检查是否重复
      if (updatePluginDto.plugin_code && updatePluginDto.plugin_code !== plugin.plugin_code) {
        const existing = await this.pluginsRepository.findOne({
          where: { plugin_code: updatePluginDto.plugin_code },
        });
        if (existing) {
          throw new BadRequestException('插件代码已存在');
        }
      }
      
      Object.assign(plugin, updatePluginDto);
      const saved = await this.pluginsRepository.save(plugin);
      const result = Array.isArray(saved) ? saved[0] : saved;
      console.log('✅ 支付插件更新成功');
      return result;
    } catch (error) {
      console.error('❌ 更新支付插件失败:', error);
      throw error;
    }
  }

  async install(id: number) {
    try {
      console.log('📦 安装支付插件, ID:', id);
      const plugin = await this.findOne(id);
      
      if (plugin.status === 2) {
        throw new BadRequestException('插件已启用，无需重复安装');
      }
      
      plugin.status = 1; // 已安装
      plugin.install_time = new Date();
      await this.pluginsRepository.save(plugin);
      
      console.log('✅ 支付插件安装成功');
      return { message: '安装成功', plugin };
    } catch (error) {
      console.error('❌ 安装支付插件失败:', error);
      throw error;
    }
  }

  async enable(id: number) {
    try {
      console.log('✅ 启用支付插件, ID:', id);
      const plugin = await this.findOne(id);
      
      if (plugin.status === 0) {
        throw new BadRequestException('请先安装插件');
      }
      
      plugin.status = 2; // 已启用
      await this.pluginsRepository.save(plugin);
      
      console.log('✅ 支付插件启用成功');
      return { message: '启用成功', plugin };
    } catch (error) {
      console.error('❌ 启用支付插件失败:', error);
      throw error;
    }
  }

  async disable(id: number) {
    try {
      console.log('❌ 禁用支付插件, ID:', id);
      const plugin = await this.findOne(id);
      
      plugin.status = 1; // 已安装但未启用
      await this.pluginsRepository.save(plugin);
      
      console.log('✅ 支付插件禁用成功');
      return { message: '禁用成功', plugin };
    } catch (error) {
      console.error('❌ 禁用支付插件失败:', error);
      throw error;
    }
  }

  async uninstall(id: number) {
    try {
      console.log('🗑️ 卸载支付插件, ID:', id);
      const plugin = await this.findOne(id);
      
      if (plugin.is_default === 1) {
        throw new BadRequestException('默认插件不能卸载');
      }
      
      plugin.status = 0; // 未安装
      plugin.install_time = null;
      plugin.config_data = null; // 清除配置
      await this.pluginsRepository.save(plugin);
      
      console.log('✅ 支付插件卸载成功');
      return { message: '卸载成功', plugin };
    } catch (error) {
      console.error('❌ 卸载支付插件失败:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      console.log('🗑️ 删除支付插件, ID:', id);
      const plugin = await this.pluginsRepository.findOne({ where: { id } });
      if (!plugin) {
        throw new NotFoundException('支付插件不存在');
      }
      
      if (plugin.is_default === 1) {
        throw new BadRequestException('默认插件不能删除');
      }
      
      await this.pluginsRepository.remove(plugin);
      console.log('✅ 支付插件删除成功, ID:', id);
      return { message: '删除成功', id };
    } catch (error) {
      console.error('❌ 删除支付插件失败:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`删除支付插件失败: ${error.message || error}`);
    }
  }

  async getEnabledPlugins(region?: string, currency?: string) {
    try {
      const queryBuilder = this.pluginsRepository
        .createQueryBuilder('plugin')
        .where('plugin.status = :status', { status: 2 }); // 已启用
      
      if (region) {
        // 使用JSON_CONTAINS查询，支持数组中的值或通配符"*"
        queryBuilder.andWhere(
          '(plugin.supported_regions IS NULL OR JSON_CONTAINS(plugin.supported_regions, :region) OR JSON_CONTAINS(plugin.supported_regions, :wildcard))',
          { region: `"${region}"`, wildcard: '"*"' }
        );
      }
      
      if (currency) {
        queryBuilder.andWhere(
          '(plugin.supported_currencies IS NULL OR JSON_CONTAINS(plugin.supported_currencies, :currency))',
          { currency: `"${currency}"` }
        );
      }
      
      queryBuilder.orderBy('plugin.sort_order', 'ASC');
      
      const plugins = await queryBuilder.getMany();
      console.log('✅ 查询到可用支付插件数量:', plugins.length);
      return plugins;
    } catch (error) {
      console.error('❌ 查询可用支付插件失败:', error);
      throw error;
    }
  }
}

