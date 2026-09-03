interface CurrencyInput {
  lable: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  unit?: string;
}

const CurrencyInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  unit = '원',
}: any) => {
  return (
    <div className="flex flex-col gap-5">
      <label className="text-black font-semibold text-[16px]">{label}</label>
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
