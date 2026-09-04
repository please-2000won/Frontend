import InfoTooltip from '../InfoTooltip';

interface CurrencyInputProps {
  label: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  unit?: string;
  // 라벨 옆 (i) 아이콘에 표시할 부연 설명
  hint?: string;
}

const CurrencyInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  unit = '원',
  hint,
}: CurrencyInputProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-1.5">
        <label className="text-black font-semibold text-[16px]">{label}</label>
        {hint && <InfoTooltip text={hint} />}
      </div>
      <div className="flex bg-gray-100 rounded-lg p-4 items-center">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full text-right text-[20px] rounded-lg outline-none "
        />
        <span className="text-gray-700 text-[20px] pl-3">{unit}</span>
      </div>
    </div>
  );
};

export default CurrencyInput;
