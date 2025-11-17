import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentPluginDto } from './create-payment-plugin.dto';

export class UpdatePaymentPluginDto extends PartialType(CreatePaymentPluginDto) {}

