import { AutocompleteSelect } from '@/client-base/ui/AutocompleteSelect';
import { ErrorText } from '@/client-base/ui/ErrorText';

type Props = {
  selected: string;
  onSelect: (sector: string) => void;
  onDeselect?: (sector: string) => void;
  className?: string;
  error?: string;
};

export const SectorSelect = ({ className, selected, onDeselect, onSelect, error }: Props) => {

  const SECTOR_MOCK = ['Health care', 'AI', 'IT', 'Medicine', 'Real Estate', 'Auto Manufacturing'];

  return (
    <div className="relative">
      <AutocompleteSelect
        options={SECTOR_MOCK}
        className={className}
        error={error}
        selected={selected}
        inputValue=""
        onInputChange={(value) => value} // TODO
        placeholder="Search and add sector"
        onSelect={onSelect}
        onDeselect={onDeselect}
        getOptionLabel={(option) => option}
        getOptionValue={(option) => option}
        isMultiple={false}
      />
      {error && (
        <div className="flex">
          <ErrorText className="mb-0">{error}</ErrorText>
        </div>
      )}
    </div>
  );
};
