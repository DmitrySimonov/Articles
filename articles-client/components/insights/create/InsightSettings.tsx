import { UseFormReturn } from 'react-hook-form';
import { RoundedBox, Text, Select, FormButton, ErrorText } from '@/client-base/ui';
import { twm } from '@/client-base/utils/twm';
import { TextInput, TextAreaWithLabel } from '@/client-base/ui/inputs';
import { MARKET_DIRECTION } from '@/articles-client/articles/constants/market-direction';
import DollarIcon from '@/assets/images/svg/dollar-icon.svg?react';
import { ICreateInsightForm } from '@/articles-client/articles/types/create-insight';
import {
  InsightSettingsSelectProps,
  InsightSymbolSelectProps,
} from '@/articles-client/articles/types/create-insight-form';
import { FormField } from '@/client-base/ui/form';
import { Symbols } from '@/shared/types/symbols';

type Props = {
  className?: string;
  form: UseFormReturn<ICreateInsightForm>;
  symbolSelect: React.ComponentType<InsightSymbolSelectProps>;
  sectorSelect: React.ComponentType<InsightSettingsSelectProps>;
};

export function InsightSettings({ className, form, symbolSelect: SymbolSelect, sectorSelect: SectorSelect }: Props) {
  const { formState, register, control } = form;
  const { errors } = formState;

  return (
    <RoundedBox className={twm('flex flex-col w-full max-w-[424px] p-[22px]', className)}>
      <div className="flex items-center mb-3">
        <Text className="text-general-light/90 font-normal" size="sm" font="secondary">
          Tag the stocks affected
        </Text>
        <Text className="text-general-light/60 font-normal ml-2" size="xxs" font="secondary">
          (up to 4 symbols)
        </Text>
      </div>
      <FormField
        name="symbols"
        control={control}
        render={({ field }) => (
          <SymbolSelect
            className="mb-8"
            error={errors?.symbols?.message}
            selected={field.value}
            onChange={(value: Symbols[]) => {
              field.onChange(value);
            }}
          />
        )}
      />
      <Text className="text-general-light/90 font-normal mb-3" size="sm" font="secondary">
        Tag the sector affected
      </Text>
      <FormField
        name="sector"
        control={control}
        render={({ field }) => (
          <SectorSelect
            className="mb-8"
            error={errors?.sector?.message}
            selected={field.value}
            onSelect={(value: string) => {
              field.onChange(value);
            }}
          />
        )}
      />
      <FormField
        name="summary"
        control={control}
        render={({ field }) => (
          <TextAreaWithLabel
            label="Summary"
            className="w-full mb-8"
            labelClassName="text-general-light/90 font-secondary text-sm font-normal"
            textAreaClassName="max-h-[59px] min-h-[59px] text-xs"
            {...field}
            error={errors.summary?.message}
          />
        )}
      />
      <div className="flex flex-col mb-8">
        <Text className="text-general-light/90 mb-3 font-normal" size="sm" font="secondary">
          Select sentiment
        </Text>
        <FormField
          name="marketDirection"
          control={control}
          render={({ field }) => (
            <Select
              className="w-full h-10 justify-start shadow-input border-0"
              options={MARKET_DIRECTION}
              placeholder="Select"
              menuAlign="start"
              value={field.value?.toString()}
              onChange={field.onChange}
              error={errors.marketDirection?.message}
            />
          )}
        />
      </div>
      <div className="flex flex-col w-full mb-8">
        <Text className="text-general-light/90 mb-3 font-normal" size="sm" font="secondary">
          Set Price
        </Text>
        <TextInput
          placeholder="0000.00"
          className="bg-form-input-primary w-full max-w-[124px]"
          inputClassName="text-sm font-secondary"
          type="number"
          step={'0.01'}
          Icon={() => <DollarIcon color="hsla(var(--general-light), 0.6)" />}
          {...register('price', { valueAsNumber: true })}
        />
        {errors.price?.message && <ErrorText className="mb-0">{errors.price?.message}</ErrorText>}
      </div>
      <FormButton type="submit" title="PUBLISH" />
    </RoundedBox>
  );
}
