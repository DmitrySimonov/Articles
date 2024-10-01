import { Symbols } from '@/shared/types/symbols';

export type InsightSettingsSelectProps = {
  className?: string;
  selected: string;
  onSelect: (value: string) => void;
  onDeselect?: (value: string) => void;
  error?: string;
};

export type InsightSymbolSelectProps = {
  className?: string;
  selected: Symbols[];
  onChange: (symbol: Symbols[]) => void;
  error?: string;
};
